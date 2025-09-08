export const LOCAL_PRJ_BY_EPSG: Record<string, string> = {
  // EPSG:3857 – WGS 84 / Pseudo-Mercator
  '3857':
    'PROJCS["WGS_84_Pseudo_Mercator",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0],PARAMETER["False_Northing",0],PARAMETER["Central_Meridian",0],PARAMETER["Standard_Parallel_1",0],PARAMETER["Auxiliary_Sphere_Type",0],UNIT["Meter",1]]',

  // EJEMPLO: EPSG:2272 – NAD83 / Pennsylvania South (ftUS)
  '2272':
    'PROJCS["NAD_1983_StatePlane_Pennsylvania_South_FIPS_3702_Feet",GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137,298.257222101]],PRIMEM["Greenwich",0],UNIT["Degree",0.0174532925199433]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["False_Easting",1968500],PARAMETER["False_Northing",0],PARAMETER["Central_Meridian",-77.75],PARAMETER["Standard_Parallel_1",39.9333333333333],PARAMETER["Standard_Parallel_2",40.9666666666667],PARAMETER["Latitude_Of_Origin",39.3333333333333],UNIT["US_survey_foot",0.3048006096012192],AUTHORITY["EPSG","2272"]]',
};

export async function resolvePrj(epsg: string): Promise<string | undefined> {
  if (LOCAL_PRJ_BY_EPSG[epsg]) return LOCAL_PRJ_BY_EPSG[epsg];
  // Fallback “best effort” (si hay red y CORS lo permite)
  try {
    const r = await fetch(`https://epsg.io/${epsg}.prj`);
    if (r.ok) return await r.text();
  } catch {}
  return undefined;
}

