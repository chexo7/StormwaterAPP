#!/usr/bin/env python3
"""Utility script to update the MUSYM to HSG mapping file.

This script queries the USDA Soil Data Access API for all soil survey
areas and retrieves the hydrologic soil group (HSG) for each map unit
symbol (MUSYM). The results are merged with the existing
`data/soil-hsg-map.json` file.

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
from typing import Dict, Iterable, List

import requests

SDM_API_URL = "https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest"
DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "soil-hsg-map.json"


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


def get_area_symbols() -> List[str]:
    xml = run_query("SELECT DISTINCT areasymbol FROM legend")
    tables = parse_table(xml, ["areasymbol"])
    return [t["areasymbol"] for t in tables if t["areasymbol"]]


def fetch_musym_hsg(area: str) -> Dict[str, str]:
    sql = (
        "SELECT mu.musym, muagg.hydgrpdcd FROM legend l "
        "JOIN mapunit mu ON mu.lkey = l.lkey "
        "JOIN muaggatt muagg ON muagg.mukey = mu.mukey "
        f"WHERE l.areasymbol = '{area}' AND muagg.hydgrpdcd IS NOT NULL"
    )
    xml = run_query(sql)
    pairs = parse_table(xml, ["musym", "hydgrpdcd"])
    return {p["musym"]: p["hydgrpdcd"] for p in pairs if p["musym"] and p["hydgrpdcd"]}


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
    args = parser.parse_args(argv)

    if args.areas:
        areas = args.areas
    else:
        areas = get_area_symbols()

    update_map(areas)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
