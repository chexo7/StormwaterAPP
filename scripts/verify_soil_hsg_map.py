#!/usr/bin/env python3
"""Verify the MUSYM to HSG mapping against the USDA Soil Data Access API."""
from __future__ import annotations

import argparse
from typing import Iterable, Dict

from update_soil_hsg_map import (
    get_area_symbols,
    fetch_musym_hsg,
    fetch_all_musym_hsg,
    load_existing_map,
)


def verify_pairs(pairs: Dict[str, str], mapping: Dict[str, str]) -> int:
    mismatches = []
    for musym, hsg in pairs.items():
        mapped = mapping.get(musym)
        if mapped != hsg:
            mismatches.append((musym, mapped, hsg))
    if mismatches:
        print("Found mismatched HSG values:")
        for musym, mapped, hsg in mismatches[:20]:
            print(f"  {musym}: file={mapped!r} api={hsg!r}")
        print(f"Total mismatches: {len(mismatches)}")
        return 1
    print("No mismatches found.")
    return 0


def verify_areas(areas: Iterable[str]) -> int:
    mapping = load_existing_map()
    all_pairs: Dict[str, str] = {}
    for area in areas:
        print(f"Checking {area}...")
        try:
            pairs = fetch_musym_hsg(area)
            all_pairs.update(pairs)
        except Exception as exc:  # noqa: BLE001
            print(f"Failed to fetch {area}: {exc}")
    return verify_pairs(all_pairs, mapping)


def verify_all_fast() -> int:
    mapping = load_existing_map()
    print("Fetching all MUSYM/HSG pairs in bulk for verification...")
    try:
        pairs = fetch_all_musym_hsg()
    except Exception as exc:  # noqa: BLE001
        print(f"Bulk fetch failed: {exc}")
        return 1
    return verify_pairs(pairs, mapping)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Verify soil-hsg-map.json")
    parser.add_argument(
        "--areas",
        nargs="*",
        help="Area symbols to verify. Defaults to all areas.",
    )
    parser.add_argument(
        "--fast",
        action="store_true",
        help="Fetch all MUSYM/HSG pairs in one query",
    )
    args = parser.parse_args(argv)

    if args.fast:
        return verify_all_fast()

    if args.areas:
        areas = args.areas
    else:
        areas = get_area_symbols()

    return verify_areas(areas)


if __name__ == "__main__":
    raise SystemExit(main())
