"""FastAPI application exposing a GeoPackage export endpoint."""

from __future__ import annotations

import os
import tempfile
from typing import Dict

import geopandas as gpd
from fastapi import FastAPI
from fastapi.responses import FileResponse

from geoio import write_gpkg

app = FastAPI()


# Placeholder builders -------------------------------------------------------
# In the real application these functions should translate the in-memory
# network model into GeoDataFrames.  They are intentionally simple here so the
# export endpoint can be exercised without additional dependencies.


def build_pipes_gdf() -> gpd.GeoDataFrame:
    return gpd.GeoDataFrame(columns=[], geometry=[], crs="EPSG:4326")


def build_junctions_gdf() -> gpd.GeoDataFrame:
    return gpd.GeoDataFrame(columns=[], geometry=[], crs="EPSG:4326")


def build_subs_gdf() -> gpd.GeoDataFrame:
    return gpd.GeoDataFrame(columns=[], geometry=[], crs="EPSG:4326")


# Endpoint -----------------------------------------------------------------


@app.get("/export/gpkg")
async def export_gpkg() -> FileResponse:
    layers: Dict[str, gpd.GeoDataFrame] = {
        "pipes": build_pipes_gdf(),
        "junctions": build_junctions_gdf(),
        "subcatchments": build_subs_gdf(),
    }

    tmpdir = tempfile.mkdtemp()
    out_path = os.path.join(tmpdir, "network.gpkg")
    write_gpkg(layers, out_path)

    return FileResponse(
        out_path,
        media_type="application/geopackage+sqlite3",
        filename="network.gpkg",
    )
