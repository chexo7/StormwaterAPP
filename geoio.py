"""Utilities for writing stormwater network data to GeoPackage.

This module normalizes geometries, enforces a single CRS (WGS84) and
writes multiple layers to a single GeoPackage.  It is designed to avoid
common pitfalls such as invalid geometries or geometry-type mismatches.
"""

from __future__ import annotations

from pathlib import Path
from typing import Dict

import geopandas as gpd
from geopandas import GeoDataFrame
from shapely.geometry import LineString, MultiLineString
from shapely.ops import linemerge

# WGS84 is the standard CRS for all exported data
TARGET_CRS = "EPSG:4326"


def _to_wgs84(gdf: GeoDataFrame) -> GeoDataFrame:
    """Return *gdf* in the WGS84 CRS.

    If the GeoDataFrame lacks a CRS it is assumed to already be WGS84.
    Otherwise it is reprojected when necessary.
    """
    if gdf.crs is None:
        gdf = gdf.set_crs(TARGET_CRS)
    elif str(gdf.crs) != TARGET_CRS:
        gdf = gdf.to_crs(TARGET_CRS)
    return gdf


def _valid_rows(gdf: GeoDataFrame) -> GeoDataFrame:
    """Filter out null, empty or invalid geometries."""
    mask = (
        gdf.geometry.notnull()
        & ~gdf.geometry.is_empty
        & gdf.geometry.is_valid
    )
    return gdf[mask]


def _clean_lines(gdf: GeoDataFrame) -> GeoDataFrame:
    """Return only valid line geometries as LineStrings."""
    gdf = gdf.copy()
    gdf = gdf.explode(index_parts=False)
    gdf = _valid_rows(gdf)
    gdf = gdf[gdf.geometry.type.isin(["LineString", "MultiLineString"])]

    def _merge(geom):
        if isinstance(geom, MultiLineString):
            merged = linemerge(list(geom.geoms))
            # linemerge may produce MultiLineString again; ensure LineString
            if isinstance(merged, MultiLineString):
                # take individual parts as separate rows
                return [LineString(g.coords) for g in merged.geoms]
            return merged
        return geom

    geometries = []
    rows = []
    for _, row in gdf.iterrows():
        merged = _merge(row.geometry)
        if isinstance(merged, list):
            for geom in merged:
                rows.append(row.drop(labels="geometry"))
                geometries.append(geom)
        else:
            rows.append(row.drop(labels="geometry"))
            geometries.append(merged)
    return gpd.GeoDataFrame(rows, geometry=geometries, crs=gdf.crs)


def _clean_points(gdf: GeoDataFrame) -> GeoDataFrame:
    """Return only valid Point geometries."""
    gdf = gdf.copy()
    gdf = _valid_rows(gdf)
    return gdf[gdf.geometry.type == "Point"]


def _clean_polygons(gdf: GeoDataFrame) -> GeoDataFrame:
    """Return valid polygon geometries."""
    gdf = gdf.copy()
    gdf = gdf.explode(index_parts=False)
    gdf = _valid_rows(gdf)
    return gdf[gdf.geometry.type.isin(["Polygon", "MultiPolygon"])]


CLEANERS = {
    "pipes": _clean_lines,
    "junctions": _clean_points,
    "subcatchments": _clean_polygons,
}


def write_gpkg(layers: Dict[str, GeoDataFrame], out_path: str | Path) -> Path:
    """Write *layers* to a single GeoPackage at *out_path*.

    Parameters
    ----------
    layers:
        Mapping of layer name to ``GeoDataFrame``.
    out_path:
        Destination file path.  Existing files are overwritten.
    """
    out_path = Path(out_path)
    if out_path.exists():
        out_path.unlink()

    for name, gdf in layers.items():
        if gdf is None or gdf.empty:
            continue
        cleaner = CLEANERS.get(name, _valid_rows)
        gdf = cleaner(gdf)
        gdf = _to_wgs84(gdf)
        gdf.to_file(out_path, layer=name, driver="GPKG")

    return out_path
