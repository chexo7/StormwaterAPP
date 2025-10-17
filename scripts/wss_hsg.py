"""Fetch HSG values for a WSS shapefile by querying the Soil Data Access API.

This script reads the attribute table from a Web Soil Survey shapefile, pulls the
list of MUSYM values that appear in the file, and looks up the dominant
hydrologic soil group (HSG) for each symbol via the USDA Soil Data Access API.

Usage:
    python scripts/wss_hsg.py path/to/wss_shapefile.zip

The input may be either a `.zip` archive downloaded from the Web Soil Survey or
an extracted `.shp` file. By default the script writes a spreadsheet named
`hsg_por_symbol.xlsx` with the MUSYM/HSG table and reports how many polygons
received an automatic HSG assignment. Existing HSG values in the shapefile are
kept when they already contain a valid `A/B/C/D` code.
"""

from __future__ import annotations

import argparse
import json
import sys
import tempfile
import zipfile
from dataclasses import dataclass
from io import StringIO
from pathlib import Path
from typing import Iterable, List, Optional

import pandas as pd
import requests

try:
    import geopandas as gpd
except ImportError as exc:  # pragma: no cover - dependency is optional
    raise SystemExit(
        "geopandas is required to read the WSS shapefile. Install it with 'pip install geopandas'."
    ) from exc

ENDPOINT = "https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest?format=JSON"
HEADERS = {"Content-Type": "application/json", "Accept": "application/json"}


@dataclass
class WssAttributes:
    areasymbol: str
    musym_column: str
    hsg_column: Optional[str]


def run_sda_sql(sql: str) -> pd.DataFrame:
    response = requests.post(ENDPOINT, headers=HEADERS, json={"query": sql}, timeout=90)
    response.raise_for_status()
    text = response.text
    content_type = response.headers.get("Content-Type", "")

    if "application/json" in content_type or text.strip().startswith("{"):
        data = response.json()
        return pd.DataFrame(data.get("Table", []))

    return pd.read_xml(StringIO(text), xpath=".//Table")


def sanitize_hsg(raw: Optional[str]) -> str:
    if raw is None:
        return ""
    primary = raw.strip().upper().split("/")[0].split()[0] if raw.strip() else ""
    if primary in {"A", "B", "C", "D"}:
        return primary
    return ""


def detect_attribute_columns(df: pd.DataFrame) -> WssAttributes:
    lower_columns = {col.lower(): col for col in df.columns}
    area_key = lower_columns.get("areasymbol") or lower_columns.get("area_symbol")
    if not area_key:
        raise ValueError("No se encontró la columna AREASYMBOL en el shapefile del WSS.")

    musym_key = lower_columns.get("musym") or lower_columns.get("mu_sym")
    if not musym_key:
        raise ValueError("No se encontró la columna MUSYM en el shapefile del WSS.")

    hsg_key = lower_columns.get("hsg")
    return WssAttributes(areasymbol=str(df[area_key].iloc[0]).strip(), musym_column=musym_key, hsg_column=hsg_key)


def load_wss_table(path: Path) -> pd.DataFrame:
    if path.suffix.lower() == ".zip":
        with tempfile.TemporaryDirectory() as tmpdir:
            with zipfile.ZipFile(path, "r") as zf:
                zf.extractall(tmpdir)
            shp_files = list(Path(tmpdir).rglob("*.shp"))
            if not shp_files:
                raise FileNotFoundError("El archivo ZIP no contiene ningún .shp.")
            shp_path = shp_files[0]
            return gpd.read_file(shp_path)
    return gpd.read_file(path)


def hsg_por_simbolos(areasymbol: str, symbols: Iterable[str]) -> pd.DataFrame:
    cleaned = [s for s in {s.strip() for s in symbols if s and s.strip()}]
    if not cleaned:
        return pd.DataFrame(columns=["musym", "hsg"])

    chunks: List[List[str]] = [cleaned[i : i + 200] for i in range(0, len(cleaned), 200)]
    frames: List[pd.DataFrame] = []
    for chunk_syms in chunks:
        quoted = ",".join(f"'{s.replace("'", "''")}'" for s in chunk_syms)
        sql = f"""
        SELECT
          m.musym,
          (
            SELECT TOP 1 c.hydgrp
            FROM component c
            WHERE c.mukey = m.mukey
            ORDER BY c.comppct_r DESC
          ) AS hsg
        FROM legend l
        JOIN mapunit m ON l.lkey = m.lkey
        WHERE l.areasymbol = '{areasymbol.replace("'", "''")}'
          AND m.musym IN ({quoted});
        """
        frames.append(run_sda_sql(sql))
    if not frames:
        return pd.DataFrame(columns=["musym", "hsg"])
    df = pd.concat(frames, ignore_index=True)
    df = df.drop_duplicates(subset=["musym"], keep="first")
    df["hsg"] = df["hsg"].map(sanitize_hsg)
    return df[["musym", "hsg"]]


def merge_hsg(df: pd.DataFrame, attrs: WssAttributes, hsg_df: pd.DataFrame) -> pd.DataFrame:
    merged = df.copy()
    merged[attrs.musym_column] = merged[attrs.musym_column].astype(str).str.strip()
    merged = merged.merge(hsg_df, how="left", left_on=attrs.musym_column, right_on="musym")

    target_col = attrs.hsg_column or "HSG"
    existing = merged[target_col].astype(str).str.strip().str.upper() if attrs.hsg_column else None
    merged[target_col] = merged["hsg"].where(merged["hsg"].astype(bool), existing if attrs.hsg_column else "")
    merged[target_col] = merged[target_col].map(sanitize_hsg)
    merged = merged.drop(columns=[col for col in ["musym_y", "hsg"] if col in merged.columns])
    merged = merged.rename(columns={"musym_x": attrs.musym_column}) if "musym_x" in merged.columns else merged
    return merged


def main() -> int:
    parser = argparse.ArgumentParser(description="Autocompleta los valores HSG para un shapefile del Web Soil Survey.")
    parser.add_argument("input", help="Ruta al archivo .zip del WSS o al shapefile (.shp)")
    parser.add_argument(
        "--output",
        help="Ruta del archivo Excel donde guardar la tabla MUSYM/HSG (por defecto hsg_por_symbol.xlsx)",
        default="hsg_por_symbol.xlsx",
    )
    parser.add_argument("--json", help="Ruta opcional para exportar el mapa MUSYM→HSG en JSON")
    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        print(f"No se encontró el archivo: {input_path}", file=sys.stderr)
        return 1

    try:
        table = load_wss_table(input_path)
    except Exception as exc:  # pragma: no cover - runtime guard
        print(f"No se pudo leer el shapefile del WSS: {exc}", file=sys.stderr)
        return 1

    attrs = detect_attribute_columns(table)
    symbols = table[attrs.musym_column].astype(str).tolist()

    try:
        hsg_df = hsg_por_simbolos(attrs.areasymbol, symbols)
    except Exception as exc:  # pragma: no cover - network guard
        print(f"Error consultando la Soil Data Access API: {exc}", file=sys.stderr)
        hsg_df = pd.DataFrame(columns=["musym", "hsg"])

    merged = merge_hsg(table, attrs, hsg_df)

    hsg_col = "HSG" if "HSG" in merged.columns else (attrs.hsg_column or "HSG")
    total = len(merged)
    filled = merged[hsg_col].astype(str).str.len().gt(0).sum()
    print(f"Total de polígonos: {total}. HSG autocompletados: {filled}.")

    if args.output:
        out_path = Path(args.output)
        hsg_df.to_excel(out_path, index=False)
        print(f"Se guardó la tabla MUSYM/HSG en: {out_path}")

    if args.json:
        mapping = {row["musym"]: row["hsg"] for _, row in hsg_df.iterrows() if row["hsg"]}
        Path(args.json).write_text(json.dumps(mapping, indent=2), encoding="utf-8")
        print(f"Se exportó el mapa MUSYM→HSG a: {args.json}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
