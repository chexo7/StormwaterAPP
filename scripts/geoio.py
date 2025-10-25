from __future__ import annotations

"""Utilities for writing network layers to a GeoPackage in WGS84.

This module provides helpers to normalise GeoDataFrames and write them to a
single GeoPackage file.  All layers are cleaned, reprojected to WGS84 and
written as individual layers inside the package.
"""

from pathlib import Path
from typing import Dict

import geopandas as gpd
from shapely.geometry import LineString, MultiLineString, Point, Polygon, MultiPolygon
from shapely.ops import linemerge

TARGET_CRS = "EPSG:4326"


def _to_wgs84(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Return ``gdf`` reprojected to WGS84.

    If the GeoDataFrame has no CRS it is assumed to already be in WGS84 and the
    CRS is assigned.  Otherwise the data are reprojected when necessary.
    """

    if gdf.crs is None:
        return gdf.set_crs(TARGET_CRS)
    if str(gdf.crs) != TARGET_CRS:
        return gdf.to_crs(TARGET_CRS)
    return gdf


def _clean_lines(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Normalise a GeoDataFrame containing line features.

    Explodes multipart geometries, removes empty/invalid features and ensures
    everything is stored as ``LineString`` objects.  ``MultiLineString`` values
    are merged into single ``LineString`` features where possible.
    """

    if gdf.empty:
        return gdf

    gdf = gdf.explode(ignore_index=True)

    def _fix(geom):
        if geom is None or geom.is_empty:
            return None
        if isinstance(geom, LineString):
            return geom if geom.is_valid else None
        if isinstance(geom, MultiLineString):
            merged = linemerge(geom)
            if isinstance(merged, LineString) and merged.is_valid:
                return merged
            return None
        return None

    gdf["geometry"] = gdf.geometry.map(_fix)
    gdf = gdf.dropna(subset=["geometry"])
    return gdf


def _clean_points(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Remove non-point, empty or invalid geometries from ``gdf``."""

    if gdf.empty:
        return gdf

    gdf = gdf[gdf.geometry.notnull()]
    gdf = gdf[gdf.geometry.type == "Point"]
    gdf = gdf[gdf.is_valid]
    return gdf.reset_index(drop=True)


def _clean_polygons(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Normalise polygon features by exploding and dropping invalid ones."""

    if gdf.empty:
        return gdf

    gdf = gdf.explode(ignore_index=True)

    def _fix(geom):
        if geom is None or geom.is_empty:
            return None
        if isinstance(geom, Polygon) and geom.is_valid:
            return geom
        if isinstance(geom, MultiPolygon):
            parts = [p for p in geom.geoms if p.is_valid]
            if parts:
                return max(parts, key=lambda p: p.area)
        return None

    gdf["geometry"] = gdf.geometry.map(_fix)
    gdf = gdf.dropna(subset=["geometry"])
    return gdf


def write_gpkg(layers: Dict[str, gpd.GeoDataFrame], out_path: str) -> None:
    """Write ``layers`` to ``out_path`` as individual GeoPackage layers.

    Parameters
    ----------
    layers:
        Mapping of layer names to GeoDataFrames.  Empty or ``None`` layers are
        ignored.
    out_path:
        File path for the GeoPackage to create.
    """

    path = Path(out_path)
    if path.exists():
        path.unlink()

    for name, gdf in layers.items():
        if gdf is None or gdf.empty:
            continue
        if name == "pipes":
            gdf = _clean_lines(gdf)
        elif name == "junctions":
            gdf = _clean_points(gdf)
        elif name == "subcatchments":
            gdf = _clean_polygons(gdf)
        else:
            gdf = gdf.copy()
        gdf = _to_wgs84(gdf)
        gdf.to_file(path, layer=name, driver="GPKG")
