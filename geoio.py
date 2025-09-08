import os
from typing import Dict

import geopandas as gpd
from shapely.geometry import LineString, MultiLineString, Point, Polygon, MultiPolygon
from shapely.ops import linemerge

TARGET_CRS = "EPSG:4326"


def _to_wgs84(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Ensure the GeoDataFrame has WGS84 (EPSG:4326) as its CRS."""
    if gdf.crs is None:
        return gdf.set_crs(TARGET_CRS)
    if gdf.crs.to_string().upper() != TARGET_CRS:
        return gdf.to_crs(TARGET_CRS)
    return gdf


def _clean_lines(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Explode, drop invalid/empty lines and normalise to LineString."""
    gdf = gdf.explode(index_parts=False)
    gdf = gdf[~gdf.geometry.is_empty & gdf.geometry.notnull() & gdf.is_valid]

    def _normalise(geom):
        if isinstance(geom, MultiLineString):
            merged = linemerge(geom)
            if isinstance(merged, MultiLineString):
                lines = list(merged.geoms)
                lines.sort(key=lambda g: g.length, reverse=True)
                return lines[0]
            return merged
        return geom if isinstance(geom, LineString) else None

    gdf = gdf.assign(geometry=gdf.geometry.map(_normalise))
    gdf = gdf[gdf.geometry.notnull()]
    return gdf


def _clean_points(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Drop invalid or non-point geometries."""
    gdf = gdf[~gdf.geometry.is_empty & gdf.geometry.notnull() & gdf.is_valid]
    gdf = gdf[gdf.geometry.type == "Point"]
    return gdf


def _clean_polygons(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Explode multipolygons and drop invalid/empty ones."""
    gdf = gdf.explode(index_parts=False)
    gdf = gdf[~gdf.geometry.is_empty & gdf.geometry.notnull() & gdf.is_valid]

    def _ensure_poly(geom):
        if isinstance(geom, MultiPolygon):
            parts = list(geom.geoms)
            if len(parts) == 1:
                return parts[0]
            return MultiPolygon(parts)
        return geom if isinstance(geom, Polygon) else None

    gdf = gdf.assign(geometry=gdf.geometry.map(_ensure_poly))
    gdf = gdf[gdf.geometry.notnull()]
    return gdf


def write_gpkg(layers: Dict[str, gpd.GeoDataFrame], out_path: str) -> str:
    """Write layers to a single GeoPackage in WGS84.

    Parameters
    ----------
    layers: dict
        Mapping of layer name to GeoDataFrame.
    out_path: str
        Output file path for the GeoPackage.
    Returns
    -------
    str
        Path to the written GeoPackage.
    """
    if os.path.exists(out_path):
        os.remove(out_path)

    cleaners = {
        "pipes": _clean_lines,
        "junctions": _clean_points,
        "subcatchments": _clean_polygons,
    }

    for name, gdf in layers.items():
        if gdf is None or gdf.empty:
            continue
        cleaner = cleaners.get(name, lambda x: x)
        layer = _to_wgs84(cleaner(gdf.copy()))
        layer.to_file(out_path, layer=name, driver="GPKG")
    return out_path
