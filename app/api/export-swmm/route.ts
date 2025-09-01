import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import { join } from "path";
import proj4 from "proj4";
import bbox from "@turf/bbox";
import type { Polygon, Position } from "geojson";

// Asegura runtime Node (necesario para fs en Vercel)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Ruta a tu template en el repo (ajústala si cambias estructura)
const TEMPLATE_PATH = join(process.cwd(), "export_templates", "swmm", "SWMM_TEMPLATE.inp");

/** ---------- Utilidades geométricas ---------- **/

// Definición EPSG:4326 → EPSG:3857 (Web Mercator, metros)
const EPSG4326 = "+proj=longlat +datum=WGS84 +no_defs";
const EPSG3857 = "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs";

function projectPolygonTo3857(poly: Polygon): Polygon {
  const coords = poly.coordinates.map((ring) =>
    ring.map(([lon, lat]) => proj4(EPSG4326, EPSG3857, [lon, lat]) as Position)
  );
  return { type: "Polygon", coordinates: coords };
}

// Área por fórmula de “shoelace” sobre un anillo en metros
function ringAreaMeters(ring: Position[]): number {
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

function polygonAreaMeters(poly: Polygon): number {
  const [outer, ...holes] = poly.coordinates;
  let area = ringAreaMeters(outer);
  for (const hole of holes) area -= ringAreaMeters(hole);
  return area;
}

// Heurística de Width: área / eje_largo (diagonal del bbox)
function widthHeuristicMeters(poly: Polygon): number {
  const [minX, minY, maxX, maxY] = bbox(poly);
  const dx = maxX - minX;
  const dy = maxY - minY;
  const diag = Math.sqrt(dx * dx + dy * dy);
  const area = polygonAreaMeters(poly);
  const width = diag > 0 ? area / diag : 0;
  return Math.max(1, Number(width.toFixed(3))); // evita ceros
}

/** ---------- Utilidades INP ---------- **/

function linesFromText(text: string): string[] {
  return text.split(/\r?\n/);
}
function textFromLines(lines: string[]): string {
  // asegura newline al final
  if (lines.length === 0 || lines[lines.length - 1] !== "") lines.push("");
  return lines.join("\n");
}

// Encuentra el bloque [SECTION]; si no existe, lo crea al final y retorna {start,end}
function ensureSection(lines: string[], section: string): { start: number; end: number } {
  const hdr = `[${section.toUpperCase()}]`;
  let idx = lines.findIndex((l) => l.trim().toUpperCase() === hdr);
  if (idx === -1) {
    lines.push(hdr);
    lines.push(""); // línea en blanco
    idx = lines.length - 2;
  }
  // buscar fin del bloque (siguiente header o fin de archivo)
  let end = idx + 1;
  while (end < lines.length && !lines[end].trim().match(/^\[.+\]$/)) end++;
  return { start: idx, end };
}

// upsert: elimina filas previas con ese name (columna 1) y agrega nuevas al final del bloque
function upsertRows(lines: string[], section: string, name: string | null, newRows: string[]) {
  const { start, end } = ensureSection(lines, section);
  // limpia rows previas con el mismo Name al inicio de la fila
  if (name) {
    const nameRegex = new RegExp(`^\\s*${name}\\b`);
    for (let i = end - 1; i > start; i--) {
      if (lines[i].match(nameRegex)) lines.splice(i, 1);
    }
  }
  // inserta antes de end
  lines.splice(end, 0, ...newRows, "");
}

// formateo de columnas: padding simple
function pad(cols: (string | number)[], widths: number[]): string {
  return cols
    .map((v, i) => {
      const s = typeof v === "number" ? String(v) : v;
      return s.padEnd(widths[i] ?? s.length, " ");
    })
    .join("");
}

/** ---------- Tipos de payload ---------- **/
type Defaults = {
  raingage?: string;
  outlet?: string;
  imperv_frac?: number; // fracción
  slope?: number;       // fracción
  n_imperv?: number;
  n_perv?: number;
  dstore_imp_mm?: number;
  dstore_perv_mm?: number;
  pct_zero?: number;
  route_to?: "OUTLET" | "PERV";
  pct_routed?: number;
};

type SubcatchInput = {
  name: string;
  outlet?: string;
  polygon: Polygon; // en WGS84 (lon,lat) o ya en metros si indicas "alreadyProjected":true
  alreadyProjected?: boolean;
};

type Payload = {
  defaults: Defaults;
  subcatchments: SubcatchInput[];
};

/** ---------- Handler principal ---------- **/
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Payload;

    // 1) Leer template
    const templateText = await fs.readFile(TEMPLATE_PATH, "utf-8");
    const lines = linesFromText(templateText);

    // 2) Para cada subcatchment: reproyectar, calcular métricas y upsert
    for (const sc of body.subcatchments) {
      const d = body.defaults || {};

      // reproyección a metros si viene en lon/lat
      const polyMeters: Polygon = sc.alreadyProjected
        ? sc.polygon
        : projectPolygonTo3857(sc.polygon);

      // área y width
      const area_m2 = polygonAreaMeters(polyMeters);
      if (area_m2 <= 0) throw new Error(`Área inválida para ${sc.name}`);
      const area_ha = Number((area_m2 / 10000).toFixed(6));
      const width_m = widthHeuristicMeters(polyMeters);

      // %imperv y %slope (como porcentajes)
      const pctImp = Number(((d.imperv_frac ?? 0.25) * 100).toFixed(3));
      const pctSlope = Number(((d.slope ?? 0.005) * 100).toFixed(3)); // 0.5% → 0.5

      const name = sc.name;
      const raingage = d.raingage ?? "RG1";
      const outlet = sc.outlet ?? d.outlet ?? "J1";
      const curbLen = 0; // simple por ahora

      // 2.1 SUBCATCHMENTS
      // ;;Name  RainGage  Outlet  Area  %Imperv  Width  %Slope  CurbLen  SnowPack
      const subcatchRow = pad(
        [
          name, raingage, outlet,
          area_ha.toFixed(6),
          pctImp.toFixed(3),
          width_m.toFixed(3),
          pctSlope.toFixed(3),
          curbLen.toFixed(0)
        ],
        [16, 16, 16, 10, 9, 9, 9, 8]
      );

      upsertRows(lines, "SUBCATCHMENTS", name, [subcatchRow]);

      // 2.2 SUBAREAS
      const nImp = (d.n_imperv ?? 0.010).toFixed(3);
      const nPerv = (d.n_perv ?? 0.100).toFixed(3);
      const sImp = (d.dstore_imp_mm ?? 1.5).toFixed(3);
      const sPerv = (d.dstore_perv_mm ?? 5.0).toFixed(3);
      const pctZero = (d.pct_zero ?? 25).toFixed(0);
      const routeTo = (d.route_to ?? "OUTLET").padEnd(7, " ");
      const pctRouted = (d.pct_routed ?? 100).toFixed(0);

      const subareasRow = pad(
        [name, nImp, nPerv, sImp, sPerv, pctZero, routeTo, pctRouted],
        [16, 10, 10, 10, 10, 9, 8, 10]
      );
      upsertRows(lines, "SUBAREAS", name, [subareasRow]);

      // 2.3 POLYGONS (una fila por vértice)
      const ring = polyMeters.coordinates[0];
      // aseguramos cierre
      const closed = ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]
        ? ring
        : [...ring, ring[0]];
      const polygonRows = closed.map(([x, y]) => {
        // Name  X  Y  (3 decimales como tu template)
        return `${name.padEnd(16, " ")}${x.toFixed(3).padEnd(12, " ")}${y.toFixed(3)}`;
      });
      upsertRows(lines, "POLYGONS", name, polygonRows);
    }

    // 3) Texto final y descarga
    const output = textFromLines(lines);
    return new Response(output, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": 'attachment; filename="model_generated.inp"'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? String(err) }), { status: 400 });
  }
}
