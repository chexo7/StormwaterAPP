#!/usr/bin/env python3
"""Utility script to update the MUSYM to HSG mapping file.

This script queries the USDA Soil Data Access API and retrieves the
hydrologic soil group (HSG) for each map unit symbol (MUSYM). By
default it fetches data area by area which can take a long time.  A
``--fast`` option is provided to download all available pairs in a
single query.  The results are merged with the existing
``public/data/soil-hsg-map.json`` file.

Usage::
    python update_soil_hsg_map.py [--areas AREA1 AREA2 ...]
If no areas are provided, all available areas are fetched. Fetching
all areas may take a long time.
"""

from __future__ import annotations

import argparse
import json
import sys
import time
import xml.etree.ElementTree as ET
from pathlib import Path
from collections import Counter
from typing import Dict, Iterable, List

import requests

SDM_API_URL = "https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest"
DATA_PATH = (
    Path(__file__).resolve().parents[1]
    / "public"
    / "data"
    / "soil-hsg-map.json"
)


def run_query(sql: str) -> str:
    """Send a SQL query to the Soil Data Access API and return raw XML."""
    resp = requests.post(SDM_API_URL, json={"query": sql})
    resp.raise_for_status()
    return resp.text


def parse_table(xml: str, columns: Iterable[str]) -> List[Dict[str, str]]:
    root = ET.fromstring(xml)
    results = []
    for table in root.findall(".//Table"):
        row = {col: table.findtext(col) for col in columns}
        results.append(row)
    return results


def clean_hsg_token(raw: str | None) -> str:
    if raw is None:
        return ""
    text = str(raw).strip().upper()
    for letter in ("A", "B", "C", "D"):
        if letter in text:
            return letter
    return ""


def summarize_hsg(rows: Iterable[Dict[str, str]]) -> Dict[str, str]:
    grouped: Dict[str, Counter[str]] = {}
    for row in rows:
        musym_raw = row.get("musym") or ""
        musym = musym_raw.strip().upper()
        if not musym:
            continue
        token = clean_hsg_token(row.get("hsg"))
        if not token:
            continue
        grouped.setdefault(musym, Counter())[token] += 1

    summary: Dict[str, str] = {}
    for musym, counter in grouped.items():
        if not counter:
            continue
        max_count = max(counter.values())
        candidates = sorted([k for k, v in counter.items() if v == max_count])
        if candidates:
            summary[musym] = candidates[0]
    return summary


def get_area_symbols() -> List[str]:
    xml = run_query("SELECT DISTINCT areasymbol FROM legend")
    tables = parse_table(xml, ["areasymbol"])
    return [t["areasymbol"] for t in tables if t["areasymbol"]]


def fetch_musym_hsg(area: str) -> Dict[str, str]:
    safe_area = area.replace("'", "''")
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
        JOIN mapunit m ON m.lkey = l.lkey
        WHERE l.areasymbol = '{safe_area}' AND m.musym IS NOT NULL
    """
    xml = run_query(sql)
    rows = parse_table(xml, ["musym", "hsg"])
    return summarize_hsg(rows)


def fetch_all_musym_hsg() -> Dict[str, str]:
    """Fetch all MUSYM to HSG pairs in a single API query."""
    sql = """
        SELECT
          m.musym,
          (
            SELECT TOP 1 c.hydgrp
            FROM component c
            WHERE c.mukey = m.mukey
            ORDER BY c.comppct_r DESC
          ) AS hsg
        FROM mapunit m
        WHERE m.musym IS NOT NULL
    """
    xml = run_query(sql)
    rows = parse_table(xml, ["musym", "hsg"])
    return summarize_hsg(rows)


def load_existing_map() -> Dict[str, str]:
    if DATA_PATH.exists():
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_map(map_data: Dict[str, str]) -> None:
    DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(map_data, f, indent=2, sort_keys=True)


def update_map(areas: Iterable[str]) -> None:
    existing = load_existing_map()
    for idx, area in enumerate(areas, 1):
        try:
            print(f"[{idx}/{len(areas)}] Fetching {area}...")
            pairs = fetch_musym_hsg(area)
            existing.update(pairs)
            time.sleep(0.2)  # be kind to the API
        except Exception as exc:  # noqa: BLE001
            print(f"Failed to fetch {area}: {exc}", file=sys.stderr)
    save_map(existing)


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Update soil-hsg-map.json")
    parser.add_argument(
        "--areas",
        nargs="*",
        help="Optional list of area symbols to fetch. Defaults to all areas.",
    )
    parser.add_argument(
        "--fast",
        action="store_true",
        help="Fetch all MUSYM/HSG pairs in a single query (may be large)",
    )
    args = parser.parse_args(argv)

    if args.fast:
        existing = load_existing_map()
        try:
            print("Fetching all MUSYM/HSG pairs in bulk...")
            pairs = fetch_all_musym_hsg()
            existing.update(pairs)
            save_map(existing)
        except Exception as exc:  # noqa: BLE001
            print(f"Bulk fetch failed: {exc}", file=sys.stderr)
            return 1
        return 0
    elif args.areas:
        areas = args.areas
    else:
        areas = get_area_symbols()

    update_map(areas)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
