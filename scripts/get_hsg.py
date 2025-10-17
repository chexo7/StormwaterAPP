# get_hsg.py
"""
Función para obtener el HSG (Hydrologic Soil Group) dominante a partir de un símbolo de suelo USDA NRCS (musym).
Entrada: musym como string, por ejemplo "BhC2".
Salida: un string con la letra del grupo HSG "A", "B", "C" o "D".
Si el valor en la base viene como "B/D", se devuelve solo "B".
Si existen varias mapunits con el mismo musym en distintas áreas, se toma el HSG más frecuente.
Requiere conexión a internet para consultar SDA Tabular Data Access.
"""

from __future__ import annotations

import re
import sys
from collections import Counter
from io import StringIO
from typing import Optional

import pandas as pd
import requests

ENDPOINT = "https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest?format=JSON"
HEADERS = {"Content-Type": "application/json", "Accept": "application/json"}


def _run_sda_sql(sql: str) -> pd.DataFrame:
    """Ejecuta una consulta SQL contra SDA y devuelve un DataFrame con la tabla 'Table'.
    Hace fallback a XML si el servidor no devuelve JSON.
    """
    r = requests.post(ENDPOINT, headers=HEADERS, json={"query": sql}, timeout=90)
    txt = r.text
    ct = r.headers.get("Content-Type", "")

    if "application/json" in ct or txt.lstrip().startswith("{"):
        data = r.json()
        return pd.DataFrame(data.get("Table", []))

    # Fallback XML
    return pd.read_xml(StringIO(txt), xpath=".//Table")


def _clean_hsg_token(raw: Optional[str]) -> Optional[str]:
    """Normaliza hydgrp devolviendo solo la primera letra A B C o D.
    Ejemplos:
      "B/D" -> "B"
      "  a/b " -> "A"
      "C" -> "C"
    Devuelve None si no logra extraer letra válida.
    """
    if raw is None or (isinstance(raw, float) and pd.isna(raw)):
        return None
    s = str(raw).upper().strip()
    # Tomar solo la primera letra A B C o D
    m = re.search(r"[ABCD]", s)
    return m.group(0) if m else None


def get_hsg(musym: str) -> str:
    """Devuelve el HSG dominante para un musym.
    Si hay varias coincidencias de mapunit con ese musym, retorna el HSG más frecuente.
    Si no hay datos válidos, retorna cadena vacía.
    """
    musym = musym.strip().replace("'", "''")  # escape mínimo por seguridad de SQL

    # Consulta: por cada mapunit que tenga ese musym, obtener el hydgrp del componente dominante
    # por porcentaje areal (comppct_r). No filtramos por 'areasymbol' para permitir uso con solo musym.
    sql = f"""
    SELECT
      m.musym,
      (
        SELECT TOP 1 c.hydgrp
        FROM component c
        WHERE c.mukey = m.mukey
        ORDER BY c.comppct_r DESC
      ) AS hsg
    FROM mapunit m
    WHERE m.musym = '{musym}';
    """

    df = _run_sda_sql(sql)
    if df.empty or "hsg" not in df.columns:
        return ""

    # Limpiar y quedarnos con primera letra válida
    tokens = [t for t in (_clean_hsg_token(v) for v in df["hsg"].tolist()) if t is not None]
    if not tokens:
        return ""

    # Elegir la moda. Si hay empate, escoger la menor en orden alfabético para determinismo.
    cnt = Counter(tokens)
    max_freq = max(cnt.values())
    candidatos = sorted([k for k, v in cnt.items() if v == max_freq])
    return candidatos[0] if candidatos else ""


if __name__ == "__main__":
    # Uso por CLI: imprime solo el HSG, sin texto adicional.
    # Ejemplos:
    #   python get_hsg.py BhC2
    #   echo BhC2 | python get_hsg.py
    if len(sys.argv) >= 2:
        _musym = sys.argv[1]
    else:
        _musym = sys.stdin.read().strip()
    out = get_hsg(_musym) if _musym else ""
    # Imprimir un puro output
    print(out)
