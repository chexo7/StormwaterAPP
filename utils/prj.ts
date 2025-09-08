export const ESRI_PRJ_BY_EPSG: Record<string, string> = {
  // EPSG:4326 – WGS 84
  '4326':
    'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]',

  // EPSG:3857 – WGS 84 / Pseudo-Mercator
  '3857':
    'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",0.0],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]',

  // EPSG:32718 – WGS 84 / UTM zone 18S
  '32718':
    'PROJCS["WGS_1984_UTM_Zone_18S",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",10000000.0],PARAMETER["Central_Meridian",-75.0],PARAMETER["Scale_Factor",0.9996],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]',

  // EPSG:32719 – WGS 84 / UTM zone 19S
  '32719':
    'PROJCS["WGS_1984_UTM_Zone_19S",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",10000000.0],PARAMETER["Central_Meridian",-69.0],PARAMETER["Scale_Factor",0.9996],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]',

  // EPSG:5361 – SIRGAS-Chile 2002 / UTM zone 19S
  '5361':
    'PROJCS["SIRGAS-Chile_2002_UTM_Zone_19S",GEOGCS["GCS_SIRGAS-Chile_2002",DATUM["SIRGAS-Chile_realization_1_epoch_2002",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",10000000.0],PARAMETER["Central_Meridian",-69.0],PARAMETER["Scale_Factor",0.9996],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]',

  // EPSG:5367 – CRTM05 (Costa Rica Transverse Mercator)
  '5367':
    'PROJCS["CRTM05",GEOGCS["GCS_CR05",DATUM["D_Costa_Rica_2005",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-84.0],PARAMETER["Scale_Factor",0.9999],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]',

  // EPSG:2272 – NAD83 / Pennsylvania South (ftUS)
  '2272':
    'PROJCS["NAD_1983_StatePlane_Pennsylvania_South_FIPS_3702_Feet",GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Lambert_Conformal_Conic"],PARAMETER["False_Easting",1968500.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-77.75],PARAMETER["Standard_Parallel_1",40.9666666666667],PARAMETER["Standard_Parallel_2",39.9333333333333],PARAMETER["Latitude_Of_Origin",39.3333333333333],UNIT["US survey foot",0.304800609601219]]',
};

export async function resolvePrj(epsg: string): Promise<string> {
  if (ESRI_PRJ_BY_EPSG[epsg]) return ESRI_PRJ_BY_EPSG[epsg];
  // Optional last attempt: request from epsg.io
  try {
    const r = await fetch(`https://epsg.io/${epsg}.esriwkt`);
    if (r.ok) return await r.text();
  } catch {}
  throw new Error(`No PRJ found for EPSG:${epsg}`);
}
