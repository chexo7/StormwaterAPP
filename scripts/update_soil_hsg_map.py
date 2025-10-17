# get_hsg_text.py
"""
Script interactivo para obtener el HSG (Hydrologic Soil Group) dominante
a partir de un símbolo de suelo USDA NRCS (musym).

Entrada: texto ingresado por el usuario (ej. "BhC2")
Salida: texto con la letra del grupo HSG ("A", "B", "C" o "D")
Si el valor viene como "B/D", devuelve solo "B".
"""

import re
from collections import Counter
from io import StringIO
import pandas as pd
import requests

ENDPOINT = "https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest?format=JSON"
HEADERS = {"Content-Type": "application/json", "Accept": "application/json"}


def _run_sda_sql(sql: str) -> pd.DataFrame:
    """Ejecuta una consulta SQL contra SDA y devuelve un DataFrame con la tabla 'Table'."""
    r = requests.post(ENDPOINT, headers=HEADERS, json={"query": sql}, timeout=90)
    txt = r.text
    ct = r.headers.get("Content-Type", "")

    if "application/json" in ct or txt.lstrip().startswith("{"):
        data = r.json()
        return pd.DataFrame(data.get("Table", []))

    return pd.read_xml(StringIO(txt), xpath=".//Table")


def _clean_hsg_token(raw: str) -> str | None:
    """Devuelve solo la primera letra A, B, C o D del campo HSG."""
    if raw is None or pd.isna(raw):
        return None
    s = str(raw).upper().strip()
    m = re.search(r"[ABCD]", s)
    return m.group(0) if m else None


def get_hsg(musym: str) -> str:
    """Obtiene el HSG dominante para un musym dado."""
    musym = musym.strip().replace("'", "''")
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

    tokens = [t for t in (_clean_hsg_token(v) for v in df["hsg"]) if t]
    if not tokens:
        return ""

    cnt = Counter(tokens)
    max_freq = max(cnt.values())
    candidatos = sorted([k for k, v in cnt.items() if v == max_freq])
    return candidatos[0] if candidatos else ""


if __name__ == "__main__":
    musym = input("Escribe el MUSYM: ").strip()
    if musym:
        hsg = get_hsg(musym)
        print(hsg)
    else:
        print("No ingresaste un MUSYM válido.")
