"""Utilities for exporting spatial data to GeoPackage in WGS84.

This module normalizes input GeoDataFrames by cleaning invalid
geometries and ensuring a consistent CRS (EPSG:4326). It then writes
multiple layers to a single GeoPackage file, each layer corresponding
to one dataset (e.g. pipes, junctions, subcatchments).
"""

from __future__ import annotations

from typing import Dict
import os

import geopandas as gpd
from shapely.geometry import (
    LineString,
    MultiLineString,
    Point,
    Polygon,
    MultiPolygon,
)
from shapely.ops import linemerge


TARGET_CRS = "EPSG:4326"


def _to_wgs84(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Return a GeoDataFrame projected to WGS84."""
    if gdf.crs is None:
        return gdf.set_crs(TARGET_CRS)
    if str(gdf.crs) != TARGET_CRS:
        return gdf.to_crs(TARGET_CRS)
    return gdf


def _clean_lines(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Normalize line geometries to valid LineStrings."""
    gdf = gdf.explode(index_parts=False)
    gdf = gdf[~gdf.geometry.is_empty & gdf.geometry.notnull()]
    gdf = gdf[gdf.geometry.is_valid]

    def _to_line(geom):
        if isinstance(geom, LineString):
            return geom
        if isinstance(geom, MultiLineString):
            merged = linemerge(geom)
            return merged if isinstance(merged, LineString) else None
        return None

    gdf["geometry"] = gdf.geometry.apply(_to_line)
    gdf = gdf[gdf.geometry.notnull()]
    return gdf


def _clean_points(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Ensure geometries are valid Points."""
    gdf = gdf.explode(index_parts=False)
    gdf = gdf[~gdf.geometry.is_empty & gdf.geometry.notnull()]
    gdf = gdf[gdf.geometry.is_valid]
    gdf = gdf[gdf.geometry.apply(lambda geom: isinstance(geom, Point))]
    return gdf


def _clean_polygons(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Ensure geometries are valid Polygons or MultiPolygons."""
    gdf = gdf.explode(index_parts=False)
    gdf = gdf[~gdf.geometry.is_empty & gdf.geometry.notnull()]
    gdf = gdf[gdf.geometry.is_valid]
    gdf = gdf[
        gdf.geometry.apply(lambda geom: isinstance(geom, (Polygon, MultiPolygon)))
    ]
    return gdf


def write_gpkg(layers: Dict[str, gpd.GeoDataFrame], out_path: str) -> None:
    """Write GeoDataFrames to a multi-layer GeoPackage.

    Parameters
    ----------
    layers: dict[str, GeoDataFrame]
        Mapping of layer name to GeoDataFrame.
    out_path: str
        Destination path for the GeoPackage file.
    """
    if os.path.exists(out_path):
        os.remove(out_path)

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
            gdf = gdf.explode(index_parts=False)
            gdf = gdf[~gdf.geometry.is_empty & gdf.geometry.notnull()]
            gdf = gdf[gdf.geometry.is_valid]

        gdf = _to_wgs84(gdf)
        gdf.to_file(out_path, layer=name, driver="GPKG")
