from fastapi import FastAPI
from fastapi.responses import FileResponse
import geopandas as gpd
import tempfile

from geoio import write_gpkg

app = FastAPI()


def build_pipes_gdf() -> gpd.GeoDataFrame:
    """Placeholder builder; replace with project-specific logic."""
    return gpd.GeoDataFrame(geometry=[], crs="EPSG:4326")


def build_junctions_gdf() -> gpd.GeoDataFrame:
    """Placeholder builder; replace with project-specific logic."""
    return gpd.GeoDataFrame(geometry=[], crs="EPSG:4326")


def build_subcatchments_gdf() -> gpd.GeoDataFrame:
    """Placeholder builder; replace with project-specific logic."""
    return gpd.GeoDataFrame(geometry=[], crs="EPSG:4326")


@app.get("/export/gpkg")
def export_gpkg():
    layers = {}
    pipes = build_pipes_gdf()
    if not pipes.empty:
        layers["pipes"] = pipes
    junctions = build_junctions_gdf()
    if not junctions.empty:
        layers["junctions"] = junctions
    subs = build_subcatchments_gdf()
    if not subs.empty:
        layers["subcatchments"] = subs

    tmp = tempfile.NamedTemporaryFile(suffix=".gpkg", delete=False)
    write_gpkg(layers, tmp.name)
    tmp.close()
    return FileResponse(
        tmp.name,
        media_type="application/geopackage+sqlite3",
        filename="network.gpkg",
    )
