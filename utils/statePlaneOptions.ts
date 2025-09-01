import { ProjectionOption } from "../types";

export const STATE_PLANE_OPTIONS: ProjectionOption[] = [
  {
    "epsg": "3857",
    "name": "WGS 84 / Pseudo-Mercator (m)",
    "proj4": "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
    "units": "meters"
  },
  {
    "epsg": "26729",
    "name": "NAD27 / Alabama East",
    "proj4": "+proj=tmerc +lat_0=30.5 +lon_0=-85.8333333333333 +k=0.99996 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26730",
    "name": "NAD27 / Alabama West",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-87.5 +k=0.999933333 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26731",
    "name": "NAD27 / Alaska zone 1",
    "proj4": "+proj=omerc +no_uoff +lat_0=57 +lonc=-133.666666666667 +alpha=323.130102361111 +gamma=323.130102361111 +k=0.9999 +x_0=5000000.001016 +y_0=-5000000.001016 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26740",
    "name": "NAD27 / Alaska zone 10",
    "proj4": "+proj=lcc +lat_0=51 +lon_0=-176 +lat_1=53.8333333333333 +lat_2=51.8333333333333 +x_0=914401.828803657 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26732",
    "name": "NAD27 / Alaska zone 2",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-142 +k=0.9999 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26733",
    "name": "NAD27 / Alaska zone 3",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-146 +k=0.9999 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26734",
    "name": "NAD27 / Alaska zone 4",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-150 +k=0.9999 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26735",
    "name": "NAD27 / Alaska zone 5",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-154 +k=0.9999 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26736",
    "name": "NAD27 / Alaska zone 6",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-158 +k=0.9999 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26737",
    "name": "NAD27 / Alaska zone 7",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-162 +k=0.9999 +x_0=213360.426720853 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26738",
    "name": "NAD27 / Alaska zone 8",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-166 +k=0.9999 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26739",
    "name": "NAD27 / Alaska zone 9",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-170 +k=0.9999 +x_0=182880.365760731 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26749",
    "name": "NAD27 / Arizona Central",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-111.916666666667 +k=0.9999 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26748",
    "name": "NAD27 / Arizona East",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-110.166666666667 +k=0.9999 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26750",
    "name": "NAD27 / Arizona West",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26751",
    "name": "NAD27 / Arkansas North",
    "proj4": "+proj=lcc +lat_0=34.3333333333333 +lon_0=-92 +lat_1=36.2333333333333 +lat_2=34.9333333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26752",
    "name": "NAD27 / Arkansas South",
    "proj4": "+proj=lcc +lat_0=32.6666666666667 +lon_0=-92 +lat_1=34.7666666666667 +lat_2=33.3 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26741",
    "name": "NAD27 / California zone I",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-122 +lat_1=41.6666666666667 +lat_2=40 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26742",
    "name": "NAD27 / California zone II",
    "proj4": "+proj=lcc +lat_0=37.6666666666667 +lon_0=-122 +lat_1=39.8333333333333 +lat_2=38.3333333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26743",
    "name": "NAD27 / California zone III",
    "proj4": "+proj=lcc +lat_0=36.5 +lon_0=-120.5 +lat_1=38.4333333333333 +lat_2=37.0666666666667 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26744",
    "name": "NAD27 / California zone IV",
    "proj4": "+proj=lcc +lat_0=35.3333333333333 +lon_0=-119 +lat_1=37.25 +lat_2=36 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26745",
    "name": "NAD27 / California zone V",
    "proj4": "+proj=lcc +lat_0=33.5 +lon_0=-118 +lat_1=35.4666666666667 +lat_2=34.0333333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26746",
    "name": "NAD27 / California zone VI",
    "proj4": "+proj=lcc +lat_0=32.1666666666667 +lon_0=-116.25 +lat_1=33.8833333333333 +lat_2=32.7833333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26799",
    "name": "NAD27 / California zone VII",
    "proj4": "+proj=lcc +lat_0=34.1333333333333 +lon_0=-118.333333333333 +lat_1=34.4166666666667 +lat_2=33.8666666666667 +x_0=1276106.4505969 +y_0=1268253.00685801 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26754",
    "name": "NAD27 / Colorado Central",
    "proj4": "+proj=lcc +lat_0=37.8333333333333 +lon_0=-105.5 +lat_1=39.75 +lat_2=38.45 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26753",
    "name": "NAD27 / Colorado North",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-105.5 +lat_1=39.7166666666667 +lat_2=40.7833333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26755",
    "name": "NAD27 / Colorado South",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-105.5 +lat_1=38.4333333333333 +lat_2=37.2333333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26758",
    "name": "NAD27 / Florida East",
    "proj4": "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-81 +k=0.999941177 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26760",
    "name": "NAD27 / Florida North",
    "proj4": "+proj=lcc +lat_0=29 +lon_0=-84.5 +lat_1=30.75 +lat_2=29.5833333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26759",
    "name": "NAD27 / Florida West",
    "proj4": "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-82 +k=0.999941177 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26766",
    "name": "NAD27 / Georgia East",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-82.1666666666667 +k=0.9999 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26767",
    "name": "NAD27 / Georgia West",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-84.1666666666667 +k=0.9999 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26769",
    "name": "NAD27 / Idaho Central",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-114 +k=0.999947368 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26768",
    "name": "NAD27 / Idaho East",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-112.166666666667 +k=0.999947368 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26770",
    "name": "NAD27 / Idaho West",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-115.75 +k=0.999933333 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26771",
    "name": "NAD27 / Illinois East",
    "proj4": "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-88.3333333333333 +k=0.999975 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26772",
    "name": "NAD27 / Illinois West",
    "proj4": "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-90.1666666666667 +k=0.999941177 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26773",
    "name": "NAD27 / Indiana East",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-85.6666666666667 +k=0.999966667 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26774",
    "name": "NAD27 / Indiana West",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-87.0833333333333 +k=0.999966667 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26775",
    "name": "NAD27 / Iowa North",
    "proj4": "+proj=lcc +lat_0=41.5 +lon_0=-93.5 +lat_1=43.2666666666667 +lat_2=42.0666666666667 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26776",
    "name": "NAD27 / Iowa South",
    "proj4": "+proj=lcc +lat_0=40 +lon_0=-93.5 +lat_1=41.7833333333333 +lat_2=40.6166666666667 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26777",
    "name": "NAD27 / Kansas North",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-98 +lat_1=39.7833333333333 +lat_2=38.7166666666667 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26778",
    "name": "NAD27 / Kansas South",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-98.5 +lat_1=38.5666666666667 +lat_2=37.2666666666667 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26779",
    "name": "NAD27 / Kentucky North",
    "proj4": "+proj=lcc +lat_0=37.5 +lon_0=-84.25 +lat_1=37.9666666666667 +lat_2=38.9666666666667 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26780",
    "name": "NAD27 / Kentucky South",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=36.7333333333333 +lat_2=37.9333333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26781",
    "name": "NAD27 / Louisiana North",
    "proj4": "+proj=lcc +lat_0=30.6666666666667 +lon_0=-92.5 +lat_1=31.1666666666667 +lat_2=32.6666666666667 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26782",
    "name": "NAD27 / Louisiana South",
    "proj4": "+proj=lcc +lat_0=28.6666666666667 +lon_0=-91.3333333333333 +lat_1=29.3 +lat_2=30.7 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26783",
    "name": "NAD27 / Maine East",
    "proj4": "+proj=tmerc +lat_0=43.8333333333333 +lon_0=-68.5 +k=0.9999 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26784",
    "name": "NAD27 / Maine West",
    "proj4": "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-70.1666666666667 +k=0.999966667 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6201",
    "name": "NAD27 / Michigan Central",
    "proj4": "+proj=lcc +lat_0=43.3166666666667 +lon_0=-84.3333333333333 +lat_1=44.1833333333333 +lat_2=45.7 +x_0=609601.219202438 +y_0=0 +k_0=1.0000382 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "5623",
    "name": "NAD27 / Michigan East",
    "proj4": "+proj=tmerc +lat_0=41.5 +lon_0=-83.6666666666667 +k=0.999942857 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6966",
    "name": "NAD27 / Michigan North",
    "proj4": "+proj=lcc +lat_0=44.7833333333333 +lon_0=-87 +lat_1=45.4833333333333 +lat_2=47.0833333333333 +x_0=609601.219202438 +y_0=0 +k_0=1.0000382 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "5624",
    "name": "NAD27 / Michigan Old Central",
    "proj4": "+proj=tmerc +lat_0=41.5 +lon_0=-85.75 +k=0.999909091 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6202",
    "name": "NAD27 / Michigan South",
    "proj4": "+proj=lcc +lat_0=41.5 +lon_0=-84.3333333333333 +lat_1=42.1 +lat_2=43.6666666666667 +x_0=609601.219202438 +y_0=0 +k_0=1.0000382 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "5625",
    "name": "NAD27 / Michigan West",
    "proj4": "+proj=tmerc +lat_0=41.5 +lon_0=-88.75 +k=0.999909091 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26792",
    "name": "NAD27 / Minnesota Central",
    "proj4": "+proj=lcc +lat_0=45 +lon_0=-94.25 +lat_1=45.6166666666667 +lat_2=47.05 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26791",
    "name": "NAD27 / Minnesota North",
    "proj4": "+proj=lcc +lat_0=46.5 +lon_0=-93.1 +lat_1=47.0333333333333 +lat_2=48.6333333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26793",
    "name": "NAD27 / Minnesota South",
    "proj4": "+proj=lcc +lat_0=43 +lon_0=-94 +lat_1=43.7833333333333 +lat_2=45.2166666666667 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26794",
    "name": "NAD27 / Mississippi East",
    "proj4": "+proj=tmerc +lat_0=29.6666666666667 +lon_0=-88.8333333333333 +k=0.99996 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26795",
    "name": "NAD27 / Mississippi West",
    "proj4": "+proj=tmerc +lat_0=30.5 +lon_0=-90.3333333333333 +k=0.999941177 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26797",
    "name": "NAD27 / Missouri Central",
    "proj4": "+proj=tmerc +lat_0=35.8333333333333 +lon_0=-92.5 +k=0.999933333 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26796",
    "name": "NAD27 / Missouri East",
    "proj4": "+proj=tmerc +lat_0=35.8333333333333 +lon_0=-90.5 +k=0.999933333 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26798",
    "name": "NAD27 / Missouri West",
    "proj4": "+proj=tmerc +lat_0=36.1666666666667 +lon_0=-94.5 +k=0.999941177 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32002",
    "name": "NAD27 / Montana Central",
    "proj4": "+proj=lcc +lat_0=45.8333333333333 +lon_0=-109.5 +lat_1=47.8833333333333 +lat_2=46.45 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32001",
    "name": "NAD27 / Montana North",
    "proj4": "+proj=lcc +lat_0=47 +lon_0=-109.5 +lat_1=48.7166666666667 +lat_2=47.85 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32003",
    "name": "NAD27 / Montana South",
    "proj4": "+proj=lcc +lat_0=44 +lon_0=-109.5 +lat_1=46.4 +lat_2=44.8666666666667 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32005",
    "name": "NAD27 / Nebraska North",
    "proj4": "+proj=lcc +lat_0=41.3333333333333 +lon_0=-100 +lat_1=41.85 +lat_2=42.8166666666667 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32006",
    "name": "NAD27 / Nebraska South",
    "proj4": "+proj=lcc +lat_0=39.6666666666667 +lon_0=-99.5 +lat_1=40.2833333333333 +lat_2=41.7166666666667 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32008",
    "name": "NAD27 / Nevada Central",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-116.666666666667 +k=0.9999 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32007",
    "name": "NAD27 / Nevada East",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-115.583333333333 +k=0.9999 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32009",
    "name": "NAD27 / Nevada West",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-118.583333333333 +k=0.9999 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32013",
    "name": "NAD27 / New Mexico Central",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.9999 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32012",
    "name": "NAD27 / New Mexico East",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-104.333333333333 +k=0.999909091 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32014",
    "name": "NAD27 / New Mexico West",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-107.833333333333 +k=0.999916667 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32016",
    "name": "NAD27 / New York Central",
    "proj4": "+proj=tmerc +lat_0=40 +lon_0=-76.5833333333333 +k=0.9999375 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32015",
    "name": "NAD27 / New York East",
    "proj4": "+proj=tmerc +lat_0=40 +lon_0=-74.3333333333333 +k=0.999966667 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32017",
    "name": "NAD27 / New York West",
    "proj4": "+proj=tmerc +lat_0=40 +lon_0=-78.5833333333333 +k=0.9999375 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32019",
    "name": "NAD27 / North Carolina",
    "proj4": "+proj=lcc +lat_0=33.75 +lon_0=-79 +lat_1=34.3333333333333 +lat_2=36.1666666666667 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32020",
    "name": "NAD27 / North Dakota North",
    "proj4": "+proj=lcc +lat_0=47 +lon_0=-100.5 +lat_1=47.4333333333333 +lat_2=48.7333333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32021",
    "name": "NAD27 / North Dakota South",
    "proj4": "+proj=lcc +lat_0=45.6666666666667 +lon_0=-100.5 +lat_1=46.1833333333333 +lat_2=47.4833333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32022",
    "name": "NAD27 / Ohio North",
    "proj4": "+proj=lcc +lat_0=39.6666666666667 +lon_0=-82.5 +lat_1=40.4333333333333 +lat_2=41.7 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32023",
    "name": "NAD27 / Ohio South",
    "proj4": "+proj=lcc +lat_0=38 +lon_0=-82.5 +lat_1=38.7333333333333 +lat_2=40.0333333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32024",
    "name": "NAD27 / Oklahoma North",
    "proj4": "+proj=lcc +lat_0=35 +lon_0=-98 +lat_1=35.5666666666667 +lat_2=36.7666666666667 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32025",
    "name": "NAD27 / Oklahoma South",
    "proj4": "+proj=lcc +lat_0=33.3333333333333 +lon_0=-98 +lat_1=33.9333333333333 +lat_2=35.2333333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32026",
    "name": "NAD27 / Oregon North",
    "proj4": "+proj=lcc +lat_0=43.6666666666667 +lon_0=-120.5 +lat_1=44.3333333333333 +lat_2=46 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32027",
    "name": "NAD27 / Oregon South",
    "proj4": "+proj=lcc +lat_0=41.6666666666667 +lon_0=-120.5 +lat_1=42.3333333333333 +lat_2=44 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32028",
    "name": "NAD27 / Pennsylvania North",
    "proj4": "+proj=lcc +lat_0=40.1666666666667 +lon_0=-77.75 +lat_1=40.8833333333333 +lat_2=41.95 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "4455",
    "name": "NAD27 / Pennsylvania South",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-77.75 +lat_1=40.9666666666667 +lat_2=39.9333333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32031",
    "name": "NAD27 / South Carolina North",
    "proj4": "+proj=lcc +lat_0=33 +lon_0=-81 +lat_1=33.7666666666667 +lat_2=34.9666666666667 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32033",
    "name": "NAD27 / South Carolina South",
    "proj4": "+proj=lcc +lat_0=31.8333333333333 +lon_0=-81 +lat_1=32.3333333333333 +lat_2=33.6666666666667 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32034",
    "name": "NAD27 / South Dakota North",
    "proj4": "+proj=lcc +lat_0=43.8333333333333 +lon_0=-100 +lat_1=44.4166666666667 +lat_2=45.6833333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32035",
    "name": "NAD27 / South Dakota South",
    "proj4": "+proj=lcc +lat_0=42.3333333333333 +lon_0=-100.333333333333 +lat_1=42.8333333333333 +lat_2=44.4 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32039",
    "name": "NAD27 / Texas Central",
    "proj4": "+proj=lcc +lat_0=29.6666666666667 +lon_0=-100.333333333333 +lat_1=30.1166666666667 +lat_2=31.8833333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32037",
    "name": "NAD27 / Texas North",
    "proj4": "+proj=lcc +lat_0=34 +lon_0=-101.5 +lat_1=34.65 +lat_2=36.1833333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32038",
    "name": "NAD27 / Texas North Central",
    "proj4": "+proj=lcc +lat_0=31.6666666666667 +lon_0=-97.5 +lat_1=32.1333333333333 +lat_2=33.9666666666667 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32041",
    "name": "NAD27 / Texas South",
    "proj4": "+proj=lcc +lat_0=25.6666666666667 +lon_0=-98.5 +lat_1=26.1666666666667 +lat_2=27.8333333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32040",
    "name": "NAD27 / Texas South Central",
    "proj4": "+proj=lcc +lat_0=27.8333333333333 +lon_0=-99 +lat_1=28.3833333333333 +lat_2=30.2833333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32043",
    "name": "NAD27 / Utah Central",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-111.5 +lat_1=39.0166666666667 +lat_2=40.65 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32042",
    "name": "NAD27 / Utah North",
    "proj4": "+proj=lcc +lat_0=40.3333333333333 +lon_0=-111.5 +lat_1=40.7166666666667 +lat_2=41.7833333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32044",
    "name": "NAD27 / Utah South",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-111.5 +lat_1=37.2166666666667 +lat_2=38.35 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32046",
    "name": "NAD27 / Virginia North",
    "proj4": "+proj=lcc +lat_0=37.6666666666667 +lon_0=-78.5 +lat_1=38.0333333333333 +lat_2=39.2 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32047",
    "name": "NAD27 / Virginia South",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-78.5 +lat_1=36.7666666666667 +lat_2=37.9666666666667 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32048",
    "name": "NAD27 / Washington North",
    "proj4": "+proj=lcc +lat_0=47 +lon_0=-120.833333333333 +lat_1=47.5 +lat_2=48.7333333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32049",
    "name": "NAD27 / Washington South",
    "proj4": "+proj=lcc +lat_0=45.3333333333333 +lon_0=-120.5 +lat_1=45.8333333333333 +lat_2=47.3333333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32050",
    "name": "NAD27 / West Virginia North",
    "proj4": "+proj=lcc +lat_0=38.5 +lon_0=-79.5 +lat_1=39 +lat_2=40.25 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32051",
    "name": "NAD27 / West Virginia South",
    "proj4": "+proj=lcc +lat_0=37 +lon_0=-81 +lat_1=37.4833333333333 +lat_2=38.8833333333333 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32053",
    "name": "NAD27 / Wisconsin Central",
    "proj4": "+proj=lcc +lat_0=43.8333333333333 +lon_0=-90 +lat_1=44.25 +lat_2=45.5 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32052",
    "name": "NAD27 / Wisconsin North",
    "proj4": "+proj=lcc +lat_0=45.1666666666667 +lon_0=-90 +lat_1=45.5666666666667 +lat_2=46.7666666666667 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32054",
    "name": "NAD27 / Wisconsin South",
    "proj4": "+proj=lcc +lat_0=42 +lon_0=-90 +lat_1=42.7333333333333 +lat_2=44.0666666666667 +x_0=609601.219202438 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32055",
    "name": "NAD27 / Wyoming East",
    "proj4": "+proj=tmerc +lat_0=40.6666666666667 +lon_0=-105.166666666667 +k=0.999941177 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32056",
    "name": "NAD27 / Wyoming East Central",
    "proj4": "+proj=tmerc +lat_0=40.6666666666667 +lon_0=-107.333333333333 +k=0.999941177 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32058",
    "name": "NAD27 / Wyoming West",
    "proj4": "+proj=tmerc +lat_0=40.6666666666667 +lon_0=-110.083333333333 +k=0.999941177 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32057",
    "name": "NAD27 / Wyoming West Central",
    "proj4": "+proj=tmerc +lat_0=40.6666666666667 +lon_0=-108.75 +k=0.999941177 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=NTv2_0.gsb +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26929",
    "name": "NAD83 / Alabama East",
    "proj4": "+proj=tmerc +lat_0=30.5 +lon_0=-85.8333333333333 +k=0.99996 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26930",
    "name": "NAD83 / Alabama West",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-87.5 +k=0.999933333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26931",
    "name": "NAD83 / Alaska zone 1",
    "proj4": "+proj=omerc +no_uoff +lat_0=57 +lonc=-133.666666666667 +alpha=323.130102361111 +gamma=323.130102361111 +k=0.9999 +x_0=5000000 +y_0=-5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26940",
    "name": "NAD83 / Alaska zone 10",
    "proj4": "+proj=lcc +lat_0=51 +lon_0=-176 +lat_1=53.8333333333333 +lat_2=51.8333333333333 +x_0=1000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26932",
    "name": "NAD83 / Alaska zone 2",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-142 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26933",
    "name": "NAD83 / Alaska zone 3",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-146 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26934",
    "name": "NAD83 / Alaska zone 4",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-150 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26935",
    "name": "NAD83 / Alaska zone 5",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-154 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26936",
    "name": "NAD83 / Alaska zone 6",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-158 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26937",
    "name": "NAD83 / Alaska zone 7",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-162 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26938",
    "name": "NAD83 / Alaska zone 8",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-166 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26939",
    "name": "NAD83 / Alaska zone 9",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-170 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26949",
    "name": "NAD83 / Arizona Central",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-111.916666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2223",
    "name": "NAD83 / Arizona Central (ft)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-111.916666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26948",
    "name": "NAD83 / Arizona East",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-110.166666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2222",
    "name": "NAD83 / Arizona East (ft)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-110.166666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26950",
    "name": "NAD83 / Arizona West",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2224",
    "name": "NAD83 / Arizona West (ft)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26951",
    "name": "NAD83 / Arkansas North",
    "proj4": "+proj=lcc +lat_0=34.3333333333333 +lon_0=-92 +lat_1=36.2333333333333 +lat_2=34.9333333333333 +x_0=400000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3433",
    "name": "NAD83 / Arkansas North (ftUS)",
    "proj4": "+proj=lcc +lat_0=34.3333333333333 +lon_0=-92 +lat_1=36.2333333333333 +lat_2=34.9333333333333 +x_0=399999.99998984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26952",
    "name": "NAD83 / Arkansas South",
    "proj4": "+proj=lcc +lat_0=32.6666666666667 +lon_0=-92 +lat_1=34.7666666666667 +lat_2=33.3 +x_0=400000 +y_0=400000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3434",
    "name": "NAD83 / Arkansas South (ftUS)",
    "proj4": "+proj=lcc +lat_0=32.6666666666667 +lon_0=-92 +lat_1=34.7666666666667 +lat_2=33.3 +x_0=399999.99998984 +y_0=399999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26941",
    "name": "NAD83 / California zone 1",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-122 +lat_1=41.6666666666667 +lat_2=40 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2225",
    "name": "NAD83 / California zone 1 (ftUS)",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-122 +lat_1=41.6666666666667 +lat_2=40 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26942",
    "name": "NAD83 / California zone 2",
    "proj4": "+proj=lcc +lat_0=37.6666666666667 +lon_0=-122 +lat_1=39.8333333333333 +lat_2=38.3333333333333 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2226",
    "name": "NAD83 / California zone 2 (ftUS)",
    "proj4": "+proj=lcc +lat_0=37.6666666666667 +lon_0=-122 +lat_1=39.8333333333333 +lat_2=38.3333333333333 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26943",
    "name": "NAD83 / California zone 3",
    "proj4": "+proj=lcc +lat_0=36.5 +lon_0=-120.5 +lat_1=38.4333333333333 +lat_2=37.0666666666667 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2227",
    "name": "NAD83 / California zone 3 (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.5 +lon_0=-120.5 +lat_1=38.4333333333333 +lat_2=37.0666666666667 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26944",
    "name": "NAD83 / California zone 4",
    "proj4": "+proj=lcc +lat_0=35.3333333333333 +lon_0=-119 +lat_1=37.25 +lat_2=36 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2228",
    "name": "NAD83 / California zone 4 (ftUS)",
    "proj4": "+proj=lcc +lat_0=35.3333333333333 +lon_0=-119 +lat_1=37.25 +lat_2=36 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26945",
    "name": "NAD83 / California zone 5",
    "proj4": "+proj=lcc +lat_0=33.5 +lon_0=-118 +lat_1=35.4666666666667 +lat_2=34.0333333333333 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2229",
    "name": "NAD83 / California zone 5 (ftUS)",
    "proj4": "+proj=lcc +lat_0=33.5 +lon_0=-118 +lat_1=35.4666666666667 +lat_2=34.0333333333333 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26946",
    "name": "NAD83 / California zone 6",
    "proj4": "+proj=lcc +lat_0=32.1666666666667 +lon_0=-116.25 +lat_1=33.8833333333333 +lat_2=32.7833333333333 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2230",
    "name": "NAD83 / California zone 6 (ftUS)",
    "proj4": "+proj=lcc +lat_0=32.1666666666667 +lon_0=-116.25 +lat_1=33.8833333333333 +lat_2=32.7833333333333 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26954",
    "name": "NAD83 / Colorado Central",
    "proj4": "+proj=lcc +lat_0=37.8333333333333 +lon_0=-105.5 +lat_1=39.75 +lat_2=38.45 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2232",
    "name": "NAD83 / Colorado Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=37.8333333333333 +lon_0=-105.5 +lat_1=39.75 +lat_2=38.45 +x_0=914401.828803657 +y_0=304800.609601219 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26953",
    "name": "NAD83 / Colorado North",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-105.5 +lat_1=40.7833333333333 +lat_2=39.7166666666667 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2231",
    "name": "NAD83 / Colorado North (ftUS)",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-105.5 +lat_1=40.7833333333333 +lat_2=39.7166666666667 +x_0=914401.828803657 +y_0=304800.609601219 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26955",
    "name": "NAD83 / Colorado South",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-105.5 +lat_1=38.4333333333333 +lat_2=37.2333333333333 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2233",
    "name": "NAD83 / Colorado South (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-105.5 +lat_1=38.4333333333333 +lat_2=37.2333333333333 +x_0=914401.828803657 +y_0=304800.609601219 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26958",
    "name": "NAD83 / Florida East",
    "proj4": "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2236",
    "name": "NAD83 / Florida East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26960",
    "name": "NAD83 / Florida North",
    "proj4": "+proj=lcc +lat_0=29 +lon_0=-84.5 +lat_1=30.75 +lat_2=29.5833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2238",
    "name": "NAD83 / Florida North (ftUS)",
    "proj4": "+proj=lcc +lat_0=29 +lon_0=-84.5 +lat_1=30.75 +lat_2=29.5833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26959",
    "name": "NAD83 / Florida West",
    "proj4": "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2237",
    "name": "NAD83 / Florida West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26966",
    "name": "NAD83 / Georgia East",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-82.1666666666667 +k=0.9999 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2239",
    "name": "NAD83 / Georgia East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-82.1666666666667 +k=0.9999 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26967",
    "name": "NAD83 / Georgia West",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-84.1666666666667 +k=0.9999 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2240",
    "name": "NAD83 / Georgia West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-84.1666666666667 +k=0.9999 +x_0=699999.999898399 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26961",
    "name": "NAD83 / Hawaii zone 1",
    "proj4": "+proj=tmerc +lat_0=18.8333333333333 +lon_0=-155.5 +k=0.999966667 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26962",
    "name": "NAD83 / Hawaii zone 2",
    "proj4": "+proj=tmerc +lat_0=20.3333333333333 +lon_0=-156.666666666667 +k=0.999966667 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26963",
    "name": "NAD83 / Hawaii zone 3",
    "proj4": "+proj=tmerc +lat_0=21.1666666666667 +lon_0=-158 +k=0.99999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3759",
    "name": "NAD83 / Hawaii zone 3 (ftUS)",
    "proj4": "+proj=tmerc +lat_0=21.1666666666667 +lon_0=-158 +k=0.99999 +x_0=500000.00001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26964",
    "name": "NAD83 / Hawaii zone 4",
    "proj4": "+proj=tmerc +lat_0=21.8333333333333 +lon_0=-159.5 +k=0.99999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26965",
    "name": "NAD83 / Hawaii zone 5",
    "proj4": "+proj=tmerc +lat_0=21.6666666666667 +lon_0=-160.166666666667 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26969",
    "name": "NAD83 / Idaho Central",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-114 +k=0.999947368 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2242",
    "name": "NAD83 / Idaho Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-114 +k=0.999947368 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26968",
    "name": "NAD83 / Idaho East",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-112.166666666667 +k=0.999947368 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2241",
    "name": "NAD83 / Idaho East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-112.166666666667 +k=0.999947368 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26970",
    "name": "NAD83 / Idaho West",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-115.75 +k=0.999933333 +x_0=800000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2243",
    "name": "NAD83 / Idaho West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-115.75 +k=0.999933333 +x_0=800000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26971",
    "name": "NAD83 / Illinois East",
    "proj4": "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-88.3333333333333 +k=0.999975 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3435",
    "name": "NAD83 / Illinois East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-88.3333333333333 +k=0.999975 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26972",
    "name": "NAD83 / Illinois West",
    "proj4": "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-90.1666666666667 +k=0.999941177 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3436",
    "name": "NAD83 / Illinois West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-90.1666666666667 +k=0.999941177 +x_0=699999.99998984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26973",
    "name": "NAD83 / Indiana East",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-85.6666666666667 +k=0.999966667 +x_0=100000 +y_0=250000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2965",
    "name": "NAD83 / Indiana East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-85.6666666666667 +k=0.999966667 +x_0=99999.9998983997 +y_0=249999.9998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26974",
    "name": "NAD83 / Indiana West",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-87.0833333333333 +k=0.999966667 +x_0=900000 +y_0=250000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2966",
    "name": "NAD83 / Indiana West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-87.0833333333333 +k=0.999966667 +x_0=900000 +y_0=249999.9998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26975",
    "name": "NAD83 / Iowa North",
    "proj4": "+proj=lcc +lat_0=41.5 +lon_0=-93.5 +lat_1=43.2666666666667 +lat_2=42.0666666666667 +x_0=1500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3417",
    "name": "NAD83 / Iowa North (ftUS)",
    "proj4": "+proj=lcc +lat_0=41.5 +lon_0=-93.5 +lat_1=43.2666666666667 +lat_2=42.0666666666667 +x_0=1500000 +y_0=999999.999989839 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26976",
    "name": "NAD83 / Iowa South",
    "proj4": "+proj=lcc +lat_0=40 +lon_0=-93.5 +lat_1=41.7833333333333 +lat_2=40.6166666666667 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3418",
    "name": "NAD83 / Iowa South (ftUS)",
    "proj4": "+proj=lcc +lat_0=40 +lon_0=-93.5 +lat_1=41.7833333333333 +lat_2=40.6166666666667 +x_0=500000.00001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26977",
    "name": "NAD83 / Kansas North",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-98 +lat_1=39.7833333333333 +lat_2=38.7166666666667 +x_0=400000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3419",
    "name": "NAD83 / Kansas North (ftUS)",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-98 +lat_1=39.7833333333333 +lat_2=38.7166666666667 +x_0=399999.99998984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26978",
    "name": "NAD83 / Kansas South",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-98.5 +lat_1=38.5666666666667 +lat_2=37.2666666666667 +x_0=400000 +y_0=400000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3420",
    "name": "NAD83 / Kansas South (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-98.5 +lat_1=38.5666666666667 +lat_2=37.2666666666667 +x_0=399999.99998984 +y_0=399999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2205",
    "name": "NAD83 / Kentucky North",
    "proj4": "+proj=lcc +lat_0=37.5 +lon_0=-84.25 +lat_1=37.9666666666667 +lat_2=38.9666666666667 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2246",
    "name": "NAD83 / Kentucky North (ftUS)",
    "proj4": "+proj=lcc +lat_0=37.5 +lon_0=-84.25 +lat_1=37.9666666666667 +lat_2=38.9666666666667 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3088",
    "name": "NAD83 / Kentucky Single Zone",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.0833333333333 +lat_2=38.6666666666667 +x_0=1500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3089",
    "name": "NAD83 / Kentucky Single Zone (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.0833333333333 +lat_2=38.6666666666667 +x_0=1500000 +y_0=999999.999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26980",
    "name": "NAD83 / Kentucky South",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.9333333333333 +lat_2=36.7333333333333 +x_0=500000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2247",
    "name": "NAD83 / Kentucky South (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.9333333333333 +lat_2=36.7333333333333 +x_0=500000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26981",
    "name": "NAD83 / Louisiana North",
    "proj4": "+proj=lcc +lat_0=30.5 +lon_0=-92.5 +lat_1=32.6666666666667 +lat_2=31.1666666666667 +x_0=1000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3451",
    "name": "NAD83 / Louisiana North (ftUS)",
    "proj4": "+proj=lcc +lat_0=30.5 +lon_0=-92.5 +lat_1=32.6666666666667 +lat_2=31.1666666666667 +x_0=999999.999989839 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26982",
    "name": "NAD83 / Louisiana South",
    "proj4": "+proj=lcc +lat_0=28.5 +lon_0=-91.3333333333333 +lat_1=30.7 +lat_2=29.3 +x_0=1000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3452",
    "name": "NAD83 / Louisiana South (ftUS)",
    "proj4": "+proj=lcc +lat_0=28.5 +lon_0=-91.3333333333333 +lat_1=30.7 +lat_2=29.3 +x_0=999999.999989839 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3463",
    "name": "NAD83 / Maine CS2000 Central",
    "proj4": "+proj=tmerc +lat_0=43.5 +lon_0=-69.125 +k=0.99998 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3072",
    "name": "NAD83 / Maine CS2000 East",
    "proj4": "+proj=tmerc +lat_0=43.8333333333333 +lon_0=-67.875 +k=0.99998 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3074",
    "name": "NAD83 / Maine CS2000 West",
    "proj4": "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-70.375 +k=0.99998 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26983",
    "name": "NAD83 / Maine East",
    "proj4": "+proj=tmerc +lat_0=43.6666666666667 +lon_0=-68.5 +k=0.9999 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26847",
    "name": "NAD83 / Maine East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=43.6666666666667 +lon_0=-68.5 +k=0.9999 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26984",
    "name": "NAD83 / Maine West",
    "proj4": "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-70.1666666666667 +k=0.999966667 +x_0=900000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26848",
    "name": "NAD83 / Maine West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-70.1666666666667 +k=0.999966667 +x_0=900000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26989",
    "name": "NAD83 / Michigan Central",
    "proj4": "+proj=lcc +lat_0=43.3166666666667 +lon_0=-84.3666666666667 +lat_1=45.7 +lat_2=44.1833333333333 +x_0=6000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2252",
    "name": "NAD83 / Michigan Central (ft)",
    "proj4": "+proj=lcc +lat_0=43.3166666666667 +lon_0=-84.3666666666667 +lat_1=45.7 +lat_2=44.1833333333333 +x_0=5999999.999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26988",
    "name": "NAD83 / Michigan North",
    "proj4": "+proj=lcc +lat_0=44.7833333333333 +lon_0=-87 +lat_1=47.0833333333333 +lat_2=45.4833333333333 +x_0=8000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2251",
    "name": "NAD83 / Michigan North (ft)",
    "proj4": "+proj=lcc +lat_0=44.7833333333333 +lon_0=-87 +lat_1=47.0833333333333 +lat_2=45.4833333333333 +x_0=7999999.999968 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26990",
    "name": "NAD83 / Michigan South",
    "proj4": "+proj=lcc +lat_0=41.5 +lon_0=-84.3666666666667 +lat_1=43.6666666666667 +lat_2=42.1 +x_0=4000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2253",
    "name": "NAD83 / Michigan South (ft)",
    "proj4": "+proj=lcc +lat_0=41.5 +lon_0=-84.3666666666667 +lat_1=43.6666666666667 +lat_2=42.1 +x_0=3999999.999984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26992",
    "name": "NAD83 / Minnesota Central",
    "proj4": "+proj=lcc +lat_0=45 +lon_0=-94.25 +lat_1=47.05 +lat_2=45.6166666666667 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26850",
    "name": "NAD83 / Minnesota Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=45 +lon_0=-94.25 +lat_1=47.05 +lat_2=45.6166666666667 +x_0=800000.00001016 +y_0=99999.9999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26991",
    "name": "NAD83 / Minnesota North",
    "proj4": "+proj=lcc +lat_0=46.5 +lon_0=-93.1 +lat_1=48.6333333333333 +lat_2=47.0333333333333 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26849",
    "name": "NAD83 / Minnesota North (ftUS)",
    "proj4": "+proj=lcc +lat_0=46.5 +lon_0=-93.1 +lat_1=48.6333333333333 +lat_2=47.0333333333333 +x_0=800000.00001016 +y_0=99999.9999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26993",
    "name": "NAD83 / Minnesota South",
    "proj4": "+proj=lcc +lat_0=43 +lon_0=-94 +lat_1=45.2166666666667 +lat_2=43.7833333333333 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26851",
    "name": "NAD83 / Minnesota South (ftUS)",
    "proj4": "+proj=lcc +lat_0=43 +lon_0=-94 +lat_1=45.2166666666667 +lat_2=43.7833333333333 +x_0=800000.00001016 +y_0=99999.9999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26994",
    "name": "NAD83 / Mississippi East",
    "proj4": "+proj=tmerc +lat_0=29.5 +lon_0=-88.8333333333333 +k=0.99995 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2254",
    "name": "NAD83 / Mississippi East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=29.5 +lon_0=-88.8333333333333 +k=0.99995 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26995",
    "name": "NAD83 / Mississippi West",
    "proj4": "+proj=tmerc +lat_0=29.5 +lon_0=-90.3333333333333 +k=0.99995 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2255",
    "name": "NAD83 / Mississippi West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=29.5 +lon_0=-90.3333333333333 +k=0.99995 +x_0=699999.999898399 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "26997",
    "name": "NAD83 / Missouri Central",
    "proj4": "+proj=tmerc +lat_0=35.8333333333333 +lon_0=-92.5 +k=0.999933333 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26996",
    "name": "NAD83 / Missouri East",
    "proj4": "+proj=tmerc +lat_0=35.8333333333333 +lon_0=-90.5 +k=0.999933333 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26998",
    "name": "NAD83 / Missouri West",
    "proj4": "+proj=tmerc +lat_0=36.1666666666667 +lon_0=-94.5 +k=0.999941177 +x_0=850000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "32108",
    "name": "NAD83 / Nevada Central",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-116.666666666667 +k=0.9999 +x_0=500000 +y_0=6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3422",
    "name": "NAD83 / Nevada Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-116.666666666667 +k=0.9999 +x_0=500000.00001016 +y_0=6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32107",
    "name": "NAD83 / Nevada East",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-115.583333333333 +k=0.9999 +x_0=200000 +y_0=8000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3421",
    "name": "NAD83 / Nevada East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-115.583333333333 +k=0.9999 +x_0=200000.00001016 +y_0=8000000.00001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32109",
    "name": "NAD83 / Nevada West",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-118.583333333333 +k=0.9999 +x_0=800000 +y_0=4000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3423",
    "name": "NAD83 / Nevada West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-118.583333333333 +k=0.9999 +x_0=800000.00001016 +y_0=3999999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32113",
    "name": "NAD83 / New Mexico Central",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2258",
    "name": "NAD83 / New Mexico Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.9999 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32112",
    "name": "NAD83 / New Mexico East",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-104.333333333333 +k=0.999909091 +x_0=165000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2257",
    "name": "NAD83 / New Mexico East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-104.333333333333 +k=0.999909091 +x_0=165000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32114",
    "name": "NAD83 / New Mexico West",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-107.833333333333 +k=0.999916667 +x_0=830000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2259",
    "name": "NAD83 / New Mexico West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-107.833333333333 +k=0.999916667 +x_0=830000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32116",
    "name": "NAD83 / New York Central",
    "proj4": "+proj=tmerc +lat_0=40 +lon_0=-76.5833333333333 +k=0.9999375 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2261",
    "name": "NAD83 / New York Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40 +lon_0=-76.5833333333333 +k=0.9999375 +x_0=249999.9998984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32115",
    "name": "NAD83 / New York East",
    "proj4": "+proj=tmerc +lat_0=38.8333333333333 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2260",
    "name": "NAD83 / New York East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=38.8333333333333 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32117",
    "name": "NAD83 / New York West",
    "proj4": "+proj=tmerc +lat_0=40 +lon_0=-78.5833333333333 +k=0.9999375 +x_0=350000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2262",
    "name": "NAD83 / New York West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40 +lon_0=-78.5833333333333 +k=0.9999375 +x_0=350000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32119",
    "name": "NAD83 / North Carolina",
    "proj4": "+proj=lcc +lat_0=33.75 +lon_0=-79 +lat_1=36.1666666666667 +lat_2=34.3333333333333 +x_0=609601.22 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2264",
    "name": "NAD83 / North Carolina (ftUS)",
    "proj4": "+proj=lcc +lat_0=33.75 +lon_0=-79 +lat_1=36.1666666666667 +lat_2=34.3333333333333 +x_0=609601.219202438 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32120",
    "name": "NAD83 / North Dakota North",
    "proj4": "+proj=lcc +lat_0=47 +lon_0=-100.5 +lat_1=48.7333333333333 +lat_2=47.4333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2265",
    "name": "NAD83 / North Dakota North (ft)",
    "proj4": "+proj=lcc +lat_0=47 +lon_0=-100.5 +lat_1=48.7333333333333 +lat_2=47.4333333333333 +x_0=599999.9999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32121",
    "name": "NAD83 / North Dakota South",
    "proj4": "+proj=lcc +lat_0=45.6666666666667 +lon_0=-100.5 +lat_1=47.4833333333333 +lat_2=46.1833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2266",
    "name": "NAD83 / North Dakota South (ft)",
    "proj4": "+proj=lcc +lat_0=45.6666666666667 +lon_0=-100.5 +lat_1=47.4833333333333 +lat_2=46.1833333333333 +x_0=599999.9999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32122",
    "name": "NAD83 / Ohio North",
    "proj4": "+proj=lcc +lat_0=39.6666666666667 +lon_0=-82.5 +lat_1=41.7 +lat_2=40.4333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3734",
    "name": "NAD83 / Ohio North (ftUS)",
    "proj4": "+proj=lcc +lat_0=39.6666666666667 +lon_0=-82.5 +lat_1=41.7 +lat_2=40.4333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32123",
    "name": "NAD83 / Ohio South",
    "proj4": "+proj=lcc +lat_0=38 +lon_0=-82.5 +lat_1=40.0333333333333 +lat_2=38.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3735",
    "name": "NAD83 / Ohio South (ftUS)",
    "proj4": "+proj=lcc +lat_0=38 +lon_0=-82.5 +lat_1=40.0333333333333 +lat_2=38.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32124",
    "name": "NAD83 / Oklahoma North",
    "proj4": "+proj=lcc +lat_0=35 +lon_0=-98 +lat_1=36.7666666666667 +lat_2=35.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2267",
    "name": "NAD83 / Oklahoma North (ftUS)",
    "proj4": "+proj=lcc +lat_0=35 +lon_0=-98 +lat_1=36.7666666666667 +lat_2=35.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32125",
    "name": "NAD83 / Oklahoma South",
    "proj4": "+proj=lcc +lat_0=33.3333333333333 +lon_0=-98 +lat_1=35.2333333333333 +lat_2=33.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2268",
    "name": "NAD83 / Oklahoma South (ftUS)",
    "proj4": "+proj=lcc +lat_0=33.3333333333333 +lon_0=-98 +lat_1=35.2333333333333 +lat_2=33.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32126",
    "name": "NAD83 / Oregon North",
    "proj4": "+proj=lcc +lat_0=43.6666666666667 +lon_0=-120.5 +lat_1=46 +lat_2=44.3333333333333 +x_0=2500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2269",
    "name": "NAD83 / Oregon North (ft)",
    "proj4": "+proj=lcc +lat_0=43.6666666666667 +lon_0=-120.5 +lat_1=46 +lat_2=44.3333333333333 +x_0=2500000.0001424 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32127",
    "name": "NAD83 / Oregon South",
    "proj4": "+proj=lcc +lat_0=41.6666666666667 +lon_0=-120.5 +lat_1=44 +lat_2=42.3333333333333 +x_0=1500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2270",
    "name": "NAD83 / Oregon South (ft)",
    "proj4": "+proj=lcc +lat_0=41.6666666666667 +lon_0=-120.5 +lat_1=44 +lat_2=42.3333333333333 +x_0=1500000.0001464 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32128",
    "name": "NAD83 / Pennsylvania North",
    "proj4": "+proj=lcc +lat_0=40.1666666666667 +lon_0=-77.75 +lat_1=41.95 +lat_2=40.8833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2271",
    "name": "NAD83 / Pennsylvania North (ftUS)",
    "proj4": "+proj=lcc +lat_0=40.1666666666667 +lon_0=-77.75 +lat_1=41.95 +lat_2=40.8833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32129",
    "name": "NAD83 / Pennsylvania South",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-77.75 +lat_1=40.9666666666667 +lat_2=39.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2272",
    "name": "NAD83 / Pennsylvania South (ftUS)",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-77.75 +lat_1=40.9666666666667 +lat_2=39.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32133",
    "name": "NAD83 / South Carolina",
    "proj4": "+proj=lcc +lat_0=31.8333333333333 +lon_0=-81 +lat_1=34.8333333333333 +lat_2=32.5 +x_0=609600 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2273",
    "name": "NAD83 / South Carolina (ft)",
    "proj4": "+proj=lcc +lat_0=31.8333333333333 +lon_0=-81 +lat_1=34.8333333333333 +lat_2=32.5 +x_0=609600 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32134",
    "name": "NAD83 / South Dakota North",
    "proj4": "+proj=lcc +lat_0=43.8333333333333 +lon_0=-100 +lat_1=45.6833333333333 +lat_2=44.4166666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "4457",
    "name": "NAD83 / South Dakota North (ftUS)",
    "proj4": "+proj=lcc +lat_0=43.8333333333333 +lon_0=-100 +lat_1=45.6833333333333 +lat_2=44.4166666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32135",
    "name": "NAD83 / South Dakota South",
    "proj4": "+proj=lcc +lat_0=42.3333333333333 +lon_0=-100.333333333333 +lat_1=44.4 +lat_2=42.8333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3455",
    "name": "NAD83 / South Dakota South (ftUS)",
    "proj4": "+proj=lcc +lat_0=42.3333333333333 +lon_0=-100.333333333333 +lat_1=44.4 +lat_2=42.8333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32139",
    "name": "NAD83 / Texas Central",
    "proj4": "+proj=lcc +lat_0=29.6666666666667 +lon_0=-100.333333333333 +lat_1=31.8833333333333 +lat_2=30.1166666666667 +x_0=700000 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2277",
    "name": "NAD83 / Texas Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=29.6666666666667 +lon_0=-100.333333333333 +lat_1=31.8833333333333 +lat_2=30.1166666666667 +x_0=699999.999898399 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32137",
    "name": "NAD83 / Texas North",
    "proj4": "+proj=lcc +lat_0=34 +lon_0=-101.5 +lat_1=36.1833333333333 +lat_2=34.65 +x_0=200000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2275",
    "name": "NAD83 / Texas North (ftUS)",
    "proj4": "+proj=lcc +lat_0=34 +lon_0=-101.5 +lat_1=36.1833333333333 +lat_2=34.65 +x_0=200000.0001016 +y_0=999999.999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32138",
    "name": "NAD83 / Texas North Central",
    "proj4": "+proj=lcc +lat_0=31.6666666666667 +lon_0=-98.5 +lat_1=33.9666666666667 +lat_2=32.1333333333333 +x_0=600000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2276",
    "name": "NAD83 / Texas North Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=31.6666666666667 +lon_0=-98.5 +lat_1=33.9666666666667 +lat_2=32.1333333333333 +x_0=600000 +y_0=2000000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32141",
    "name": "NAD83 / Texas South",
    "proj4": "+proj=lcc +lat_0=25.6666666666667 +lon_0=-98.5 +lat_1=27.8333333333333 +lat_2=26.1666666666667 +x_0=300000 +y_0=5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2279",
    "name": "NAD83 / Texas South (ftUS)",
    "proj4": "+proj=lcc +lat_0=25.6666666666667 +lon_0=-98.5 +lat_1=27.8333333333333 +lat_2=26.1666666666667 +x_0=300000 +y_0=5000000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32140",
    "name": "NAD83 / Texas South Central",
    "proj4": "+proj=lcc +lat_0=27.8333333333333 +lon_0=-99 +lat_1=30.2833333333333 +lat_2=28.3833333333333 +x_0=600000 +y_0=4000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2278",
    "name": "NAD83 / Texas South Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=27.8333333333333 +lon_0=-99 +lat_1=30.2833333333333 +lat_2=28.3833333333333 +x_0=600000 +y_0=3999999.9998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32143",
    "name": "NAD83 / Utah Central",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-111.5 +lat_1=40.65 +lat_2=39.0166666666667 +x_0=500000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2281",
    "name": "NAD83 / Utah Central (ft)",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-111.5 +lat_1=40.65 +lat_2=39.0166666666667 +x_0=500000.0001504 +y_0=1999999.999992 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3566",
    "name": "NAD83 / Utah Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-111.5 +lat_1=40.65 +lat_2=39.0166666666667 +x_0=500000.00001016 +y_0=2000000.00001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32142",
    "name": "NAD83 / Utah North",
    "proj4": "+proj=lcc +lat_0=40.3333333333333 +lon_0=-111.5 +lat_1=41.7833333333333 +lat_2=40.7166666666667 +x_0=500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2280",
    "name": "NAD83 / Utah North (ft)",
    "proj4": "+proj=lcc +lat_0=40.3333333333333 +lon_0=-111.5 +lat_1=41.7833333333333 +lat_2=40.7166666666667 +x_0=500000.0001504 +y_0=999999.999996 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3560",
    "name": "NAD83 / Utah North (ftUS)",
    "proj4": "+proj=lcc +lat_0=40.3333333333333 +lon_0=-111.5 +lat_1=41.7833333333333 +lat_2=40.7166666666667 +x_0=500000.00001016 +y_0=999999.999989839 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32144",
    "name": "NAD83 / Utah South",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-111.5 +lat_1=38.35 +lat_2=37.2166666666667 +x_0=500000 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2282",
    "name": "NAD83 / Utah South (ft)",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-111.5 +lat_1=38.35 +lat_2=37.2166666666667 +x_0=500000.0001504 +y_0=2999999.999988 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3567",
    "name": "NAD83 / Utah South (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-111.5 +lat_1=38.35 +lat_2=37.2166666666667 +x_0=500000.00001016 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32146",
    "name": "NAD83 / Virginia North",
    "proj4": "+proj=lcc +lat_0=37.6666666666667 +lon_0=-78.5 +lat_1=39.2 +lat_2=38.0333333333333 +x_0=3500000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2283",
    "name": "NAD83 / Virginia North (ftUS)",
    "proj4": "+proj=lcc +lat_0=37.6666666666667 +lon_0=-78.5 +lat_1=39.2 +lat_2=38.0333333333333 +x_0=3500000.0001016 +y_0=2000000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32147",
    "name": "NAD83 / Virginia South",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-78.5 +lat_1=37.9666666666667 +lat_2=36.7666666666667 +x_0=3500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2284",
    "name": "NAD83 / Virginia South (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-78.5 +lat_1=37.9666666666667 +lat_2=36.7666666666667 +x_0=3500000.0001016 +y_0=999999.999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32148",
    "name": "NAD83 / Washington North",
    "proj4": "+proj=lcc +lat_0=47 +lon_0=-120.833333333333 +lat_1=48.7333333333333 +lat_2=47.5 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2285",
    "name": "NAD83 / Washington North (ftUS)",
    "proj4": "+proj=lcc +lat_0=47 +lon_0=-120.833333333333 +lat_1=48.7333333333333 +lat_2=47.5 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32149",
    "name": "NAD83 / Washington South",
    "proj4": "+proj=lcc +lat_0=45.3333333333333 +lon_0=-120.5 +lat_1=47.3333333333333 +lat_2=45.8333333333333 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2286",
    "name": "NAD83 / Washington South (ftUS)",
    "proj4": "+proj=lcc +lat_0=45.3333333333333 +lon_0=-120.5 +lat_1=47.3333333333333 +lat_2=45.8333333333333 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32150",
    "name": "NAD83 / West Virginia North",
    "proj4": "+proj=lcc +lat_0=38.5 +lon_0=-79.5 +lat_1=40.25 +lat_2=39 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26853",
    "name": "NAD83 / West Virginia North (ftUS)",
    "proj4": "+proj=lcc +lat_0=38.5 +lon_0=-79.5 +lat_1=40.25 +lat_2=39 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32151",
    "name": "NAD83 / West Virginia South",
    "proj4": "+proj=lcc +lat_0=37 +lon_0=-81 +lat_1=38.8833333333333 +lat_2=37.4833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26854",
    "name": "NAD83 / West Virginia South (ftUS)",
    "proj4": "+proj=lcc +lat_0=37 +lon_0=-81 +lat_1=38.8833333333333 +lat_2=37.4833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32153",
    "name": "NAD83 / Wisconsin Central",
    "proj4": "+proj=lcc +lat_0=43.8333333333333 +lon_0=-90 +lat_1=45.5 +lat_2=44.25 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2288",
    "name": "NAD83 / Wisconsin Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=43.8333333333333 +lon_0=-90 +lat_1=45.5 +lat_2=44.25 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32152",
    "name": "NAD83 / Wisconsin North",
    "proj4": "+proj=lcc +lat_0=45.1666666666667 +lon_0=-90 +lat_1=46.7666666666667 +lat_2=45.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2287",
    "name": "NAD83 / Wisconsin North (ftUS)",
    "proj4": "+proj=lcc +lat_0=45.1666666666667 +lon_0=-90 +lat_1=46.7666666666667 +lat_2=45.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32154",
    "name": "NAD83 / Wisconsin South",
    "proj4": "+proj=lcc +lat_0=42 +lon_0=-90 +lat_1=44.0666666666667 +lat_2=42.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2289",
    "name": "NAD83 / Wisconsin South (ftUS)",
    "proj4": "+proj=lcc +lat_0=42 +lon_0=-90 +lat_1=44.0666666666667 +lat_2=42.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32155",
    "name": "NAD83 / Wyoming East",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-105.166666666667 +k=0.9999375 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3736",
    "name": "NAD83 / Wyoming East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-105.166666666667 +k=0.9999375 +x_0=200000.00001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32156",
    "name": "NAD83 / Wyoming East Central",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-107.333333333333 +k=0.9999375 +x_0=400000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3737",
    "name": "NAD83 / Wyoming East Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-107.333333333333 +k=0.9999375 +x_0=399999.99998984 +y_0=99999.9999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32158",
    "name": "NAD83 / Wyoming West",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-110.083333333333 +k=0.9999375 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3739",
    "name": "NAD83 / Wyoming West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-110.083333333333 +k=0.9999375 +x_0=800000.00001016 +y_0=99999.9999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "32157",
    "name": "NAD83 / Wyoming West Central",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-108.75 +k=0.9999375 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3738",
    "name": "NAD83 / Wyoming West Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-108.75 +k=0.9999375 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6355",
    "name": "NAD83(2011) / Alabama East",
    "proj4": "+proj=tmerc +lat_0=30.5 +lon_0=-85.8333333333333 +k=0.99996 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "9748",
    "name": "NAD83(2011) / Alabama East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=30.5 +lon_0=-85.8333333333333 +k=0.99996 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6356",
    "name": "NAD83(2011) / Alabama West",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-87.5 +k=0.999933333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "9749",
    "name": "NAD83(2011) / Alabama West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-87.5 +k=0.999933333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6394",
    "name": "NAD83(2011) / Alaska zone 1",
    "proj4": "+proj=omerc +no_uoff +lat_0=57 +lonc=-133.666666666667 +alpha=323.130102361111 +gamma=323.130102361111 +k=0.9999 +x_0=5000000 +y_0=-5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6403",
    "name": "NAD83(2011) / Alaska zone 10",
    "proj4": "+proj=lcc +lat_0=51 +lon_0=-176 +lat_1=53.8333333333333 +lat_2=51.8333333333333 +x_0=1000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6395",
    "name": "NAD83(2011) / Alaska zone 2",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-142 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6396",
    "name": "NAD83(2011) / Alaska zone 3",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-146 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6397",
    "name": "NAD83(2011) / Alaska zone 4",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-150 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6398",
    "name": "NAD83(2011) / Alaska zone 5",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-154 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6399",
    "name": "NAD83(2011) / Alaska zone 6",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-158 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6400",
    "name": "NAD83(2011) / Alaska zone 7",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-162 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6401",
    "name": "NAD83(2011) / Alaska zone 8",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-166 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6402",
    "name": "NAD83(2011) / Alaska zone 9",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-170 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6404",
    "name": "NAD83(2011) / Arizona Central",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-111.916666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6405",
    "name": "NAD83(2011) / Arizona Central (ft)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-111.916666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6406",
    "name": "NAD83(2011) / Arizona East",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-110.166666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6407",
    "name": "NAD83(2011) / Arizona East (ft)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-110.166666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6408",
    "name": "NAD83(2011) / Arizona West",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6409",
    "name": "NAD83(2011) / Arizona West (ft)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6410",
    "name": "NAD83(2011) / Arkansas North",
    "proj4": "+proj=lcc +lat_0=34.3333333333333 +lon_0=-92 +lat_1=36.2333333333333 +lat_2=34.9333333333333 +x_0=400000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6411",
    "name": "NAD83(2011) / Arkansas North (ftUS)",
    "proj4": "+proj=lcc +lat_0=34.3333333333333 +lon_0=-92 +lat_1=36.2333333333333 +lat_2=34.9333333333333 +x_0=399999.99998984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6412",
    "name": "NAD83(2011) / Arkansas South",
    "proj4": "+proj=lcc +lat_0=32.6666666666667 +lon_0=-92 +lat_1=34.7666666666667 +lat_2=33.3 +x_0=400000 +y_0=400000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6413",
    "name": "NAD83(2011) / Arkansas South (ftUS)",
    "proj4": "+proj=lcc +lat_0=32.6666666666667 +lon_0=-92 +lat_1=34.7666666666667 +lat_2=33.3 +x_0=399999.99998984 +y_0=399999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6415",
    "name": "NAD83(2011) / California zone 1",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-122 +lat_1=41.6666666666667 +lat_2=40 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6416",
    "name": "NAD83(2011) / California zone 1 (ftUS)",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-122 +lat_1=41.6666666666667 +lat_2=40 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6417",
    "name": "NAD83(2011) / California zone 2",
    "proj4": "+proj=lcc +lat_0=37.6666666666667 +lon_0=-122 +lat_1=39.8333333333333 +lat_2=38.3333333333333 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6418",
    "name": "NAD83(2011) / California zone 2 (ftUS)",
    "proj4": "+proj=lcc +lat_0=37.6666666666667 +lon_0=-122 +lat_1=39.8333333333333 +lat_2=38.3333333333333 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6419",
    "name": "NAD83(2011) / California zone 3",
    "proj4": "+proj=lcc +lat_0=36.5 +lon_0=-120.5 +lat_1=38.4333333333333 +lat_2=37.0666666666667 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6420",
    "name": "NAD83(2011) / California zone 3 (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.5 +lon_0=-120.5 +lat_1=38.4333333333333 +lat_2=37.0666666666667 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6421",
    "name": "NAD83(2011) / California zone 4",
    "proj4": "+proj=lcc +lat_0=35.3333333333333 +lon_0=-119 +lat_1=37.25 +lat_2=36 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6422",
    "name": "NAD83(2011) / California zone 4 (ftUS)",
    "proj4": "+proj=lcc +lat_0=35.3333333333333 +lon_0=-119 +lat_1=37.25 +lat_2=36 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6423",
    "name": "NAD83(2011) / California zone 5",
    "proj4": "+proj=lcc +lat_0=33.5 +lon_0=-118 +lat_1=35.4666666666667 +lat_2=34.0333333333333 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6424",
    "name": "NAD83(2011) / California zone 5 (ftUS)",
    "proj4": "+proj=lcc +lat_0=33.5 +lon_0=-118 +lat_1=35.4666666666667 +lat_2=34.0333333333333 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6425",
    "name": "NAD83(2011) / California zone 6",
    "proj4": "+proj=lcc +lat_0=32.1666666666667 +lon_0=-116.25 +lat_1=33.8833333333333 +lat_2=32.7833333333333 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6426",
    "name": "NAD83(2011) / California zone 6 (ftUS)",
    "proj4": "+proj=lcc +lat_0=32.1666666666667 +lon_0=-116.25 +lat_1=33.8833333333333 +lat_2=32.7833333333333 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6427",
    "name": "NAD83(2011) / Colorado Central",
    "proj4": "+proj=lcc +lat_0=37.8333333333333 +lon_0=-105.5 +lat_1=39.75 +lat_2=38.45 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6428",
    "name": "NAD83(2011) / Colorado Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=37.8333333333333 +lon_0=-105.5 +lat_1=39.75 +lat_2=38.45 +x_0=914401.828803657 +y_0=304800.609601219 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6429",
    "name": "NAD83(2011) / Colorado North",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-105.5 +lat_1=40.7833333333333 +lat_2=39.7166666666667 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6430",
    "name": "NAD83(2011) / Colorado North (ftUS)",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-105.5 +lat_1=40.7833333333333 +lat_2=39.7166666666667 +x_0=914401.828803657 +y_0=304800.609601219 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6431",
    "name": "NAD83(2011) / Colorado South",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-105.5 +lat_1=38.4333333333333 +lat_2=37.2333333333333 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6432",
    "name": "NAD83(2011) / Colorado South (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-105.5 +lat_1=38.4333333333333 +lat_2=37.2333333333333 +x_0=914401.828803657 +y_0=304800.609601219 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6437",
    "name": "NAD83(2011) / Florida East",
    "proj4": "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6438",
    "name": "NAD83(2011) / Florida East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6440",
    "name": "NAD83(2011) / Florida North",
    "proj4": "+proj=lcc +lat_0=29 +lon_0=-84.5 +lat_1=30.75 +lat_2=29.5833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6441",
    "name": "NAD83(2011) / Florida North (ftUS)",
    "proj4": "+proj=lcc +lat_0=29 +lon_0=-84.5 +lat_1=30.75 +lat_2=29.5833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6442",
    "name": "NAD83(2011) / Florida West",
    "proj4": "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6443",
    "name": "NAD83(2011) / Florida West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6444",
    "name": "NAD83(2011) / Georgia East",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-82.1666666666667 +k=0.9999 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6445",
    "name": "NAD83(2011) / Georgia East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-82.1666666666667 +k=0.9999 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6446",
    "name": "NAD83(2011) / Georgia West",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-84.1666666666667 +k=0.9999 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6447",
    "name": "NAD83(2011) / Georgia West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-84.1666666666667 +k=0.9999 +x_0=699999.999898399 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "7057",
    "name": "NAD83(2011) / IaRCS zone 1",
    "proj4": "+proj=lcc +lat_1=43.2 +lat_0=43.2 +lon_0=-95.25 +k_0=1.000052 +x_0=3505207.01041402 +y_0=2926085.8521717 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "7066",
    "name": "NAD83(2011) / IaRCS zone 10",
    "proj4": "+proj=lcc +lat_1=41.8333333333333 +lat_0=41.8333333333333 +lon_0=-91.6666666666667 +k_0=1.00002 +x_0=6248412.49682499 +y_0=2438404.87680975 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "7067",
    "name": "NAD83(2011) / IaRCS zone 11",
    "proj4": "+proj=tmerc +lat_0=40.25 +lon_0=-90.5333333333333 +k=1.000027 +x_0=6553213.10642621 +y_0=2316484.63296926 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "7068",
    "name": "NAD83(2011) / IaRCS zone 12",
    "proj4": "+proj=lcc +lat_1=40.9166666666667 +lat_0=40.9166666666667 +lon_0=-93.75 +k_0=1.000037 +x_0=6858013.71602743 +y_0=1889763.77952756 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "7069",
    "name": "NAD83(2011) / IaRCS zone 13",
    "proj4": "+proj=tmerc +lat_0=40.25 +lon_0=-91.9166666666667 +k=1.00002 +x_0=7162814.32562865 +y_0=1950723.9014478 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "7070",
    "name": "NAD83(2011) / IaRCS zone 14",
    "proj4": "+proj=tmerc +lat_0=40.25 +lon_0=-91.25 +k=1.000018 +x_0=7467614.93522987 +y_0=1889763.77952756 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "7058",
    "name": "NAD83(2011) / IaRCS zone 2",
    "proj4": "+proj=lcc +lat_1=43.1666666666667 +lat_0=43.1666666666667 +lon_0=-92.75 +k_0=1.000043 +x_0=3810007.62001524 +y_0=2987045.97409195 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "7059",
    "name": "NAD83(2011) / IaRCS zone 3",
    "proj4": "+proj=tmerc +lat_0=40.25 +lon_0=-91.2 +k=1.000035 +x_0=4114808.22961646 +y_0=2529845.05969012 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "7060",
    "name": "NAD83(2011) / IaRCS zone 4",
    "proj4": "+proj=lcc +lat_1=42.5333333333333 +lat_0=42.5333333333333 +lon_0=-94.8333333333333 +k_0=1.000045 +x_0=4419608.83921768 +y_0=2621285.24257048 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "7061",
    "name": "NAD83(2011) / IaRCS zone 5",
    "proj4": "+proj=lcc +lat_1=42.65 +lat_0=42.65 +lon_0=-92.25 +k_0=1.000032 +x_0=4724409.4488189 +y_0=2712725.42545085 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "7062",
    "name": "NAD83(2011) / IaRCS zone 6",
    "proj4": "+proj=tmerc +lat_0=40.25 +lon_0=-95.7333333333333 +k=1.000039 +x_0=5029210.05842011 +y_0=2011684.02336805 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "7063",
    "name": "NAD83(2011) / IaRCS zone 7",
    "proj4": "+proj=tmerc +lat_0=40.25 +lon_0=-94.6333333333333 +k=1.000045 +x_0=5334010.66802133 +y_0=2072644.14528829 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "7064",
    "name": "NAD83(2011) / IaRCS zone 8",
    "proj4": "+proj=tmerc +lat_0=40.25 +lon_0=-93.7166666666667 +k=1.000033 +x_0=5638811.27762255 +y_0=2133604.26720853 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "7065",
    "name": "NAD83(2011) / IaRCS zone 9",
    "proj4": "+proj=tmerc +lat_0=40.25 +lon_0=-92.8166666666667 +k=1.000027 +x_0=5943611.88722377 +y_0=2194564.38912878 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6448",
    "name": "NAD83(2011) / Idaho Central",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-114 +k=0.999947368 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6449",
    "name": "NAD83(2011) / Idaho Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-114 +k=0.999947368 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6450",
    "name": "NAD83(2011) / Idaho East",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-112.166666666667 +k=0.999947368 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6451",
    "name": "NAD83(2011) / Idaho East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-112.166666666667 +k=0.999947368 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6452",
    "name": "NAD83(2011) / Idaho West",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-115.75 +k=0.999933333 +x_0=800000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6453",
    "name": "NAD83(2011) / Idaho West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-115.75 +k=0.999933333 +x_0=800000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6454",
    "name": "NAD83(2011) / Illinois East",
    "proj4": "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-88.3333333333333 +k=0.999975 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6455",
    "name": "NAD83(2011) / Illinois East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-88.3333333333333 +k=0.999975 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6456",
    "name": "NAD83(2011) / Illinois West",
    "proj4": "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-90.1666666666667 +k=0.999941177 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6457",
    "name": "NAD83(2011) / Illinois West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-90.1666666666667 +k=0.999941177 +x_0=699999.99998984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6458",
    "name": "NAD83(2011) / Indiana East",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-85.6666666666667 +k=0.999966667 +x_0=100000 +y_0=250000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6459",
    "name": "NAD83(2011) / Indiana East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-85.6666666666667 +k=0.999966667 +x_0=99999.9998983997 +y_0=249999.9998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6460",
    "name": "NAD83(2011) / Indiana West",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-87.0833333333333 +k=0.999966667 +x_0=900000 +y_0=250000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6461",
    "name": "NAD83(2011) / Indiana West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-87.0833333333333 +k=0.999966667 +x_0=900000 +y_0=249999.9998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6462",
    "name": "NAD83(2011) / Iowa North",
    "proj4": "+proj=lcc +lat_0=41.5 +lon_0=-93.5 +lat_1=43.2666666666667 +lat_2=42.0666666666667 +x_0=1500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6463",
    "name": "NAD83(2011) / Iowa North (ftUS)",
    "proj4": "+proj=lcc +lat_0=41.5 +lon_0=-93.5 +lat_1=43.2666666666667 +lat_2=42.0666666666667 +x_0=1500000 +y_0=999999.999989839 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6464",
    "name": "NAD83(2011) / Iowa South",
    "proj4": "+proj=lcc +lat_0=40 +lon_0=-93.5 +lat_1=41.7833333333333 +lat_2=40.6166666666667 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6465",
    "name": "NAD83(2011) / Iowa South (ftUS)",
    "proj4": "+proj=lcc +lat_0=40 +lon_0=-93.5 +lat_1=41.7833333333333 +lat_2=40.6166666666667 +x_0=500000.00001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6466",
    "name": "NAD83(2011) / Kansas North",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-98 +lat_1=39.7833333333333 +lat_2=38.7166666666667 +x_0=400000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6467",
    "name": "NAD83(2011) / Kansas North (ftUS)",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-98 +lat_1=39.7833333333333 +lat_2=38.7166666666667 +x_0=399999.99998984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6468",
    "name": "NAD83(2011) / Kansas South",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-98.5 +lat_1=38.5666666666667 +lat_2=37.2666666666667 +x_0=400000 +y_0=400000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6469",
    "name": "NAD83(2011) / Kansas South (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-98.5 +lat_1=38.5666666666667 +lat_2=37.2666666666667 +x_0=399999.99998984 +y_0=399999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6470",
    "name": "NAD83(2011) / Kentucky North",
    "proj4": "+proj=lcc +lat_0=37.5 +lon_0=-84.25 +lat_1=37.9666666666667 +lat_2=38.9666666666667 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6471",
    "name": "NAD83(2011) / Kentucky North (ftUS)",
    "proj4": "+proj=lcc +lat_0=37.5 +lon_0=-84.25 +lat_1=37.9666666666667 +lat_2=38.9666666666667 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6472",
    "name": "NAD83(2011) / Kentucky Single Zone",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.0833333333333 +lat_2=38.6666666666667 +x_0=1500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6473",
    "name": "NAD83(2011) / Kentucky Single Zone (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.0833333333333 +lat_2=38.6666666666667 +x_0=1500000 +y_0=999999.999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6474",
    "name": "NAD83(2011) / Kentucky South",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.9333333333333 +lat_2=36.7333333333333 +x_0=500000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6475",
    "name": "NAD83(2011) / Kentucky South (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.9333333333333 +lat_2=36.7333333333333 +x_0=500000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8518",
    "name": "NAD83(2011) / KS RCS zone 1",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-101.6 +k=1.000156 +x_0=457200.914401829 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8527",
    "name": "NAD83(2011) / KS RCS zone 10",
    "proj4": "+proj=lcc +lat_1=39.6333333333333 +lat_0=39.6333333333333 +lon_0=-95.75 +k_0=1.00004 +x_0=3200406.4008128 +y_0=213360.426720853 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8528",
    "name": "NAD83(2011) / KS RCS zone 11",
    "proj4": "+proj=lcc +lat_1=39.1 +lat_0=39.1 +lon_0=-95.25 +k_0=1.000033 +x_0=3505207.01041402 +y_0=182880.365760731 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8529",
    "name": "NAD83(2011) / KS RCS zone 12",
    "proj4": "+proj=tmerc +lat_0=36.75 +lon_0=-101.416666666667 +k=1.00014 +x_0=3810007.62001524 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8531",
    "name": "NAD83(2011) / KS RCS zone 13",
    "proj4": "+proj=tmerc +lat_0=36.75 +lon_0=-100.4 +k=1.000109 +x_0=4114808.22961646 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8533",
    "name": "NAD83(2011) / KS RCS zone 14",
    "proj4": "+proj=tmerc +lat_0=36.75 +lon_0=-99.6666666666667 +k=1.000097 +x_0=4419608.83921768 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8534",
    "name": "NAD83(2011) / KS RCS zone 15",
    "proj4": "+proj=tmerc +lat_0=36.75 +lon_0=-99.2 +k=1.000087 +x_0=4724409.4488189 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8535",
    "name": "NAD83(2011) / KS RCS zone 16",
    "proj4": "+proj=tmerc +lat_0=36.75 +lon_0=-98.55 +k=1.000069 +x_0=5029210.05842011 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8536",
    "name": "NAD83(2011) / KS RCS zone 17",
    "proj4": "+proj=lcc +lat_1=37.7666666666667 +lat_0=37.7666666666667 +lon_0=-97.5 +k_0=1.000059 +x_0=5334010.66802133 +y_0=121920.243840488 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8538",
    "name": "NAD83(2011) / KS RCS zone 18",
    "proj4": "+proj=lcc +lat_1=37.1833333333333 +lat_0=37.1833333333333 +lon_0=-97.5 +k_0=1.000055 +x_0=5638811.27762255 +y_0=60960.1219202438 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8539",
    "name": "NAD83(2011) / KS RCS zone 19",
    "proj4": "+proj=tmerc +lat_0=36.75 +lon_0=-95.9666666666667 +k=1.000034 +x_0=5943611.88722377 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8519",
    "name": "NAD83(2011) / KS RCS zone 2",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-100.95 +k=1.000134 +x_0=762001.524003047 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8540",
    "name": "NAD83(2011) / KS RCS zone 20",
    "proj4": "+proj=tmerc +lat_0=36.75 +lon_0=-95.0833333333333 +k=1.000031 +x_0=6248412.49682499 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8520",
    "name": "NAD83(2011) / KS RCS zone 3",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-100.35 +k=1.000116 +x_0=1066802.13360427 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8521",
    "name": "NAD83(2011) / KS RCS zone 4",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-99.45 +k=1.000082 +x_0=1371602.74320549 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8522",
    "name": "NAD83(2011) / KS RCS zone 5",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-98.6666666666667 +k=1.000078 +x_0=1676403.3528067 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8523",
    "name": "NAD83(2011) / KS RCS zone 6",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-98.15 +k=1.000068 +x_0=1981203.96240792 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8524",
    "name": "NAD83(2011) / KS RCS zone 7",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-97.3333333333333 +k=1.000049 +x_0=2286004.57200914 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8525",
    "name": "NAD83(2011) / KS RCS zone 8",
    "proj4": "+proj=lcc +lat_1=39.1666666666667 +lat_0=39.1666666666667 +lon_0=-96.5 +k_0=1.000044 +x_0=2590805.18161036 +y_0=182880.365760731 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8526",
    "name": "NAD83(2011) / KS RCS zone 9",
    "proj4": "+proj=lcc +lat_1=38.5 +lat_0=38.5 +lon_0=-96.5 +k_0=1.00005 +x_0=2895605.79121158 +y_0=91440.1828803657 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6476",
    "name": "NAD83(2011) / Louisiana North",
    "proj4": "+proj=lcc +lat_0=30.5 +lon_0=-92.5 +lat_1=32.6666666666667 +lat_2=31.1666666666667 +x_0=1000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6477",
    "name": "NAD83(2011) / Louisiana North (ftUS)",
    "proj4": "+proj=lcc +lat_0=30.5 +lon_0=-92.5 +lat_1=32.6666666666667 +lat_2=31.1666666666667 +x_0=999999.999989839 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6478",
    "name": "NAD83(2011) / Louisiana South",
    "proj4": "+proj=lcc +lat_0=28.5 +lon_0=-91.3333333333333 +lat_1=30.7 +lat_2=29.3 +x_0=1000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6479",
    "name": "NAD83(2011) / Louisiana South (ftUS)",
    "proj4": "+proj=lcc +lat_0=28.5 +lon_0=-91.3333333333333 +lat_1=30.7 +lat_2=29.3 +x_0=999999.999989839 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6480",
    "name": "NAD83(2011) / Maine CS2000 Central",
    "proj4": "+proj=tmerc +lat_0=43.5 +lon_0=-69.125 +k=0.99998 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6481",
    "name": "NAD83(2011) / Maine CS2000 East",
    "proj4": "+proj=tmerc +lat_0=43.8333333333333 +lon_0=-67.875 +k=0.99998 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6482",
    "name": "NAD83(2011) / Maine CS2000 West",
    "proj4": "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-70.375 +k=0.99998 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6483",
    "name": "NAD83(2011) / Maine East",
    "proj4": "+proj=tmerc +lat_0=43.6666666666667 +lon_0=-68.5 +k=0.9999 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6484",
    "name": "NAD83(2011) / Maine East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=43.6666666666667 +lon_0=-68.5 +k=0.9999 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6485",
    "name": "NAD83(2011) / Maine West",
    "proj4": "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-70.1666666666667 +k=0.999966667 +x_0=900000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6486",
    "name": "NAD83(2011) / Maine West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-70.1666666666667 +k=0.999966667 +x_0=900000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6493",
    "name": "NAD83(2011) / Michigan Central",
    "proj4": "+proj=lcc +lat_0=43.3166666666667 +lon_0=-84.3666666666667 +lat_1=45.7 +lat_2=44.1833333333333 +x_0=6000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6494",
    "name": "NAD83(2011) / Michigan Central (ft)",
    "proj4": "+proj=lcc +lat_0=43.3166666666667 +lon_0=-84.3666666666667 +lat_1=45.7 +lat_2=44.1833333333333 +x_0=5999999.999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6495",
    "name": "NAD83(2011) / Michigan North",
    "proj4": "+proj=lcc +lat_0=44.7833333333333 +lon_0=-87 +lat_1=47.0833333333333 +lat_2=45.4833333333333 +x_0=8000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6496",
    "name": "NAD83(2011) / Michigan North (ft)",
    "proj4": "+proj=lcc +lat_0=44.7833333333333 +lon_0=-87 +lat_1=47.0833333333333 +lat_2=45.4833333333333 +x_0=7999999.999968 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6498",
    "name": "NAD83(2011) / Michigan South",
    "proj4": "+proj=lcc +lat_0=41.5 +lon_0=-84.3666666666667 +lat_1=43.6666666666667 +lat_2=42.1 +x_0=4000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6499",
    "name": "NAD83(2011) / Michigan South (ft)",
    "proj4": "+proj=lcc +lat_0=41.5 +lon_0=-84.3666666666667 +lat_1=43.6666666666667 +lat_2=42.1 +x_0=3999999.999984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6500",
    "name": "NAD83(2011) / Minnesota Central",
    "proj4": "+proj=lcc +lat_0=45 +lon_0=-94.25 +lat_1=47.05 +lat_2=45.6166666666667 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6501",
    "name": "NAD83(2011) / Minnesota Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=45 +lon_0=-94.25 +lat_1=47.05 +lat_2=45.6166666666667 +x_0=800000.00001016 +y_0=99999.9999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6502",
    "name": "NAD83(2011) / Minnesota North",
    "proj4": "+proj=lcc +lat_0=46.5 +lon_0=-93.1 +lat_1=48.6333333333333 +lat_2=47.0333333333333 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6503",
    "name": "NAD83(2011) / Minnesota North (ftUS)",
    "proj4": "+proj=lcc +lat_0=46.5 +lon_0=-93.1 +lat_1=48.6333333333333 +lat_2=47.0333333333333 +x_0=800000.00001016 +y_0=99999.9999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6504",
    "name": "NAD83(2011) / Minnesota South",
    "proj4": "+proj=lcc +lat_0=43 +lon_0=-94 +lat_1=45.2166666666667 +lat_2=43.7833333333333 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6505",
    "name": "NAD83(2011) / Minnesota South (ftUS)",
    "proj4": "+proj=lcc +lat_0=43 +lon_0=-94 +lat_1=45.2166666666667 +lat_2=43.7833333333333 +x_0=800000.00001016 +y_0=99999.9999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6506",
    "name": "NAD83(2011) / Mississippi East",
    "proj4": "+proj=tmerc +lat_0=29.5 +lon_0=-88.8333333333333 +k=0.99995 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6507",
    "name": "NAD83(2011) / Mississippi East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=29.5 +lon_0=-88.8333333333333 +k=0.99995 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6509",
    "name": "NAD83(2011) / Mississippi West",
    "proj4": "+proj=tmerc +lat_0=29.5 +lon_0=-90.3333333333333 +k=0.99995 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6510",
    "name": "NAD83(2011) / Mississippi West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=29.5 +lon_0=-90.3333333333333 +k=0.99995 +x_0=699999.999898399 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6511",
    "name": "NAD83(2011) / Missouri Central",
    "proj4": "+proj=tmerc +lat_0=35.8333333333333 +lon_0=-92.5 +k=0.999933333 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6512",
    "name": "NAD83(2011) / Missouri East",
    "proj4": "+proj=tmerc +lat_0=35.8333333333333 +lon_0=-90.5 +k=0.999933333 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6513",
    "name": "NAD83(2011) / Missouri West",
    "proj4": "+proj=tmerc +lat_0=36.1666666666667 +lon_0=-94.5 +k=0.999941177 +x_0=850000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6518",
    "name": "NAD83(2011) / Nevada Central",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-116.666666666667 +k=0.9999 +x_0=500000 +y_0=6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6519",
    "name": "NAD83(2011) / Nevada Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-116.666666666667 +k=0.9999 +x_0=500000.00001016 +y_0=6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6520",
    "name": "NAD83(2011) / Nevada East",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-115.583333333333 +k=0.9999 +x_0=200000 +y_0=8000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6521",
    "name": "NAD83(2011) / Nevada East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-115.583333333333 +k=0.9999 +x_0=200000.00001016 +y_0=8000000.00001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6522",
    "name": "NAD83(2011) / Nevada West",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-118.583333333333 +k=0.9999 +x_0=800000 +y_0=4000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6523",
    "name": "NAD83(2011) / Nevada West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-118.583333333333 +k=0.9999 +x_0=800000.00001016 +y_0=3999999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6528",
    "name": "NAD83(2011) / New Mexico Central",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6529",
    "name": "NAD83(2011) / New Mexico Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.9999 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6530",
    "name": "NAD83(2011) / New Mexico East",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-104.333333333333 +k=0.999909091 +x_0=165000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6531",
    "name": "NAD83(2011) / New Mexico East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-104.333333333333 +k=0.999909091 +x_0=165000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6532",
    "name": "NAD83(2011) / New Mexico West",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-107.833333333333 +k=0.999916667 +x_0=830000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6533",
    "name": "NAD83(2011) / New Mexico West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-107.833333333333 +k=0.999916667 +x_0=830000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6534",
    "name": "NAD83(2011) / New York Central",
    "proj4": "+proj=tmerc +lat_0=40 +lon_0=-76.5833333333333 +k=0.9999375 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6535",
    "name": "NAD83(2011) / New York Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40 +lon_0=-76.5833333333333 +k=0.9999375 +x_0=249999.9998984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6536",
    "name": "NAD83(2011) / New York East",
    "proj4": "+proj=tmerc +lat_0=38.8333333333333 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6537",
    "name": "NAD83(2011) / New York East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=38.8333333333333 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6540",
    "name": "NAD83(2011) / New York West",
    "proj4": "+proj=tmerc +lat_0=40 +lon_0=-78.5833333333333 +k=0.9999375 +x_0=350000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6541",
    "name": "NAD83(2011) / New York West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40 +lon_0=-78.5833333333333 +k=0.9999375 +x_0=350000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6542",
    "name": "NAD83(2011) / North Carolina",
    "proj4": "+proj=lcc +lat_0=33.75 +lon_0=-79 +lat_1=36.1666666666667 +lat_2=34.3333333333333 +x_0=609601.22 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6543",
    "name": "NAD83(2011) / North Carolina (ftUS)",
    "proj4": "+proj=lcc +lat_0=33.75 +lon_0=-79 +lat_1=36.1666666666667 +lat_2=34.3333333333333 +x_0=609601.219202438 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6544",
    "name": "NAD83(2011) / North Dakota North",
    "proj4": "+proj=lcc +lat_0=47 +lon_0=-100.5 +lat_1=48.7333333333333 +lat_2=47.4333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6545",
    "name": "NAD83(2011) / North Dakota North (ft)",
    "proj4": "+proj=lcc +lat_0=47 +lon_0=-100.5 +lat_1=48.7333333333333 +lat_2=47.4333333333333 +x_0=599999.9999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6546",
    "name": "NAD83(2011) / North Dakota South",
    "proj4": "+proj=lcc +lat_0=45.6666666666667 +lon_0=-100.5 +lat_1=47.4833333333333 +lat_2=46.1833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6547",
    "name": "NAD83(2011) / North Dakota South (ft)",
    "proj4": "+proj=lcc +lat_0=45.6666666666667 +lon_0=-100.5 +lat_1=47.4833333333333 +lat_2=46.1833333333333 +x_0=599999.9999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6548",
    "name": "NAD83(2011) / Ohio North",
    "proj4": "+proj=lcc +lat_0=39.6666666666667 +lon_0=-82.5 +lat_1=41.7 +lat_2=40.4333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6549",
    "name": "NAD83(2011) / Ohio North (ftUS)",
    "proj4": "+proj=lcc +lat_0=39.6666666666667 +lon_0=-82.5 +lat_1=41.7 +lat_2=40.4333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6550",
    "name": "NAD83(2011) / Ohio South",
    "proj4": "+proj=lcc +lat_0=38 +lon_0=-82.5 +lat_1=40.0333333333333 +lat_2=38.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6551",
    "name": "NAD83(2011) / Ohio South (ftUS)",
    "proj4": "+proj=lcc +lat_0=38 +lon_0=-82.5 +lat_1=40.0333333333333 +lat_2=38.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6552",
    "name": "NAD83(2011) / Oklahoma North",
    "proj4": "+proj=lcc +lat_0=35 +lon_0=-98 +lat_1=36.7666666666667 +lat_2=35.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6553",
    "name": "NAD83(2011) / Oklahoma North (ftUS)",
    "proj4": "+proj=lcc +lat_0=35 +lon_0=-98 +lat_1=36.7666666666667 +lat_2=35.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6554",
    "name": "NAD83(2011) / Oklahoma South",
    "proj4": "+proj=lcc +lat_0=33.3333333333333 +lon_0=-98 +lat_1=35.2333333333333 +lat_2=33.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6555",
    "name": "NAD83(2011) / Oklahoma South (ftUS)",
    "proj4": "+proj=lcc +lat_0=33.3333333333333 +lon_0=-98 +lat_1=35.2333333333333 +lat_2=33.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6787",
    "name": "NAD83(2011) / Oregon Baker zone (ft)",
    "proj4": "+proj=tmerc +lat_0=44.5 +lon_0=-117.833333333333 +k=1.00016 +x_0=39999.99999984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6786",
    "name": "NAD83(2011) / Oregon Baker zone (m)",
    "proj4": "+proj=tmerc +lat_0=44.5 +lon_0=-117.833333333333 +k=1.00016 +x_0=40000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6799",
    "name": "NAD83(2011) / Oregon Bend-Burns zone (ft)",
    "proj4": "+proj=lcc +lat_1=43.6666666666667 +lat_0=43.6666666666667 +lon_0=-119.75 +k_0=1.0002 +x_0=119999.99999952 +y_0=59999.99999976 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6798",
    "name": "NAD83(2011) / Oregon Bend-Burns zone (m)",
    "proj4": "+proj=lcc +lat_1=43.6666666666667 +lat_0=43.6666666666667 +lon_0=-119.75 +k_0=1.0002 +x_0=120000 +y_0=60000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6791",
    "name": "NAD83(2011) / Oregon Bend-Klamath Falls zone (ft)",
    "proj4": "+proj=tmerc +lat_0=41.75 +lon_0=-121.75 +k=1.0002 +x_0=79999.99999968 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6790",
    "name": "NAD83(2011) / Oregon Bend-Klamath Falls zone (m)",
    "proj4": "+proj=tmerc +lat_0=41.75 +lon_0=-121.75 +k=1.0002 +x_0=80000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6795",
    "name": "NAD83(2011) / Oregon Bend-Redmond-Prineville zone (ft)",
    "proj4": "+proj=lcc +lat_1=44.6666666666667 +lat_0=44.6666666666667 +lon_0=-121.25 +k_0=1.00012 +x_0=79999.99999968 +y_0=130000.00001472 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6794",
    "name": "NAD83(2011) / Oregon Bend-Redmond-Prineville zone (m)",
    "proj4": "+proj=lcc +lat_1=44.6666666666667 +lat_0=44.6666666666667 +lon_0=-121.25 +k_0=1.00012 +x_0=80000 +y_0=130000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "8312",
    "name": "NAD83(2011) / Oregon Burns-Harper zone (ft)",
    "proj4": "+proj=tmerc +lat_0=43.5 +lon_0=-117.666666666667 +k=1.00014 +x_0=90000.00001488 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8311",
    "name": "NAD83(2011) / Oregon Burns-Harper zone (m)",
    "proj4": "+proj=tmerc +lat_0=43.5 +lon_0=-117.666666666667 +k=1.00014 +x_0=90000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "8314",
    "name": "NAD83(2011) / Oregon Canyon City-Burns zone (ft)",
    "proj4": "+proj=tmerc +lat_0=43.5 +lon_0=-119 +k=1.00022 +x_0=19999.99999992 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8313",
    "name": "NAD83(2011) / Oregon Canyon City-Burns zone (m)",
    "proj4": "+proj=tmerc +lat_0=43.5 +lon_0=-119 +k=1.00022 +x_0=20000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6803",
    "name": "NAD83(2011) / Oregon Canyonville-Grants Pass zone (ft)",
    "proj4": "+proj=tmerc +lat_0=42.5 +lon_0=-123.333333333333 +k=1.00007 +x_0=39999.99999984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6802",
    "name": "NAD83(2011) / Oregon Canyonville-Grants Pass zone (m)",
    "proj4": "+proj=tmerc +lat_0=42.5 +lon_0=-123.333333333333 +k=1.00007 +x_0=40000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "8316",
    "name": "NAD83(2011) / Oregon Coast Range North zone (ft)",
    "proj4": "+proj=lcc +lat_1=45.5833333333333 +lat_0=45.5833333333333 +lon_0=-123.416666666667 +k_0=1.000045 +x_0=30000.00001512 +y_0=19999.99999992 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8315",
    "name": "NAD83(2011) / Oregon Coast Range North zone (m)",
    "proj4": "+proj=lcc +lat_1=45.5833333333333 +lat_0=45.5833333333333 +lon_0=-123.416666666667 +k_0=1.000045 +x_0=30000 +y_0=20000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6843",
    "name": "NAD83(2011) / Oregon Coast zone (ft)",
    "proj4": "+proj=omerc +no_uoff +lat_0=44.75 +lonc=-124.05 +alpha=5 +gamma=5 +k=1 +x_0=-299999.9999988 +y_0=-4600000.00001208 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6842",
    "name": "NAD83(2011) / Oregon Coast zone (m)",
    "proj4": "+proj=omerc +no_uoff +lat_0=44.75 +lonc=-124.05 +alpha=5 +gamma=5 +k=1 +x_0=-300000 +y_0=-4600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6807",
    "name": "NAD83(2011) / Oregon Columbia River East zone (ft)",
    "proj4": "+proj=lcc +lat_1=45.6666666666667 +lat_0=45.6666666666667 +lon_0=-120.5 +k_0=1.000008 +x_0=150000.00001464 +y_0=30000.00001512 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6806",
    "name": "NAD83(2011) / Oregon Columbia River East zone (m)",
    "proj4": "+proj=lcc +lat_1=45.6666666666667 +lat_0=45.6666666666667 +lon_0=-120.5 +k_0=1.000008 +x_0=150000 +y_0=30000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6811",
    "name": "NAD83(2011) / Oregon Columbia River West zone (ft)",
    "proj4": "+proj=omerc +no_uoff +lat_0=45.9166666666667 +lonc=-123 +alpha=295 +gamma=295 +k=1 +x_0=7000000.00000248 +y_0=-2999999.999988 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6810",
    "name": "NAD83(2011) / Oregon Columbia River West zone (m)",
    "proj4": "+proj=omerc +no_uoff +lat_0=45.9166666666667 +lonc=-123 +alpha=295 +gamma=295 +k=1 +x_0=7000000 +y_0=-3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6815",
    "name": "NAD83(2011) / Oregon Cottage Grove-Canyonville zone (ft)",
    "proj4": "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-123.333333333333 +k=1.000023 +x_0=50000.00001504 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6814",
    "name": "NAD83(2011) / Oregon Cottage Grove-Canyonville zone (m)",
    "proj4": "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-123.333333333333 +k=1.000023 +x_0=50000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "8318",
    "name": "NAD83(2011) / Oregon Dayville-Prairie City zone (ft)",
    "proj4": "+proj=tmerc +lat_0=44.25 +lon_0=-119.633333333333 +k=1.00012 +x_0=19999.99999992 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8317",
    "name": "NAD83(2011) / Oregon Dayville-Prairie City zone (m)",
    "proj4": "+proj=tmerc +lat_0=44.25 +lon_0=-119.633333333333 +k=1.00012 +x_0=20000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "8320",
    "name": "NAD83(2011) / Oregon Denio-Burns zone (ft)",
    "proj4": "+proj=tmerc +lat_0=41.75 +lon_0=-118.416666666667 +k=1.00019 +x_0=79999.99999968 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8319",
    "name": "NAD83(2011) / Oregon Denio-Burns zone (m)",
    "proj4": "+proj=tmerc +lat_0=41.75 +lon_0=-118.416666666667 +k=1.00019 +x_0=80000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6819",
    "name": "NAD83(2011) / Oregon Dufur-Madras zone (ft)",
    "proj4": "+proj=tmerc +lat_0=44.5 +lon_0=-121 +k=1.00011 +x_0=79999.99999968 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6818",
    "name": "NAD83(2011) / Oregon Dufur-Madras zone (m)",
    "proj4": "+proj=tmerc +lat_0=44.5 +lon_0=-121 +k=1.00011 +x_0=80000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6823",
    "name": "NAD83(2011) / Oregon Eugene zone (ft)",
    "proj4": "+proj=tmerc +lat_0=43.75 +lon_0=-123.166666666667 +k=1.000015 +x_0=50000.00001504 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6822",
    "name": "NAD83(2011) / Oregon Eugene zone (m)",
    "proj4": "+proj=tmerc +lat_0=43.75 +lon_0=-123.166666666667 +k=1.000015 +x_0=50000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6827",
    "name": "NAD83(2011) / Oregon Grants Pass-Ashland zone (ft)",
    "proj4": "+proj=tmerc +lat_0=41.75 +lon_0=-123.333333333333 +k=1.000043 +x_0=50000.00001504 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6826",
    "name": "NAD83(2011) / Oregon Grants Pass-Ashland zone (m)",
    "proj4": "+proj=tmerc +lat_0=41.75 +lon_0=-123.333333333333 +k=1.000043 +x_0=50000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6831",
    "name": "NAD83(2011) / Oregon Gresham-Warm Springs zone (ft)",
    "proj4": "+proj=tmerc +lat_0=45 +lon_0=-122.333333333333 +k=1.00005 +x_0=10000.0000152 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6830",
    "name": "NAD83(2011) / Oregon Gresham-Warm Springs zone (m)",
    "proj4": "+proj=tmerc +lat_0=45 +lon_0=-122.333333333333 +k=1.00005 +x_0=10000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "8322",
    "name": "NAD83(2011) / Oregon Halfway zone (ft)",
    "proj4": "+proj=lcc +lat_1=45.25 +lat_0=45.25 +lon_0=-117.25 +k_0=1.000085 +x_0=39999.99999984 +y_0=70000.00001496 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8321",
    "name": "NAD83(2011) / Oregon Halfway zone (m)",
    "proj4": "+proj=lcc +lat_1=45.25 +lat_0=45.25 +lon_0=-117.25 +k_0=1.000085 +x_0=40000 +y_0=70000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6835",
    "name": "NAD83(2011) / Oregon La Grande zone (ft)",
    "proj4": "+proj=tmerc +lat_0=45 +lon_0=-118 +k=1.00013 +x_0=39999.99999984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6834",
    "name": "NAD83(2011) / Oregon La Grande zone (m)",
    "proj4": "+proj=tmerc +lat_0=45 +lon_0=-118 +k=1.00013 +x_0=40000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "8324",
    "name": "NAD83(2011) / Oregon Medford-Diamond Lake zone (ft)",
    "proj4": "+proj=lcc +lat_1=42 +lat_0=42 +lon_0=-122.25 +k_0=1.00004 +x_0=59999.99999976 +y_0=-59999.99999976 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8323",
    "name": "NAD83(2011) / Oregon Medford-Diamond Lake zone (m)",
    "proj4": "+proj=lcc +lat_1=42 +lat_0=42 +lon_0=-122.25 +k_0=1.00004 +x_0=60000 +y_0=-60000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "8326",
    "name": "NAD83(2011) / Oregon Mitchell zone (ft)",
    "proj4": "+proj=lcc +lat_1=47 +lat_0=47 +lon_0=-120.25 +k_0=0.99927 +x_0=30000.00001512 +y_0=290000.00001408 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8325",
    "name": "NAD83(2011) / Oregon Mitchell zone (m)",
    "proj4": "+proj=lcc +lat_1=47 +lat_0=47 +lon_0=-120.25 +k_0=0.99927 +x_0=30000 +y_0=290000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6558",
    "name": "NAD83(2011) / Oregon North",
    "proj4": "+proj=lcc +lat_0=43.6666666666667 +lon_0=-120.5 +lat_1=46 +lat_2=44.3333333333333 +x_0=2500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6559",
    "name": "NAD83(2011) / Oregon North (ft)",
    "proj4": "+proj=lcc +lat_0=43.6666666666667 +lon_0=-120.5 +lat_1=46 +lat_2=44.3333333333333 +x_0=2500000.0001424 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8328",
    "name": "NAD83(2011) / Oregon North Central zone (ft)",
    "proj4": "+proj=lcc +lat_1=46.1666666666667 +lat_0=46.1666666666667 +lon_0=-120.5 +k_0=1 +x_0=99999.9999996 +y_0=139999.99999944 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8327",
    "name": "NAD83(2011) / Oregon North Central zone (m)",
    "proj4": "+proj=lcc +lat_1=46.1666666666667 +lat_0=46.1666666666667 +lon_0=-120.5 +k_0=1 +x_0=100000 +y_0=140000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "8330",
    "name": "NAD83(2011) / Oregon Ochoco Summit zone (ft)",
    "proj4": "+proj=lcc +lat_1=43.5 +lat_0=43.5 +lon_0=-120.5 +k_0=1.00006 +x_0=39999.99999984 +y_0=-79999.99999968 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8329",
    "name": "NAD83(2011) / Oregon Ochoco Summit zone (m)",
    "proj4": "+proj=lcc +lat_1=43.5 +lat_0=43.5 +lon_0=-120.5 +k_0=1.00006 +x_0=40000 +y_0=-80000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6839",
    "name": "NAD83(2011) / Oregon Ontario zone (ft)",
    "proj4": "+proj=tmerc +lat_0=43.25 +lon_0=-117 +k=1.0001 +x_0=79999.99999968 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6838",
    "name": "NAD83(2011) / Oregon Ontario zone (m)",
    "proj4": "+proj=tmerc +lat_0=43.25 +lon_0=-117 +k=1.0001 +x_0=80000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "8332",
    "name": "NAD83(2011) / Oregon Owyhee zone (ft)",
    "proj4": "+proj=tmerc +lat_0=41.75 +lon_0=-117.583333333333 +k=1.00018 +x_0=70000.00001496 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8331",
    "name": "NAD83(2011) / Oregon Owyhee zone (m)",
    "proj4": "+proj=tmerc +lat_0=41.75 +lon_0=-117.583333333333 +k=1.00018 +x_0=70000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6847",
    "name": "NAD83(2011) / Oregon Pendleton zone (ft)",
    "proj4": "+proj=tmerc +lat_0=45.25 +lon_0=-119.166666666667 +k=1.000045 +x_0=59999.99999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6846",
    "name": "NAD83(2011) / Oregon Pendleton zone (m)",
    "proj4": "+proj=tmerc +lat_0=45.25 +lon_0=-119.166666666667 +k=1.000045 +x_0=60000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6851",
    "name": "NAD83(2011) / Oregon Pendleton-La Grande zone (ft)",
    "proj4": "+proj=tmerc +lat_0=45.0833333333333 +lon_0=-118.333333333333 +k=1.000175 +x_0=30000.00001512 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6850",
    "name": "NAD83(2011) / Oregon Pendleton-La Grande zone (m)",
    "proj4": "+proj=tmerc +lat_0=45.0833333333333 +lon_0=-118.333333333333 +k=1.000175 +x_0=30000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "8334",
    "name": "NAD83(2011) / Oregon Pilot Rock-Ukiah zone (ft)",
    "proj4": "+proj=lcc +lat_1=46.1666666666667 +lat_0=46.1666666666667 +lon_0=-119 +k_0=1.000025 +x_0=50000.00001504 +y_0=130000.00001472 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8333",
    "name": "NAD83(2011) / Oregon Pilot Rock-Ukiah zone (m)",
    "proj4": "+proj=lcc +lat_1=46.1666666666667 +lat_0=46.1666666666667 +lon_0=-119 +k_0=1.000025 +x_0=50000 +y_0=130000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6855",
    "name": "NAD83(2011) / Oregon Portland zone (ft)",
    "proj4": "+proj=lcc +lat_1=45.5 +lat_0=45.5 +lon_0=-122.75 +k_0=1.000002 +x_0=99999.9999996 +y_0=50000.00001504 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6854",
    "name": "NAD83(2011) / Oregon Portland zone (m)",
    "proj4": "+proj=lcc +lat_1=45.5 +lat_0=45.5 +lon_0=-122.75 +k_0=1.000002 +x_0=100000 +y_0=50000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "8336",
    "name": "NAD83(2011) / Oregon Prairie City-Brogan zone (ft)",
    "proj4": "+proj=lcc +lat_1=44 +lat_0=44 +lon_0=-118 +k_0=1.00017 +x_0=59999.99999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8335",
    "name": "NAD83(2011) / Oregon Prairie City-Brogan zone (m)",
    "proj4": "+proj=lcc +lat_1=44 +lat_0=44 +lon_0=-118 +k_0=1.00017 +x_0=60000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "8338",
    "name": "NAD83(2011) / Oregon Riley-Lakeview zone (ft)",
    "proj4": "+proj=tmerc +lat_0=41.75 +lon_0=-120.333333333333 +k=1.000215 +x_0=70000.00001496 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8337",
    "name": "NAD83(2011) / Oregon Riley-Lakeview zone (m)",
    "proj4": "+proj=tmerc +lat_0=41.75 +lon_0=-120.333333333333 +k=1.000215 +x_0=70000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6859",
    "name": "NAD83(2011) / Oregon Salem zone (ft)",
    "proj4": "+proj=tmerc +lat_0=44.3333333333333 +lon_0=-123.083333333333 +k=1.00001 +x_0=50000.00001504 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6858",
    "name": "NAD83(2011) / Oregon Salem zone (m)",
    "proj4": "+proj=tmerc +lat_0=44.3333333333333 +lon_0=-123.083333333333 +k=1.00001 +x_0=50000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6863",
    "name": "NAD83(2011) / Oregon Santiam Pass zone (ft)",
    "proj4": "+proj=tmerc +lat_0=44.0833333333333 +lon_0=-122.5 +k=1.000155 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6862",
    "name": "NAD83(2011) / Oregon Santiam Pass zone (m)",
    "proj4": "+proj=tmerc +lat_0=44.0833333333333 +lon_0=-122.5 +k=1.000155 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "8340",
    "name": "NAD83(2011) / Oregon Siskiyou Pass zone (ft)",
    "proj4": "+proj=lcc +lat_1=42.5 +lat_0=42.5 +lon_0=-122.583333333333 +k_0=1.00015 +x_0=10000.0000152 +y_0=59999.99999976 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8339",
    "name": "NAD83(2011) / Oregon Siskiyou Pass zone (m)",
    "proj4": "+proj=lcc +lat_1=42.5 +lat_0=42.5 +lon_0=-122.583333333333 +k_0=1.00015 +x_0=10000 +y_0=60000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6560",
    "name": "NAD83(2011) / Oregon South",
    "proj4": "+proj=lcc +lat_0=41.6666666666667 +lon_0=-120.5 +lat_1=44 +lat_2=42.3333333333333 +x_0=1500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6561",
    "name": "NAD83(2011) / Oregon South (ft)",
    "proj4": "+proj=lcc +lat_0=41.6666666666667 +lon_0=-120.5 +lat_1=44 +lat_2=42.3333333333333 +x_0=1500000.0001464 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8342",
    "name": "NAD83(2011) / Oregon Ukiah-Fox zone (ft)",
    "proj4": "+proj=lcc +lat_1=45.25 +lat_0=45.25 +lon_0=-119 +k_0=1.00014 +x_0=30000.00001512 +y_0=90000.00001488 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8341",
    "name": "NAD83(2011) / Oregon Ukiah-Fox zone (m)",
    "proj4": "+proj=lcc +lat_1=45.25 +lat_0=45.25 +lon_0=-119 +k_0=1.00014 +x_0=30000 +y_0=90000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "8344",
    "name": "NAD83(2011) / Oregon Wallowa zone (ft)",
    "proj4": "+proj=tmerc +lat_0=45.25 +lon_0=-117.5 +k=1.000195 +x_0=59999.99999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8343",
    "name": "NAD83(2011) / Oregon Wallowa zone (m)",
    "proj4": "+proj=tmerc +lat_0=45.25 +lon_0=-117.5 +k=1.000195 +x_0=60000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "8346",
    "name": "NAD83(2011) / Oregon Warner Highway zone (ft)",
    "proj4": "+proj=lcc +lat_1=42.5 +lat_0=42.5 +lon_0=-120 +k_0=1.000245 +x_0=39999.99999984 +y_0=59999.99999976 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8345",
    "name": "NAD83(2011) / Oregon Warner Highway zone (m)",
    "proj4": "+proj=lcc +lat_1=42.5 +lat_0=42.5 +lon_0=-120 +k_0=1.000245 +x_0=40000 +y_0=60000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "8348",
    "name": "NAD83(2011) / Oregon Willamette Pass zone (ft)",
    "proj4": "+proj=tmerc +lat_0=43 +lon_0=-122 +k=1.000223 +x_0=19999.99999992 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8347",
    "name": "NAD83(2011) / Oregon Willamette Pass zone (m)",
    "proj4": "+proj=tmerc +lat_0=43 +lon_0=-122 +k=1.000223 +x_0=20000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "8065",
    "name": "NAD83(2011) / PCCS zone 1 (ft)",
    "proj4": "+proj=omerc +lat_0=32.25 +lonc=-111.4 +alpha=45 +gamma=45 +k=1.00011 +x_0=48768 +y_0=243840 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8066",
    "name": "NAD83(2011) / PCCS zone 2 (ft)",
    "proj4": "+proj=tmerc +lat_0=31.25 +lon_0=-112.166666666667 +k=1.00009 +x_0=548640 +y_0=304800 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8067",
    "name": "NAD83(2011) / PCCS zone 3 (ft)",
    "proj4": "+proj=tmerc +lat_0=31.5 +lon_0=-113.166666666667 +k=1.000055 +x_0=182880 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "8068",
    "name": "NAD83(2011) / PCCS zone 4 (ft)",
    "proj4": "+proj=lcc +lat_1=30.5 +lat_0=30.5 +lon_0=-110.75 +k_0=0.9998 +x_0=9144 +y_0=-188976 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6562",
    "name": "NAD83(2011) / Pennsylvania North",
    "proj4": "+proj=lcc +lat_0=40.1666666666667 +lon_0=-77.75 +lat_1=41.95 +lat_2=40.8833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6563",
    "name": "NAD83(2011) / Pennsylvania North (ftUS)",
    "proj4": "+proj=lcc +lat_0=40.1666666666667 +lon_0=-77.75 +lat_1=41.95 +lat_2=40.8833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6564",
    "name": "NAD83(2011) / Pennsylvania South",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-77.75 +lat_1=40.9666666666667 +lat_2=39.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6565",
    "name": "NAD83(2011) / Pennsylvania South (ftUS)",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-77.75 +lat_1=40.9666666666667 +lat_2=39.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6569",
    "name": "NAD83(2011) / South Carolina",
    "proj4": "+proj=lcc +lat_0=31.8333333333333 +lon_0=-81 +lat_1=34.8333333333333 +lat_2=32.5 +x_0=609600 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6570",
    "name": "NAD83(2011) / South Carolina (ft)",
    "proj4": "+proj=lcc +lat_0=31.8333333333333 +lon_0=-81 +lat_1=34.8333333333333 +lat_2=32.5 +x_0=609600 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6571",
    "name": "NAD83(2011) / South Dakota North",
    "proj4": "+proj=lcc +lat_0=43.8333333333333 +lon_0=-100 +lat_1=45.6833333333333 +lat_2=44.4166666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6572",
    "name": "NAD83(2011) / South Dakota North (ftUS)",
    "proj4": "+proj=lcc +lat_0=43.8333333333333 +lon_0=-100 +lat_1=45.6833333333333 +lat_2=44.4166666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6573",
    "name": "NAD83(2011) / South Dakota South",
    "proj4": "+proj=lcc +lat_0=42.3333333333333 +lon_0=-100.333333333333 +lat_1=44.4 +lat_2=42.8333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6574",
    "name": "NAD83(2011) / South Dakota South (ftUS)",
    "proj4": "+proj=lcc +lat_0=42.3333333333333 +lon_0=-100.333333333333 +lat_1=44.4 +lat_2=42.8333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6577",
    "name": "NAD83(2011) / Texas Central",
    "proj4": "+proj=lcc +lat_0=29.6666666666667 +lon_0=-100.333333333333 +lat_1=31.8833333333333 +lat_2=30.1166666666667 +x_0=700000 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6578",
    "name": "NAD83(2011) / Texas Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=29.6666666666667 +lon_0=-100.333333333333 +lat_1=31.8833333333333 +lat_2=30.1166666666667 +x_0=699999.999898399 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6581",
    "name": "NAD83(2011) / Texas North",
    "proj4": "+proj=lcc +lat_0=34 +lon_0=-101.5 +lat_1=36.1833333333333 +lat_2=34.65 +x_0=200000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6582",
    "name": "NAD83(2011) / Texas North (ftUS)",
    "proj4": "+proj=lcc +lat_0=34 +lon_0=-101.5 +lat_1=36.1833333333333 +lat_2=34.65 +x_0=200000.0001016 +y_0=999999.999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6583",
    "name": "NAD83(2011) / Texas North Central",
    "proj4": "+proj=lcc +lat_0=31.6666666666667 +lon_0=-98.5 +lat_1=33.9666666666667 +lat_2=32.1333333333333 +x_0=600000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6584",
    "name": "NAD83(2011) / Texas North Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=31.6666666666667 +lon_0=-98.5 +lat_1=33.9666666666667 +lat_2=32.1333333333333 +x_0=600000 +y_0=2000000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6585",
    "name": "NAD83(2011) / Texas South",
    "proj4": "+proj=lcc +lat_0=25.6666666666667 +lon_0=-98.5 +lat_1=27.8333333333333 +lat_2=26.1666666666667 +x_0=300000 +y_0=5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6586",
    "name": "NAD83(2011) / Texas South (ftUS)",
    "proj4": "+proj=lcc +lat_0=25.6666666666667 +lon_0=-98.5 +lat_1=27.8333333333333 +lat_2=26.1666666666667 +x_0=300000 +y_0=5000000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6587",
    "name": "NAD83(2011) / Texas South Central",
    "proj4": "+proj=lcc +lat_0=27.8333333333333 +lon_0=-99 +lat_1=30.2833333333333 +lat_2=28.3833333333333 +x_0=600000 +y_0=4000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6588",
    "name": "NAD83(2011) / Texas South Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=27.8333333333333 +lon_0=-99 +lat_1=30.2833333333333 +lat_2=28.3833333333333 +x_0=600000 +y_0=3999999.9998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6619",
    "name": "NAD83(2011) / Utah Central",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-111.5 +lat_1=40.65 +lat_2=39.0166666666667 +x_0=500000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6625",
    "name": "NAD83(2011) / Utah Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-111.5 +lat_1=40.65 +lat_2=39.0166666666667 +x_0=500000.00001016 +y_0=2000000.00001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6620",
    "name": "NAD83(2011) / Utah North",
    "proj4": "+proj=lcc +lat_0=40.3333333333333 +lon_0=-111.5 +lat_1=41.7833333333333 +lat_2=40.7166666666667 +x_0=500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6626",
    "name": "NAD83(2011) / Utah North (ftUS)",
    "proj4": "+proj=lcc +lat_0=40.3333333333333 +lon_0=-111.5 +lat_1=41.7833333333333 +lat_2=40.7166666666667 +x_0=500000.00001016 +y_0=999999.999989839 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6621",
    "name": "NAD83(2011) / Utah South",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-111.5 +lat_1=38.35 +lat_2=37.2166666666667 +x_0=500000 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6627",
    "name": "NAD83(2011) / Utah South (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-111.5 +lat_1=38.35 +lat_2=37.2166666666667 +x_0=500000.00001016 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6592",
    "name": "NAD83(2011) / Virginia North",
    "proj4": "+proj=lcc +lat_0=37.6666666666667 +lon_0=-78.5 +lat_1=39.2 +lat_2=38.0333333333333 +x_0=3500000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6593",
    "name": "NAD83(2011) / Virginia North (ftUS)",
    "proj4": "+proj=lcc +lat_0=37.6666666666667 +lon_0=-78.5 +lat_1=39.2 +lat_2=38.0333333333333 +x_0=3500000.0001016 +y_0=2000000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6594",
    "name": "NAD83(2011) / Virginia South",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-78.5 +lat_1=37.9666666666667 +lat_2=36.7666666666667 +x_0=3500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6595",
    "name": "NAD83(2011) / Virginia South (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-78.5 +lat_1=37.9666666666667 +lat_2=36.7666666666667 +x_0=3500000.0001016 +y_0=999999.999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6596",
    "name": "NAD83(2011) / Washington North",
    "proj4": "+proj=lcc +lat_0=47 +lon_0=-120.833333333333 +lat_1=48.7333333333333 +lat_2=47.5 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6597",
    "name": "NAD83(2011) / Washington North (ftUS)",
    "proj4": "+proj=lcc +lat_0=47 +lon_0=-120.833333333333 +lat_1=48.7333333333333 +lat_2=47.5 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6598",
    "name": "NAD83(2011) / Washington South",
    "proj4": "+proj=lcc +lat_0=45.3333333333333 +lon_0=-120.5 +lat_1=47.3333333333333 +lat_2=45.8333333333333 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6599",
    "name": "NAD83(2011) / Washington South (ftUS)",
    "proj4": "+proj=lcc +lat_0=45.3333333333333 +lon_0=-120.5 +lat_1=47.3333333333333 +lat_2=45.8333333333333 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6600",
    "name": "NAD83(2011) / West Virginia North",
    "proj4": "+proj=lcc +lat_0=38.5 +lon_0=-79.5 +lat_1=40.25 +lat_2=39 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6601",
    "name": "NAD83(2011) / West Virginia North (ftUS)",
    "proj4": "+proj=lcc +lat_0=38.5 +lon_0=-79.5 +lat_1=40.25 +lat_2=39 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6602",
    "name": "NAD83(2011) / West Virginia South",
    "proj4": "+proj=lcc +lat_0=37 +lon_0=-81 +lat_1=38.8833333333333 +lat_2=37.4833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6603",
    "name": "NAD83(2011) / West Virginia South (ftUS)",
    "proj4": "+proj=lcc +lat_0=37 +lon_0=-81 +lat_1=38.8833333333333 +lat_2=37.4833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6879",
    "name": "NAD83(2011) / Wisconsin Central",
    "proj4": "+proj=lcc +lat_0=43.8333333333333 +lon_0=-90 +lat_1=45.5 +lat_2=44.25 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6605",
    "name": "NAD83(2011) / Wisconsin Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=43.8333333333333 +lon_0=-90 +lat_1=45.5 +lat_2=44.25 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6606",
    "name": "NAD83(2011) / Wisconsin North",
    "proj4": "+proj=lcc +lat_0=45.1666666666667 +lon_0=-90 +lat_1=46.7666666666667 +lat_2=45.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6607",
    "name": "NAD83(2011) / Wisconsin North (ftUS)",
    "proj4": "+proj=lcc +lat_0=45.1666666666667 +lon_0=-90 +lat_1=46.7666666666667 +lat_2=45.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6608",
    "name": "NAD83(2011) / Wisconsin South",
    "proj4": "+proj=lcc +lat_0=42 +lon_0=-90 +lat_1=44.0666666666667 +lat_2=42.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6609",
    "name": "NAD83(2011) / Wisconsin South (ftUS)",
    "proj4": "+proj=lcc +lat_0=42 +lon_0=-90 +lat_1=44.0666666666667 +lat_2=42.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6611",
    "name": "NAD83(2011) / Wyoming East",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-105.166666666667 +k=0.9999375 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6612",
    "name": "NAD83(2011) / Wyoming East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-105.166666666667 +k=0.9999375 +x_0=200000.00001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6613",
    "name": "NAD83(2011) / Wyoming East Central",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-107.333333333333 +k=0.9999375 +x_0=400000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6614",
    "name": "NAD83(2011) / Wyoming East Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-107.333333333333 +k=0.9999375 +x_0=399999.99998984 +y_0=99999.9999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6615",
    "name": "NAD83(2011) / Wyoming West",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-110.083333333333 +k=0.9999375 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6616",
    "name": "NAD83(2011) / Wyoming West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-110.083333333333 +k=0.9999375 +x_0=800000.00001016 +y_0=99999.9999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6617",
    "name": "NAD83(2011) / Wyoming West Central",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-108.75 +k=0.9999375 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6618",
    "name": "NAD83(2011) / Wyoming West Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-108.75 +k=0.9999375 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6785",
    "name": "NAD83(CORS96) / Oregon Baker zone (ft)",
    "proj4": "+proj=tmerc +lat_0=44.5 +lon_0=-117.833333333333 +k=1.00016 +x_0=39999.99999984 +y_0=0 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6784",
    "name": "NAD83(CORS96) / Oregon Baker zone (m)",
    "proj4": "+proj=tmerc +lat_0=44.5 +lon_0=-117.833333333333 +k=1.00016 +x_0=40000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6797",
    "name": "NAD83(CORS96) / Oregon Bend-Burns zone (ft)",
    "proj4": "+proj=lcc +lat_1=43.6666666666667 +lat_0=43.6666666666667 +lon_0=-119.75 +k_0=1.0002 +x_0=119999.99999952 +y_0=59999.99999976 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6796",
    "name": "NAD83(CORS96) / Oregon Bend-Burns zone (m)",
    "proj4": "+proj=lcc +lat_1=43.6666666666667 +lat_0=43.6666666666667 +lon_0=-119.75 +k_0=1.0002 +x_0=120000 +y_0=60000 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6789",
    "name": "NAD83(CORS96) / Oregon Bend-Klamath Falls zone (ft)",
    "proj4": "+proj=tmerc +lat_0=41.75 +lon_0=-121.75 +k=1.0002 +x_0=79999.99999968 +y_0=0 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6788",
    "name": "NAD83(CORS96) / Oregon Bend-Klamath Falls zone (m)",
    "proj4": "+proj=tmerc +lat_0=41.75 +lon_0=-121.75 +k=1.0002 +x_0=80000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6793",
    "name": "NAD83(CORS96) / Oregon Bend-Redmond-Prineville zone (ft)",
    "proj4": "+proj=lcc +lat_1=44.6666666666667 +lat_0=44.6666666666667 +lon_0=-121.25 +k_0=1.00012 +x_0=79999.99999968 +y_0=130000.00001472 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6792",
    "name": "NAD83(CORS96) / Oregon Bend-Redmond-Prineville zone (m)",
    "proj4": "+proj=lcc +lat_1=44.6666666666667 +lat_0=44.6666666666667 +lon_0=-121.25 +k_0=1.00012 +x_0=80000 +y_0=130000 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6801",
    "name": "NAD83(CORS96) / Oregon Canyonville-Grants Pass zone (ft)",
    "proj4": "+proj=tmerc +lat_0=42.5 +lon_0=-123.333333333333 +k=1.00007 +x_0=39999.99999984 +y_0=0 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6800",
    "name": "NAD83(CORS96) / Oregon Canyonville-Grants Pass zone (m)",
    "proj4": "+proj=tmerc +lat_0=42.5 +lon_0=-123.333333333333 +k=1.00007 +x_0=40000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6841",
    "name": "NAD83(CORS96) / Oregon Coast zone (ft)",
    "proj4": "+proj=omerc +no_uoff +lat_0=44.75 +lonc=-124.05 +alpha=5 +gamma=5 +k=1 +x_0=-299999.9999988 +y_0=-4600000.00001208 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6840",
    "name": "NAD83(CORS96) / Oregon Coast zone (m)",
    "proj4": "+proj=omerc +no_uoff +lat_0=44.75 +lonc=-124.05 +alpha=5 +gamma=5 +k=1 +x_0=-300000 +y_0=-4600000 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6805",
    "name": "NAD83(CORS96) / Oregon Columbia River East zone (ft)",
    "proj4": "+proj=lcc +lat_1=45.6666666666667 +lat_0=45.6666666666667 +lon_0=-120.5 +k_0=1.000008 +x_0=150000.00001464 +y_0=30000.00001512 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6804",
    "name": "NAD83(CORS96) / Oregon Columbia River East zone (m)",
    "proj4": "+proj=lcc +lat_1=45.6666666666667 +lat_0=45.6666666666667 +lon_0=-120.5 +k_0=1.000008 +x_0=150000 +y_0=30000 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6809",
    "name": "NAD83(CORS96) / Oregon Columbia River West zone (ft)",
    "proj4": "+proj=omerc +no_uoff +lat_0=45.9166666666667 +lonc=-123 +alpha=295 +gamma=295 +k=1 +x_0=7000000.00000248 +y_0=-2999999.999988 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6808",
    "name": "NAD83(CORS96) / Oregon Columbia River West zone (m)",
    "proj4": "+proj=omerc +no_uoff +lat_0=45.9166666666667 +lonc=-123 +alpha=295 +gamma=295 +k=1 +x_0=7000000 +y_0=-3000000 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6813",
    "name": "NAD83(CORS96) / Oregon Cottage Grove-Canyonville zone (ft)",
    "proj4": "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-123.333333333333 +k=1.000023 +x_0=50000.00001504 +y_0=0 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6812",
    "name": "NAD83(CORS96) / Oregon Cottage Grove-Canyonville zone (m)",
    "proj4": "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-123.333333333333 +k=1.000023 +x_0=50000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6817",
    "name": "NAD83(CORS96) / Oregon Dufur-Madras zone (ft)",
    "proj4": "+proj=tmerc +lat_0=44.5 +lon_0=-121 +k=1.00011 +x_0=79999.99999968 +y_0=0 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6816",
    "name": "NAD83(CORS96) / Oregon Dufur-Madras zone (m)",
    "proj4": "+proj=tmerc +lat_0=44.5 +lon_0=-121 +k=1.00011 +x_0=80000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6821",
    "name": "NAD83(CORS96) / Oregon Eugene zone (ft)",
    "proj4": "+proj=tmerc +lat_0=43.75 +lon_0=-123.166666666667 +k=1.000015 +x_0=50000.00001504 +y_0=0 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6820",
    "name": "NAD83(CORS96) / Oregon Eugene zone (m)",
    "proj4": "+proj=tmerc +lat_0=43.75 +lon_0=-123.166666666667 +k=1.000015 +x_0=50000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6825",
    "name": "NAD83(CORS96) / Oregon Grants Pass-Ashland zone (ft)",
    "proj4": "+proj=tmerc +lat_0=41.75 +lon_0=-123.333333333333 +k=1.000043 +x_0=50000.00001504 +y_0=0 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6824",
    "name": "NAD83(CORS96) / Oregon Grants Pass-Ashland zone (m)",
    "proj4": "+proj=tmerc +lat_0=41.75 +lon_0=-123.333333333333 +k=1.000043 +x_0=50000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6829",
    "name": "NAD83(CORS96) / Oregon Gresham-Warm Springs zone (ft)",
    "proj4": "+proj=tmerc +lat_0=45 +lon_0=-122.333333333333 +k=1.00005 +x_0=10000.0000152 +y_0=0 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6828",
    "name": "NAD83(CORS96) / Oregon Gresham-Warm Springs zone (m)",
    "proj4": "+proj=tmerc +lat_0=45 +lon_0=-122.333333333333 +k=1.00005 +x_0=10000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6833",
    "name": "NAD83(CORS96) / Oregon La Grande zone (ft)",
    "proj4": "+proj=tmerc +lat_0=45 +lon_0=-118 +k=1.00013 +x_0=39999.99999984 +y_0=0 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6832",
    "name": "NAD83(CORS96) / Oregon La Grande zone (m)",
    "proj4": "+proj=tmerc +lat_0=45 +lon_0=-118 +k=1.00013 +x_0=40000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6884",
    "name": "NAD83(CORS96) / Oregon North",
    "proj4": "+proj=lcc +lat_0=43.6666666666667 +lon_0=-120.5 +lat_1=46 +lat_2=44.3333333333333 +x_0=2500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6885",
    "name": "NAD83(CORS96) / Oregon North (ft)",
    "proj4": "+proj=lcc +lat_0=43.6666666666667 +lon_0=-120.5 +lat_1=46 +lat_2=44.3333333333333 +x_0=2500000.0001424 +y_0=0 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6837",
    "name": "NAD83(CORS96) / Oregon Ontario zone (ft)",
    "proj4": "+proj=tmerc +lat_0=43.25 +lon_0=-117 +k=1.0001 +x_0=79999.99999968 +y_0=0 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6836",
    "name": "NAD83(CORS96) / Oregon Ontario zone (m)",
    "proj4": "+proj=tmerc +lat_0=43.25 +lon_0=-117 +k=1.0001 +x_0=80000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6845",
    "name": "NAD83(CORS96) / Oregon Pendleton zone (ft)",
    "proj4": "+proj=tmerc +lat_0=45.25 +lon_0=-119.166666666667 +k=1.000045 +x_0=59999.99999976 +y_0=0 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6844",
    "name": "NAD83(CORS96) / Oregon Pendleton zone (m)",
    "proj4": "+proj=tmerc +lat_0=45.25 +lon_0=-119.166666666667 +k=1.000045 +x_0=60000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6849",
    "name": "NAD83(CORS96) / Oregon Pendleton-La Grande zone (ft)",
    "proj4": "+proj=tmerc +lat_0=45.0833333333333 +lon_0=-118.333333333333 +k=1.000175 +x_0=30000.00001512 +y_0=0 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6848",
    "name": "NAD83(CORS96) / Oregon Pendleton-La Grande zone (m)",
    "proj4": "+proj=tmerc +lat_0=45.0833333333333 +lon_0=-118.333333333333 +k=1.000175 +x_0=30000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6853",
    "name": "NAD83(CORS96) / Oregon Portland zone (ft)",
    "proj4": "+proj=lcc +lat_1=45.5 +lat_0=45.5 +lon_0=-122.75 +k_0=1.000002 +x_0=99999.9999996 +y_0=50000.00001504 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6852",
    "name": "NAD83(CORS96) / Oregon Portland zone (m)",
    "proj4": "+proj=lcc +lat_1=45.5 +lat_0=45.5 +lon_0=-122.75 +k_0=1.000002 +x_0=100000 +y_0=50000 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6857",
    "name": "NAD83(CORS96) / Oregon Salem zone (ft)",
    "proj4": "+proj=tmerc +lat_0=44.3333333333333 +lon_0=-123.083333333333 +k=1.00001 +x_0=50000.00001504 +y_0=0 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6856",
    "name": "NAD83(CORS96) / Oregon Salem zone (m)",
    "proj4": "+proj=tmerc +lat_0=44.3333333333333 +lon_0=-123.083333333333 +k=1.00001 +x_0=50000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6861",
    "name": "NAD83(CORS96) / Oregon Santiam Pass zone (ft)",
    "proj4": "+proj=tmerc +lat_0=44.0833333333333 +lon_0=-122.5 +k=1.000155 +x_0=0 +y_0=0 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6860",
    "name": "NAD83(CORS96) / Oregon Santiam Pass zone (m)",
    "proj4": "+proj=tmerc +lat_0=44.0833333333333 +lon_0=-122.5 +k=1.000155 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6886",
    "name": "NAD83(CORS96) / Oregon South",
    "proj4": "+proj=lcc +lat_0=41.6666666666667 +lon_0=-120.5 +lat_1=44 +lat_2=42.3333333333333 +x_0=1500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6887",
    "name": "NAD83(CORS96) / Oregon South (ft)",
    "proj4": "+proj=lcc +lat_0=41.6666666666667 +lon_0=-120.5 +lat_1=44 +lat_2=42.3333333333333 +x_0=1500000.0001464 +y_0=0 +ellps=GRS80 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2759",
    "name": "NAD83(HARN) / Alabama East",
    "proj4": "+proj=tmerc +lat_0=30.5 +lon_0=-85.8333333333333 +k=0.99996 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2760",
    "name": "NAD83(HARN) / Alabama West",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-87.5 +k=0.999933333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2762",
    "name": "NAD83(HARN) / Arizona Central",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-111.916666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2868",
    "name": "NAD83(HARN) / Arizona Central (ft)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-111.916666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2761",
    "name": "NAD83(HARN) / Arizona East",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-110.166666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2867",
    "name": "NAD83(HARN) / Arizona East (ft)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-110.166666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2763",
    "name": "NAD83(HARN) / Arizona West",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2869",
    "name": "NAD83(HARN) / Arizona West (ft)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2764",
    "name": "NAD83(HARN) / Arkansas North",
    "proj4": "+proj=lcc +lat_0=34.3333333333333 +lon_0=-92 +lat_1=36.2333333333333 +lat_2=34.9333333333333 +x_0=400000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3441",
    "name": "NAD83(HARN) / Arkansas North (ftUS)",
    "proj4": "+proj=lcc +lat_0=34.3333333333333 +lon_0=-92 +lat_1=36.2333333333333 +lat_2=34.9333333333333 +x_0=399999.99998984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2765",
    "name": "NAD83(HARN) / Arkansas South",
    "proj4": "+proj=lcc +lat_0=32.6666666666667 +lon_0=-92 +lat_1=34.7666666666667 +lat_2=33.3 +x_0=400000 +y_0=400000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3442",
    "name": "NAD83(HARN) / Arkansas South (ftUS)",
    "proj4": "+proj=lcc +lat_0=32.6666666666667 +lon_0=-92 +lat_1=34.7666666666667 +lat_2=33.3 +x_0=399999.99998984 +y_0=399999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2766",
    "name": "NAD83(HARN) / California zone 1",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-122 +lat_1=41.6666666666667 +lat_2=40 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2870",
    "name": "NAD83(HARN) / California zone 1 (ftUS)",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-122 +lat_1=41.6666666666667 +lat_2=40 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2767",
    "name": "NAD83(HARN) / California zone 2",
    "proj4": "+proj=lcc +lat_0=37.6666666666667 +lon_0=-122 +lat_1=39.8333333333333 +lat_2=38.3333333333333 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2871",
    "name": "NAD83(HARN) / California zone 2 (ftUS)",
    "proj4": "+proj=lcc +lat_0=37.6666666666667 +lon_0=-122 +lat_1=39.8333333333333 +lat_2=38.3333333333333 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2768",
    "name": "NAD83(HARN) / California zone 3",
    "proj4": "+proj=lcc +lat_0=36.5 +lon_0=-120.5 +lat_1=38.4333333333333 +lat_2=37.0666666666667 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2872",
    "name": "NAD83(HARN) / California zone 3 (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.5 +lon_0=-120.5 +lat_1=38.4333333333333 +lat_2=37.0666666666667 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2769",
    "name": "NAD83(HARN) / California zone 4",
    "proj4": "+proj=lcc +lat_0=35.3333333333333 +lon_0=-119 +lat_1=37.25 +lat_2=36 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2873",
    "name": "NAD83(HARN) / California zone 4 (ftUS)",
    "proj4": "+proj=lcc +lat_0=35.3333333333333 +lon_0=-119 +lat_1=37.25 +lat_2=36 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2770",
    "name": "NAD83(HARN) / California zone 5",
    "proj4": "+proj=lcc +lat_0=33.5 +lon_0=-118 +lat_1=35.4666666666667 +lat_2=34.0333333333333 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2874",
    "name": "NAD83(HARN) / California zone 5 (ftUS)",
    "proj4": "+proj=lcc +lat_0=33.5 +lon_0=-118 +lat_1=35.4666666666667 +lat_2=34.0333333333333 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2771",
    "name": "NAD83(HARN) / California zone 6",
    "proj4": "+proj=lcc +lat_0=32.1666666666667 +lon_0=-116.25 +lat_1=33.8833333333333 +lat_2=32.7833333333333 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2875",
    "name": "NAD83(HARN) / California zone 6 (ftUS)",
    "proj4": "+proj=lcc +lat_0=32.1666666666667 +lon_0=-116.25 +lat_1=33.8833333333333 +lat_2=32.7833333333333 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2773",
    "name": "NAD83(HARN) / Colorado Central",
    "proj4": "+proj=lcc +lat_0=37.8333333333333 +lon_0=-105.5 +lat_1=39.75 +lat_2=38.45 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2877",
    "name": "NAD83(HARN) / Colorado Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=37.8333333333333 +lon_0=-105.5 +lat_1=39.75 +lat_2=38.45 +x_0=914401.828803657 +y_0=304800.609601219 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2772",
    "name": "NAD83(HARN) / Colorado North",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-105.5 +lat_1=40.7833333333333 +lat_2=39.7166666666667 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2876",
    "name": "NAD83(HARN) / Colorado North (ftUS)",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-105.5 +lat_1=40.7833333333333 +lat_2=39.7166666666667 +x_0=914401.828803657 +y_0=304800.609601219 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2774",
    "name": "NAD83(HARN) / Colorado South",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-105.5 +lat_1=38.4333333333333 +lat_2=37.2333333333333 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2878",
    "name": "NAD83(HARN) / Colorado South (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-105.5 +lat_1=38.4333333333333 +lat_2=37.2333333333333 +x_0=914401.828803657 +y_0=304800.609601219 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2777",
    "name": "NAD83(HARN) / Florida East",
    "proj4": "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2881",
    "name": "NAD83(HARN) / Florida East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2779",
    "name": "NAD83(HARN) / Florida North",
    "proj4": "+proj=lcc +lat_0=29 +lon_0=-84.5 +lat_1=30.75 +lat_2=29.5833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2883",
    "name": "NAD83(HARN) / Florida North (ftUS)",
    "proj4": "+proj=lcc +lat_0=29 +lon_0=-84.5 +lat_1=30.75 +lat_2=29.5833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2778",
    "name": "NAD83(HARN) / Florida West",
    "proj4": "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2882",
    "name": "NAD83(HARN) / Florida West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2780",
    "name": "NAD83(HARN) / Georgia East",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-82.1666666666667 +k=0.9999 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2884",
    "name": "NAD83(HARN) / Georgia East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-82.1666666666667 +k=0.9999 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2781",
    "name": "NAD83(HARN) / Georgia West",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-84.1666666666667 +k=0.9999 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2885",
    "name": "NAD83(HARN) / Georgia West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-84.1666666666667 +k=0.9999 +x_0=699999.999898399 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2782",
    "name": "NAD83(HARN) / Hawaii zone 1",
    "proj4": "+proj=tmerc +lat_0=18.8333333333333 +lon_0=-155.5 +k=0.999966667 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2783",
    "name": "NAD83(HARN) / Hawaii zone 2",
    "proj4": "+proj=tmerc +lat_0=20.3333333333333 +lon_0=-156.666666666667 +k=0.999966667 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2784",
    "name": "NAD83(HARN) / Hawaii zone 3",
    "proj4": "+proj=tmerc +lat_0=21.1666666666667 +lon_0=-158 +k=0.99999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3760",
    "name": "NAD83(HARN) / Hawaii zone 3 (ftUS)",
    "proj4": "+proj=tmerc +lat_0=21.1666666666667 +lon_0=-158 +k=0.99999 +x_0=500000.00001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2785",
    "name": "NAD83(HARN) / Hawaii zone 4",
    "proj4": "+proj=tmerc +lat_0=21.8333333333333 +lon_0=-159.5 +k=0.99999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2786",
    "name": "NAD83(HARN) / Hawaii zone 5",
    "proj4": "+proj=tmerc +lat_0=21.6666666666667 +lon_0=-160.166666666667 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2788",
    "name": "NAD83(HARN) / Idaho Central",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-114 +k=0.999947368 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2887",
    "name": "NAD83(HARN) / Idaho Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-114 +k=0.999947368 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2787",
    "name": "NAD83(HARN) / Idaho East",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-112.166666666667 +k=0.999947368 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2886",
    "name": "NAD83(HARN) / Idaho East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-112.166666666667 +k=0.999947368 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2789",
    "name": "NAD83(HARN) / Idaho West",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-115.75 +k=0.999933333 +x_0=800000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2888",
    "name": "NAD83(HARN) / Idaho West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-115.75 +k=0.999933333 +x_0=800000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2790",
    "name": "NAD83(HARN) / Illinois East",
    "proj4": "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-88.3333333333333 +k=0.999975 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3443",
    "name": "NAD83(HARN) / Illinois East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-88.3333333333333 +k=0.999975 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2791",
    "name": "NAD83(HARN) / Illinois West",
    "proj4": "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-90.1666666666667 +k=0.999941177 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3444",
    "name": "NAD83(HARN) / Illinois West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-90.1666666666667 +k=0.999941177 +x_0=699999.99998984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2792",
    "name": "NAD83(HARN) / Indiana East",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-85.6666666666667 +k=0.999966667 +x_0=100000 +y_0=250000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2967",
    "name": "NAD83(HARN) / Indiana East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-85.6666666666667 +k=0.999966667 +x_0=99999.9998983997 +y_0=249999.9998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2793",
    "name": "NAD83(HARN) / Indiana West",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-87.0833333333333 +k=0.999966667 +x_0=900000 +y_0=250000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2968",
    "name": "NAD83(HARN) / Indiana West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-87.0833333333333 +k=0.999966667 +x_0=900000 +y_0=249999.9998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2794",
    "name": "NAD83(HARN) / Iowa North",
    "proj4": "+proj=lcc +lat_0=41.5 +lon_0=-93.5 +lat_1=43.2666666666667 +lat_2=42.0666666666667 +x_0=1500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3425",
    "name": "NAD83(HARN) / Iowa North (ftUS)",
    "proj4": "+proj=lcc +lat_0=41.5 +lon_0=-93.5 +lat_1=43.2666666666667 +lat_2=42.0666666666667 +x_0=1500000 +y_0=999999.999989839 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2795",
    "name": "NAD83(HARN) / Iowa South",
    "proj4": "+proj=lcc +lat_0=40 +lon_0=-93.5 +lat_1=41.7833333333333 +lat_2=40.6166666666667 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3426",
    "name": "NAD83(HARN) / Iowa South (ftUS)",
    "proj4": "+proj=lcc +lat_0=40 +lon_0=-93.5 +lat_1=41.7833333333333 +lat_2=40.6166666666667 +x_0=500000.00001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2796",
    "name": "NAD83(HARN) / Kansas North",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-98 +lat_1=39.7833333333333 +lat_2=38.7166666666667 +x_0=400000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3427",
    "name": "NAD83(HARN) / Kansas North (ftUS)",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-98 +lat_1=39.7833333333333 +lat_2=38.7166666666667 +x_0=399999.99998984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2797",
    "name": "NAD83(HARN) / Kansas South",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-98.5 +lat_1=38.5666666666667 +lat_2=37.2666666666667 +x_0=400000 +y_0=400000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3428",
    "name": "NAD83(HARN) / Kansas South (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-98.5 +lat_1=38.5666666666667 +lat_2=37.2666666666667 +x_0=399999.99998984 +y_0=399999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2798",
    "name": "NAD83(HARN) / Kentucky North",
    "proj4": "+proj=lcc +lat_0=37.5 +lon_0=-84.25 +lat_1=37.9666666666667 +lat_2=38.9666666666667 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2891",
    "name": "NAD83(HARN) / Kentucky North (ftUS)",
    "proj4": "+proj=lcc +lat_0=37.5 +lon_0=-84.25 +lat_1=37.9666666666667 +lat_2=38.9666666666667 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3090",
    "name": "NAD83(HARN) / Kentucky Single Zone",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.0833333333333 +lat_2=38.6666666666667 +x_0=1500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3091",
    "name": "NAD83(HARN) / Kentucky Single Zone (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.0833333333333 +lat_2=38.6666666666667 +x_0=1500000 +y_0=999999.999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2799",
    "name": "NAD83(HARN) / Kentucky South",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.9333333333333 +lat_2=36.7333333333333 +x_0=500000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2892",
    "name": "NAD83(HARN) / Kentucky South (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.9333333333333 +lat_2=36.7333333333333 +x_0=500000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2800",
    "name": "NAD83(HARN) / Louisiana North",
    "proj4": "+proj=lcc +lat_0=30.5 +lon_0=-92.5 +lat_1=32.6666666666667 +lat_2=31.1666666666667 +x_0=1000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3456",
    "name": "NAD83(HARN) / Louisiana North (ftUS)",
    "proj4": "+proj=lcc +lat_0=30.5 +lon_0=-92.5 +lat_1=32.6666666666667 +lat_2=31.1666666666667 +x_0=999999.999989839 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2801",
    "name": "NAD83(HARN) / Louisiana South",
    "proj4": "+proj=lcc +lat_0=28.5 +lon_0=-91.3333333333333 +lat_1=30.7 +lat_2=29.3 +x_0=1000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3457",
    "name": "NAD83(HARN) / Louisiana South (ftUS)",
    "proj4": "+proj=lcc +lat_0=28.5 +lon_0=-91.3333333333333 +lat_1=30.7 +lat_2=29.3 +x_0=999999.999989839 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3464",
    "name": "NAD83(HARN) / Maine CS2000 Central",
    "proj4": "+proj=tmerc +lat_0=43.5 +lon_0=-69.125 +k=0.99998 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3075",
    "name": "NAD83(HARN) / Maine CS2000 East",
    "proj4": "+proj=tmerc +lat_0=43.8333333333333 +lon_0=-67.875 +k=0.99998 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3077",
    "name": "NAD83(HARN) / Maine CS2000 West",
    "proj4": "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-70.375 +k=0.99998 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2802",
    "name": "NAD83(HARN) / Maine East",
    "proj4": "+proj=tmerc +lat_0=43.6666666666667 +lon_0=-68.5 +k=0.9999 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26855",
    "name": "NAD83(HARN) / Maine East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=43.6666666666667 +lon_0=-68.5 +k=0.9999 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2803",
    "name": "NAD83(HARN) / Maine West",
    "proj4": "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-70.1666666666667 +k=0.999966667 +x_0=900000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26856",
    "name": "NAD83(HARN) / Maine West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-70.1666666666667 +k=0.999966667 +x_0=900000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2808",
    "name": "NAD83(HARN) / Michigan Central",
    "proj4": "+proj=lcc +lat_0=43.3166666666667 +lon_0=-84.3666666666667 +lat_1=45.7 +lat_2=44.1833333333333 +x_0=6000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2897",
    "name": "NAD83(HARN) / Michigan Central (ft)",
    "proj4": "+proj=lcc +lat_0=43.3166666666667 +lon_0=-84.3666666666667 +lat_1=45.7 +lat_2=44.1833333333333 +x_0=5999999.999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2807",
    "name": "NAD83(HARN) / Michigan North",
    "proj4": "+proj=lcc +lat_0=44.7833333333333 +lon_0=-87 +lat_1=47.0833333333333 +lat_2=45.4833333333333 +x_0=8000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2896",
    "name": "NAD83(HARN) / Michigan North (ft)",
    "proj4": "+proj=lcc +lat_0=44.7833333333333 +lon_0=-87 +lat_1=47.0833333333333 +lat_2=45.4833333333333 +x_0=7999999.999968 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2809",
    "name": "NAD83(HARN) / Michigan South",
    "proj4": "+proj=lcc +lat_0=41.5 +lon_0=-84.3666666666667 +lat_1=43.6666666666667 +lat_2=42.1 +x_0=4000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2898",
    "name": "NAD83(HARN) / Michigan South (ft)",
    "proj4": "+proj=lcc +lat_0=41.5 +lon_0=-84.3666666666667 +lat_1=43.6666666666667 +lat_2=42.1 +x_0=3999999.999984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2811",
    "name": "NAD83(HARN) / Minnesota Central",
    "proj4": "+proj=lcc +lat_0=45 +lon_0=-94.25 +lat_1=47.05 +lat_2=45.6166666666667 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26858",
    "name": "NAD83(HARN) / Minnesota Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=45 +lon_0=-94.25 +lat_1=47.05 +lat_2=45.6166666666667 +x_0=800000.00001016 +y_0=99999.9999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2810",
    "name": "NAD83(HARN) / Minnesota North",
    "proj4": "+proj=lcc +lat_0=46.5 +lon_0=-93.1 +lat_1=48.6333333333333 +lat_2=47.0333333333333 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26857",
    "name": "NAD83(HARN) / Minnesota North (ftUS)",
    "proj4": "+proj=lcc +lat_0=46.5 +lon_0=-93.1 +lat_1=48.6333333333333 +lat_2=47.0333333333333 +x_0=800000.00001016 +y_0=99999.9999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2812",
    "name": "NAD83(HARN) / Minnesota South",
    "proj4": "+proj=lcc +lat_0=43 +lon_0=-94 +lat_1=45.2166666666667 +lat_2=43.7833333333333 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26859",
    "name": "NAD83(HARN) / Minnesota South (ftUS)",
    "proj4": "+proj=lcc +lat_0=43 +lon_0=-94 +lat_1=45.2166666666667 +lat_2=43.7833333333333 +x_0=800000.00001016 +y_0=99999.9999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2813",
    "name": "NAD83(HARN) / Mississippi East",
    "proj4": "+proj=tmerc +lat_0=29.5 +lon_0=-88.8333333333333 +k=0.99995 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2899",
    "name": "NAD83(HARN) / Mississippi East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=29.5 +lon_0=-88.8333333333333 +k=0.99995 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2814",
    "name": "NAD83(HARN) / Mississippi West",
    "proj4": "+proj=tmerc +lat_0=29.5 +lon_0=-90.3333333333333 +k=0.99995 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2900",
    "name": "NAD83(HARN) / Mississippi West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=29.5 +lon_0=-90.3333333333333 +k=0.99995 +x_0=699999.999898399 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2816",
    "name": "NAD83(HARN) / Missouri Central",
    "proj4": "+proj=tmerc +lat_0=35.8333333333333 +lon_0=-92.5 +k=0.999933333 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2815",
    "name": "NAD83(HARN) / Missouri East",
    "proj4": "+proj=tmerc +lat_0=35.8333333333333 +lon_0=-90.5 +k=0.999933333 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2817",
    "name": "NAD83(HARN) / Missouri West",
    "proj4": "+proj=tmerc +lat_0=36.1666666666667 +lon_0=-94.5 +k=0.999941177 +x_0=850000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2821",
    "name": "NAD83(HARN) / Nevada Central",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-116.666666666667 +k=0.9999 +x_0=500000 +y_0=6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3430",
    "name": "NAD83(HARN) / Nevada Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-116.666666666667 +k=0.9999 +x_0=500000.00001016 +y_0=6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2820",
    "name": "NAD83(HARN) / Nevada East",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-115.583333333333 +k=0.9999 +x_0=200000 +y_0=8000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3429",
    "name": "NAD83(HARN) / Nevada East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-115.583333333333 +k=0.9999 +x_0=200000.00001016 +y_0=8000000.00001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2822",
    "name": "NAD83(HARN) / Nevada West",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-118.583333333333 +k=0.9999 +x_0=800000 +y_0=4000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3431",
    "name": "NAD83(HARN) / Nevada West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-118.583333333333 +k=0.9999 +x_0=800000.00001016 +y_0=3999999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2826",
    "name": "NAD83(HARN) / New Mexico Central",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2903",
    "name": "NAD83(HARN) / New Mexico Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.9999 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2825",
    "name": "NAD83(HARN) / New Mexico East",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-104.333333333333 +k=0.999909091 +x_0=165000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2902",
    "name": "NAD83(HARN) / New Mexico East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-104.333333333333 +k=0.999909091 +x_0=165000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2827",
    "name": "NAD83(HARN) / New Mexico West",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-107.833333333333 +k=0.999916667 +x_0=830000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2904",
    "name": "NAD83(HARN) / New Mexico West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-107.833333333333 +k=0.999916667 +x_0=830000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2829",
    "name": "NAD83(HARN) / New York Central",
    "proj4": "+proj=tmerc +lat_0=40 +lon_0=-76.5833333333333 +k=0.9999375 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2906",
    "name": "NAD83(HARN) / New York Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40 +lon_0=-76.5833333333333 +k=0.9999375 +x_0=249999.9998984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2828",
    "name": "NAD83(HARN) / New York East",
    "proj4": "+proj=tmerc +lat_0=38.8333333333333 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2905",
    "name": "NAD83(HARN) / New York East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=38.8333333333333 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2830",
    "name": "NAD83(HARN) / New York West",
    "proj4": "+proj=tmerc +lat_0=40 +lon_0=-78.5833333333333 +k=0.9999375 +x_0=350000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2907",
    "name": "NAD83(HARN) / New York West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40 +lon_0=-78.5833333333333 +k=0.9999375 +x_0=350000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3358",
    "name": "NAD83(HARN) / North Carolina",
    "proj4": "+proj=lcc +lat_0=33.75 +lon_0=-79 +lat_1=36.1666666666667 +lat_2=34.3333333333333 +x_0=609601.22 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3404",
    "name": "NAD83(HARN) / North Carolina (ftUS)",
    "proj4": "+proj=lcc +lat_0=33.75 +lon_0=-79 +lat_1=36.1666666666667 +lat_2=34.3333333333333 +x_0=609601.219202438 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2832",
    "name": "NAD83(HARN) / North Dakota North",
    "proj4": "+proj=lcc +lat_0=47 +lon_0=-100.5 +lat_1=48.7333333333333 +lat_2=47.4333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2909",
    "name": "NAD83(HARN) / North Dakota North (ft)",
    "proj4": "+proj=lcc +lat_0=47 +lon_0=-100.5 +lat_1=48.7333333333333 +lat_2=47.4333333333333 +x_0=599999.9999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2833",
    "name": "NAD83(HARN) / North Dakota South",
    "proj4": "+proj=lcc +lat_0=45.6666666666667 +lon_0=-100.5 +lat_1=47.4833333333333 +lat_2=46.1833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2910",
    "name": "NAD83(HARN) / North Dakota South (ft)",
    "proj4": "+proj=lcc +lat_0=45.6666666666667 +lon_0=-100.5 +lat_1=47.4833333333333 +lat_2=46.1833333333333 +x_0=599999.9999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2834",
    "name": "NAD83(HARN) / Ohio North",
    "proj4": "+proj=lcc +lat_0=39.6666666666667 +lon_0=-82.5 +lat_1=41.7 +lat_2=40.4333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3753",
    "name": "NAD83(HARN) / Ohio North (ftUS)",
    "proj4": "+proj=lcc +lat_0=39.6666666666667 +lon_0=-82.5 +lat_1=41.7 +lat_2=40.4333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2835",
    "name": "NAD83(HARN) / Ohio South",
    "proj4": "+proj=lcc +lat_0=38 +lon_0=-82.5 +lat_1=40.0333333333333 +lat_2=38.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3754",
    "name": "NAD83(HARN) / Ohio South (ftUS)",
    "proj4": "+proj=lcc +lat_0=38 +lon_0=-82.5 +lat_1=40.0333333333333 +lat_2=38.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2836",
    "name": "NAD83(HARN) / Oklahoma North",
    "proj4": "+proj=lcc +lat_0=35 +lon_0=-98 +lat_1=36.7666666666667 +lat_2=35.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2911",
    "name": "NAD83(HARN) / Oklahoma North (ftUS)",
    "proj4": "+proj=lcc +lat_0=35 +lon_0=-98 +lat_1=36.7666666666667 +lat_2=35.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2837",
    "name": "NAD83(HARN) / Oklahoma South",
    "proj4": "+proj=lcc +lat_0=33.3333333333333 +lon_0=-98 +lat_1=35.2333333333333 +lat_2=33.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2912",
    "name": "NAD83(HARN) / Oklahoma South (ftUS)",
    "proj4": "+proj=lcc +lat_0=33.3333333333333 +lon_0=-98 +lat_1=35.2333333333333 +lat_2=33.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2838",
    "name": "NAD83(HARN) / Oregon North",
    "proj4": "+proj=lcc +lat_0=43.6666666666667 +lon_0=-120.5 +lat_1=46 +lat_2=44.3333333333333 +x_0=2500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2913",
    "name": "NAD83(HARN) / Oregon North (ft)",
    "proj4": "+proj=lcc +lat_0=43.6666666666667 +lon_0=-120.5 +lat_1=46 +lat_2=44.3333333333333 +x_0=2500000.0001424 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2839",
    "name": "NAD83(HARN) / Oregon South",
    "proj4": "+proj=lcc +lat_0=41.6666666666667 +lon_0=-120.5 +lat_1=44 +lat_2=42.3333333333333 +x_0=1500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2914",
    "name": "NAD83(HARN) / Oregon South (ft)",
    "proj4": "+proj=lcc +lat_0=41.6666666666667 +lon_0=-120.5 +lat_1=44 +lat_2=42.3333333333333 +x_0=1500000.0001464 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3362",
    "name": "NAD83(HARN) / Pennsylvania North",
    "proj4": "+proj=lcc +lat_0=40.1666666666667 +lon_0=-77.75 +lat_1=41.95 +lat_2=40.8833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3363",
    "name": "NAD83(HARN) / Pennsylvania North (ftUS)",
    "proj4": "+proj=lcc +lat_0=40.1666666666667 +lon_0=-77.75 +lat_1=41.95 +lat_2=40.8833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3364",
    "name": "NAD83(HARN) / Pennsylvania South",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-77.75 +lat_1=40.9666666666667 +lat_2=39.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3365",
    "name": "NAD83(HARN) / Pennsylvania South (ftUS)",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-77.75 +lat_1=40.9666666666667 +lat_2=39.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3360",
    "name": "NAD83(HARN) / South Carolina",
    "proj4": "+proj=lcc +lat_0=31.8333333333333 +lon_0=-81 +lat_1=34.8333333333333 +lat_2=32.5 +x_0=609600 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3361",
    "name": "NAD83(HARN) / South Carolina (ft)",
    "proj4": "+proj=lcc +lat_0=31.8333333333333 +lon_0=-81 +lat_1=34.8333333333333 +lat_2=32.5 +x_0=609600 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2841",
    "name": "NAD83(HARN) / South Dakota North",
    "proj4": "+proj=lcc +lat_0=43.8333333333333 +lon_0=-100 +lat_1=45.6833333333333 +lat_2=44.4166666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3458",
    "name": "NAD83(HARN) / South Dakota North (ftUS)",
    "proj4": "+proj=lcc +lat_0=43.8333333333333 +lon_0=-100 +lat_1=45.6833333333333 +lat_2=44.4166666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2842",
    "name": "NAD83(HARN) / South Dakota South",
    "proj4": "+proj=lcc +lat_0=42.3333333333333 +lon_0=-100.333333333333 +lat_1=44.4 +lat_2=42.8333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3459",
    "name": "NAD83(HARN) / South Dakota South (ftUS)",
    "proj4": "+proj=lcc +lat_0=42.3333333333333 +lon_0=-100.333333333333 +lat_1=44.4 +lat_2=42.8333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2846",
    "name": "NAD83(HARN) / Texas Central",
    "proj4": "+proj=lcc +lat_0=29.6666666666667 +lon_0=-100.333333333333 +lat_1=31.8833333333333 +lat_2=30.1166666666667 +x_0=700000 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2918",
    "name": "NAD83(HARN) / Texas Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=29.6666666666667 +lon_0=-100.333333333333 +lat_1=31.8833333333333 +lat_2=30.1166666666667 +x_0=699999.999898399 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2844",
    "name": "NAD83(HARN) / Texas North",
    "proj4": "+proj=lcc +lat_0=34 +lon_0=-101.5 +lat_1=36.1833333333333 +lat_2=34.65 +x_0=200000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2916",
    "name": "NAD83(HARN) / Texas North (ftUS)",
    "proj4": "+proj=lcc +lat_0=34 +lon_0=-101.5 +lat_1=36.1833333333333 +lat_2=34.65 +x_0=200000.0001016 +y_0=999999.999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2845",
    "name": "NAD83(HARN) / Texas North Central",
    "proj4": "+proj=lcc +lat_0=31.6666666666667 +lon_0=-98.5 +lat_1=33.9666666666667 +lat_2=32.1333333333333 +x_0=600000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2917",
    "name": "NAD83(HARN) / Texas North Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=31.6666666666667 +lon_0=-98.5 +lat_1=33.9666666666667 +lat_2=32.1333333333333 +x_0=600000 +y_0=2000000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2848",
    "name": "NAD83(HARN) / Texas South",
    "proj4": "+proj=lcc +lat_0=25.6666666666667 +lon_0=-98.5 +lat_1=27.8333333333333 +lat_2=26.1666666666667 +x_0=300000 +y_0=5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2920",
    "name": "NAD83(HARN) / Texas South (ftUS)",
    "proj4": "+proj=lcc +lat_0=25.6666666666667 +lon_0=-98.5 +lat_1=27.8333333333333 +lat_2=26.1666666666667 +x_0=300000 +y_0=5000000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2847",
    "name": "NAD83(HARN) / Texas South Central",
    "proj4": "+proj=lcc +lat_0=27.8333333333333 +lon_0=-99 +lat_1=30.2833333333333 +lat_2=28.3833333333333 +x_0=600000 +y_0=4000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2919",
    "name": "NAD83(HARN) / Texas South Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=27.8333333333333 +lon_0=-99 +lat_1=30.2833333333333 +lat_2=28.3833333333333 +x_0=600000 +y_0=3999999.9998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2850",
    "name": "NAD83(HARN) / Utah Central",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-111.5 +lat_1=40.65 +lat_2=39.0166666666667 +x_0=500000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2922",
    "name": "NAD83(HARN) / Utah Central (ft)",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-111.5 +lat_1=40.65 +lat_2=39.0166666666667 +x_0=500000.0001504 +y_0=1999999.999992 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3569",
    "name": "NAD83(HARN) / Utah Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-111.5 +lat_1=40.65 +lat_2=39.0166666666667 +x_0=500000.00001016 +y_0=2000000.00001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2849",
    "name": "NAD83(HARN) / Utah North",
    "proj4": "+proj=lcc +lat_0=40.3333333333333 +lon_0=-111.5 +lat_1=41.7833333333333 +lat_2=40.7166666666667 +x_0=500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2921",
    "name": "NAD83(HARN) / Utah North (ft)",
    "proj4": "+proj=lcc +lat_0=40.3333333333333 +lon_0=-111.5 +lat_1=41.7833333333333 +lat_2=40.7166666666667 +x_0=500000.0001504 +y_0=999999.999996 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3568",
    "name": "NAD83(HARN) / Utah North (ftUS)",
    "proj4": "+proj=lcc +lat_0=40.3333333333333 +lon_0=-111.5 +lat_1=41.7833333333333 +lat_2=40.7166666666667 +x_0=500000.00001016 +y_0=999999.999989839 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2851",
    "name": "NAD83(HARN) / Utah South",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-111.5 +lat_1=38.35 +lat_2=37.2166666666667 +x_0=500000 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2923",
    "name": "NAD83(HARN) / Utah South (ft)",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-111.5 +lat_1=38.35 +lat_2=37.2166666666667 +x_0=500000.0001504 +y_0=2999999.999988 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3570",
    "name": "NAD83(HARN) / Utah South (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-111.5 +lat_1=38.35 +lat_2=37.2166666666667 +x_0=500000.00001016 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2853",
    "name": "NAD83(HARN) / Virginia North",
    "proj4": "+proj=lcc +lat_0=37.6666666666667 +lon_0=-78.5 +lat_1=39.2 +lat_2=38.0333333333333 +x_0=3500000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2924",
    "name": "NAD83(HARN) / Virginia North (ftUS)",
    "proj4": "+proj=lcc +lat_0=37.6666666666667 +lon_0=-78.5 +lat_1=39.2 +lat_2=38.0333333333333 +x_0=3500000.0001016 +y_0=2000000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2854",
    "name": "NAD83(HARN) / Virginia South",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-78.5 +lat_1=37.9666666666667 +lat_2=36.7666666666667 +x_0=3500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2925",
    "name": "NAD83(HARN) / Virginia South (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-78.5 +lat_1=37.9666666666667 +lat_2=36.7666666666667 +x_0=3500000.0001016 +y_0=999999.999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2855",
    "name": "NAD83(HARN) / Washington North",
    "proj4": "+proj=lcc +lat_0=47 +lon_0=-120.833333333333 +lat_1=48.7333333333333 +lat_2=47.5 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2926",
    "name": "NAD83(HARN) / Washington North (ftUS)",
    "proj4": "+proj=lcc +lat_0=47 +lon_0=-120.833333333333 +lat_1=48.7333333333333 +lat_2=47.5 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2856",
    "name": "NAD83(HARN) / Washington South",
    "proj4": "+proj=lcc +lat_0=45.3333333333333 +lon_0=-120.5 +lat_1=47.3333333333333 +lat_2=45.8333333333333 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2927",
    "name": "NAD83(HARN) / Washington South (ftUS)",
    "proj4": "+proj=lcc +lat_0=45.3333333333333 +lon_0=-120.5 +lat_1=47.3333333333333 +lat_2=45.8333333333333 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2857",
    "name": "NAD83(HARN) / West Virginia North",
    "proj4": "+proj=lcc +lat_0=38.5 +lon_0=-79.5 +lat_1=40.25 +lat_2=39 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26861",
    "name": "NAD83(HARN) / West Virginia North (ftUS)",
    "proj4": "+proj=lcc +lat_0=38.5 +lon_0=-79.5 +lat_1=40.25 +lat_2=39 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2858",
    "name": "NAD83(HARN) / West Virginia South",
    "proj4": "+proj=lcc +lat_0=37 +lon_0=-81 +lat_1=38.8833333333333 +lat_2=37.4833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26862",
    "name": "NAD83(HARN) / West Virginia South (ftUS)",
    "proj4": "+proj=lcc +lat_0=37 +lon_0=-81 +lat_1=38.8833333333333 +lat_2=37.4833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2860",
    "name": "NAD83(HARN) / Wisconsin Central",
    "proj4": "+proj=lcc +lat_0=43.8333333333333 +lon_0=-90 +lat_1=45.5 +lat_2=44.25 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2929",
    "name": "NAD83(HARN) / Wisconsin Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=43.8333333333333 +lon_0=-90 +lat_1=45.5 +lat_2=44.25 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2859",
    "name": "NAD83(HARN) / Wisconsin North",
    "proj4": "+proj=lcc +lat_0=45.1666666666667 +lon_0=-90 +lat_1=46.7666666666667 +lat_2=45.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2928",
    "name": "NAD83(HARN) / Wisconsin North (ftUS)",
    "proj4": "+proj=lcc +lat_0=45.1666666666667 +lon_0=-90 +lat_1=46.7666666666667 +lat_2=45.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2861",
    "name": "NAD83(HARN) / Wisconsin South",
    "proj4": "+proj=lcc +lat_0=42 +lon_0=-90 +lat_1=44.0666666666667 +lat_2=42.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "2930",
    "name": "NAD83(HARN) / Wisconsin South (ftUS)",
    "proj4": "+proj=lcc +lat_0=42 +lon_0=-90 +lat_1=44.0666666666667 +lat_2=42.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2862",
    "name": "NAD83(HARN) / Wyoming East",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-105.166666666667 +k=0.9999375 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3755",
    "name": "NAD83(HARN) / Wyoming East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-105.166666666667 +k=0.9999375 +x_0=200000.00001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2863",
    "name": "NAD83(HARN) / Wyoming East Central",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-107.333333333333 +k=0.9999375 +x_0=400000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3756",
    "name": "NAD83(HARN) / Wyoming East Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-107.333333333333 +k=0.9999375 +x_0=399999.99998984 +y_0=99999.9999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2865",
    "name": "NAD83(HARN) / Wyoming West",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-110.083333333333 +k=0.9999375 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3758",
    "name": "NAD83(HARN) / Wyoming West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-110.083333333333 +k=0.9999375 +x_0=800000.00001016 +y_0=99999.9999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "2864",
    "name": "NAD83(HARN) / Wyoming West Central",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-108.75 +k=0.9999375 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3757",
    "name": "NAD83(HARN) / Wyoming West Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-108.75 +k=0.9999375 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3465",
    "name": "NAD83(NSRS2007) / Alabama East",
    "proj4": "+proj=tmerc +lat_0=30.5 +lon_0=-85.8333333333333 +k=0.99996 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3466",
    "name": "NAD83(NSRS2007) / Alabama West",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-87.5 +k=0.999933333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3468",
    "name": "NAD83(NSRS2007) / Alaska zone 1",
    "proj4": "+proj=omerc +no_uoff +lat_0=57 +lonc=-133.666666666667 +alpha=323.130102361111 +gamma=323.130102361111 +k=0.9999 +x_0=5000000 +y_0=-5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3477",
    "name": "NAD83(NSRS2007) / Alaska zone 10",
    "proj4": "+proj=lcc +lat_0=51 +lon_0=-176 +lat_1=53.8333333333333 +lat_2=51.8333333333333 +x_0=1000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3469",
    "name": "NAD83(NSRS2007) / Alaska zone 2",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-142 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3470",
    "name": "NAD83(NSRS2007) / Alaska zone 3",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-146 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3471",
    "name": "NAD83(NSRS2007) / Alaska zone 4",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-150 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3472",
    "name": "NAD83(NSRS2007) / Alaska zone 5",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-154 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3473",
    "name": "NAD83(NSRS2007) / Alaska zone 6",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-158 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3474",
    "name": "NAD83(NSRS2007) / Alaska zone 7",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-162 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3475",
    "name": "NAD83(NSRS2007) / Alaska zone 8",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-166 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3476",
    "name": "NAD83(NSRS2007) / Alaska zone 9",
    "proj4": "+proj=tmerc +lat_0=54 +lon_0=-170 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3478",
    "name": "NAD83(NSRS2007) / Arizona Central",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-111.916666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3479",
    "name": "NAD83(NSRS2007) / Arizona Central (ft)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-111.916666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3480",
    "name": "NAD83(NSRS2007) / Arizona East",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-110.166666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3481",
    "name": "NAD83(NSRS2007) / Arizona East (ft)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-110.166666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3482",
    "name": "NAD83(NSRS2007) / Arizona West",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3483",
    "name": "NAD83(NSRS2007) / Arizona West (ft)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3484",
    "name": "NAD83(NSRS2007) / Arkansas North",
    "proj4": "+proj=lcc +lat_0=34.3333333333333 +lon_0=-92 +lat_1=36.2333333333333 +lat_2=34.9333333333333 +x_0=400000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3485",
    "name": "NAD83(NSRS2007) / Arkansas North (ftUS)",
    "proj4": "+proj=lcc +lat_0=34.3333333333333 +lon_0=-92 +lat_1=36.2333333333333 +lat_2=34.9333333333333 +x_0=399999.99998984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3486",
    "name": "NAD83(NSRS2007) / Arkansas South",
    "proj4": "+proj=lcc +lat_0=32.6666666666667 +lon_0=-92 +lat_1=34.7666666666667 +lat_2=33.3 +x_0=400000 +y_0=400000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3487",
    "name": "NAD83(NSRS2007) / Arkansas South (ftUS)",
    "proj4": "+proj=lcc +lat_0=32.6666666666667 +lon_0=-92 +lat_1=34.7666666666667 +lat_2=33.3 +x_0=399999.99998984 +y_0=399999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3489",
    "name": "NAD83(NSRS2007) / California zone 1",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-122 +lat_1=41.6666666666667 +lat_2=40 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3490",
    "name": "NAD83(NSRS2007) / California zone 1 (ftUS)",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-122 +lat_1=41.6666666666667 +lat_2=40 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3491",
    "name": "NAD83(NSRS2007) / California zone 2",
    "proj4": "+proj=lcc +lat_0=37.6666666666667 +lon_0=-122 +lat_1=39.8333333333333 +lat_2=38.3333333333333 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3492",
    "name": "NAD83(NSRS2007) / California zone 2 (ftUS)",
    "proj4": "+proj=lcc +lat_0=37.6666666666667 +lon_0=-122 +lat_1=39.8333333333333 +lat_2=38.3333333333333 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3493",
    "name": "NAD83(NSRS2007) / California zone 3",
    "proj4": "+proj=lcc +lat_0=36.5 +lon_0=-120.5 +lat_1=38.4333333333333 +lat_2=37.0666666666667 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3494",
    "name": "NAD83(NSRS2007) / California zone 3 (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.5 +lon_0=-120.5 +lat_1=38.4333333333333 +lat_2=37.0666666666667 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3495",
    "name": "NAD83(NSRS2007) / California zone 4",
    "proj4": "+proj=lcc +lat_0=35.3333333333333 +lon_0=-119 +lat_1=37.25 +lat_2=36 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3496",
    "name": "NAD83(NSRS2007) / California zone 4 (ftUS)",
    "proj4": "+proj=lcc +lat_0=35.3333333333333 +lon_0=-119 +lat_1=37.25 +lat_2=36 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3497",
    "name": "NAD83(NSRS2007) / California zone 5",
    "proj4": "+proj=lcc +lat_0=33.5 +lon_0=-118 +lat_1=35.4666666666667 +lat_2=34.0333333333333 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3498",
    "name": "NAD83(NSRS2007) / California zone 5 (ftUS)",
    "proj4": "+proj=lcc +lat_0=33.5 +lon_0=-118 +lat_1=35.4666666666667 +lat_2=34.0333333333333 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3499",
    "name": "NAD83(NSRS2007) / California zone 6",
    "proj4": "+proj=lcc +lat_0=32.1666666666667 +lon_0=-116.25 +lat_1=33.8833333333333 +lat_2=32.7833333333333 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3500",
    "name": "NAD83(NSRS2007) / California zone 6 (ftUS)",
    "proj4": "+proj=lcc +lat_0=32.1666666666667 +lon_0=-116.25 +lat_1=33.8833333333333 +lat_2=32.7833333333333 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3501",
    "name": "NAD83(NSRS2007) / Colorado Central",
    "proj4": "+proj=lcc +lat_0=37.8333333333333 +lon_0=-105.5 +lat_1=39.75 +lat_2=38.45 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3502",
    "name": "NAD83(NSRS2007) / Colorado Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=37.8333333333333 +lon_0=-105.5 +lat_1=39.75 +lat_2=38.45 +x_0=914401.828803657 +y_0=304800.609601219 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3503",
    "name": "NAD83(NSRS2007) / Colorado North",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-105.5 +lat_1=40.7833333333333 +lat_2=39.7166666666667 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3504",
    "name": "NAD83(NSRS2007) / Colorado North (ftUS)",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-105.5 +lat_1=40.7833333333333 +lat_2=39.7166666666667 +x_0=914401.828803657 +y_0=304800.609601219 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3505",
    "name": "NAD83(NSRS2007) / Colorado South",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-105.5 +lat_1=38.4333333333333 +lat_2=37.2333333333333 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3506",
    "name": "NAD83(NSRS2007) / Colorado South (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-105.5 +lat_1=38.4333333333333 +lat_2=37.2333333333333 +x_0=914401.828803657 +y_0=304800.609601219 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3511",
    "name": "NAD83(NSRS2007) / Florida East",
    "proj4": "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3512",
    "name": "NAD83(NSRS2007) / Florida East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3514",
    "name": "NAD83(NSRS2007) / Florida North",
    "proj4": "+proj=lcc +lat_0=29 +lon_0=-84.5 +lat_1=30.75 +lat_2=29.5833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3515",
    "name": "NAD83(NSRS2007) / Florida North (ftUS)",
    "proj4": "+proj=lcc +lat_0=29 +lon_0=-84.5 +lat_1=30.75 +lat_2=29.5833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3516",
    "name": "NAD83(NSRS2007) / Florida West",
    "proj4": "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3517",
    "name": "NAD83(NSRS2007) / Florida West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3518",
    "name": "NAD83(NSRS2007) / Georgia East",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-82.1666666666667 +k=0.9999 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3519",
    "name": "NAD83(NSRS2007) / Georgia East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-82.1666666666667 +k=0.9999 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3520",
    "name": "NAD83(NSRS2007) / Georgia West",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-84.1666666666667 +k=0.9999 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3521",
    "name": "NAD83(NSRS2007) / Georgia West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=30 +lon_0=-84.1666666666667 +k=0.9999 +x_0=699999.999898399 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3522",
    "name": "NAD83(NSRS2007) / Idaho Central",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-114 +k=0.999947368 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3523",
    "name": "NAD83(NSRS2007) / Idaho Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-114 +k=0.999947368 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3524",
    "name": "NAD83(NSRS2007) / Idaho East",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-112.166666666667 +k=0.999947368 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3525",
    "name": "NAD83(NSRS2007) / Idaho East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-112.166666666667 +k=0.999947368 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3526",
    "name": "NAD83(NSRS2007) / Idaho West",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-115.75 +k=0.999933333 +x_0=800000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3527",
    "name": "NAD83(NSRS2007) / Idaho West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-115.75 +k=0.999933333 +x_0=800000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3528",
    "name": "NAD83(NSRS2007) / Illinois East",
    "proj4": "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-88.3333333333333 +k=0.999975 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3529",
    "name": "NAD83(NSRS2007) / Illinois East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-88.3333333333333 +k=0.999975 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3530",
    "name": "NAD83(NSRS2007) / Illinois West",
    "proj4": "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-90.1666666666667 +k=0.999941177 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3531",
    "name": "NAD83(NSRS2007) / Illinois West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-90.1666666666667 +k=0.999941177 +x_0=699999.99998984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3532",
    "name": "NAD83(NSRS2007) / Indiana East",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-85.6666666666667 +k=0.999966667 +x_0=100000 +y_0=250000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3533",
    "name": "NAD83(NSRS2007) / Indiana East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-85.6666666666667 +k=0.999966667 +x_0=99999.9998983997 +y_0=249999.9998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3534",
    "name": "NAD83(NSRS2007) / Indiana West",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-87.0833333333333 +k=0.999966667 +x_0=900000 +y_0=250000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3535",
    "name": "NAD83(NSRS2007) / Indiana West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-87.0833333333333 +k=0.999966667 +x_0=900000 +y_0=249999.9998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3536",
    "name": "NAD83(NSRS2007) / Iowa North",
    "proj4": "+proj=lcc +lat_0=41.5 +lon_0=-93.5 +lat_1=43.2666666666667 +lat_2=42.0666666666667 +x_0=1500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3537",
    "name": "NAD83(NSRS2007) / Iowa North (ftUS)",
    "proj4": "+proj=lcc +lat_0=41.5 +lon_0=-93.5 +lat_1=43.2666666666667 +lat_2=42.0666666666667 +x_0=1500000 +y_0=999999.999989839 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3538",
    "name": "NAD83(NSRS2007) / Iowa South",
    "proj4": "+proj=lcc +lat_0=40 +lon_0=-93.5 +lat_1=41.7833333333333 +lat_2=40.6166666666667 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3539",
    "name": "NAD83(NSRS2007) / Iowa South (ftUS)",
    "proj4": "+proj=lcc +lat_0=40 +lon_0=-93.5 +lat_1=41.7833333333333 +lat_2=40.6166666666667 +x_0=500000.00001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3540",
    "name": "NAD83(NSRS2007) / Kansas North",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-98 +lat_1=39.7833333333333 +lat_2=38.7166666666667 +x_0=400000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3541",
    "name": "NAD83(NSRS2007) / Kansas North (ftUS)",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-98 +lat_1=39.7833333333333 +lat_2=38.7166666666667 +x_0=399999.99998984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3542",
    "name": "NAD83(NSRS2007) / Kansas South",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-98.5 +lat_1=38.5666666666667 +lat_2=37.2666666666667 +x_0=400000 +y_0=400000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3543",
    "name": "NAD83(NSRS2007) / Kansas South (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-98.5 +lat_1=38.5666666666667 +lat_2=37.2666666666667 +x_0=399999.99998984 +y_0=399999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3544",
    "name": "NAD83(NSRS2007) / Kentucky North",
    "proj4": "+proj=lcc +lat_0=37.5 +lon_0=-84.25 +lat_1=37.9666666666667 +lat_2=38.9666666666667 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3545",
    "name": "NAD83(NSRS2007) / Kentucky North (ftUS)",
    "proj4": "+proj=lcc +lat_0=37.5 +lon_0=-84.25 +lat_1=37.9666666666667 +lat_2=38.9666666666667 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3546",
    "name": "NAD83(NSRS2007) / Kentucky Single Zone",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.0833333333333 +lat_2=38.6666666666667 +x_0=1500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3547",
    "name": "NAD83(NSRS2007) / Kentucky Single Zone (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.0833333333333 +lat_2=38.6666666666667 +x_0=1500000 +y_0=999999.999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3548",
    "name": "NAD83(NSRS2007) / Kentucky South",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.9333333333333 +lat_2=36.7333333333333 +x_0=500000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3549",
    "name": "NAD83(NSRS2007) / Kentucky South (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.9333333333333 +lat_2=36.7333333333333 +x_0=500000.0001016 +y_0=500000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3550",
    "name": "NAD83(NSRS2007) / Louisiana North",
    "proj4": "+proj=lcc +lat_0=30.5 +lon_0=-92.5 +lat_1=32.6666666666667 +lat_2=31.1666666666667 +x_0=1000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3551",
    "name": "NAD83(NSRS2007) / Louisiana North (ftUS)",
    "proj4": "+proj=lcc +lat_0=30.5 +lon_0=-92.5 +lat_1=32.6666666666667 +lat_2=31.1666666666667 +x_0=999999.999989839 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3552",
    "name": "NAD83(NSRS2007) / Louisiana South",
    "proj4": "+proj=lcc +lat_0=28.5 +lon_0=-91.3333333333333 +lat_1=30.7 +lat_2=29.3 +x_0=1000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3553",
    "name": "NAD83(NSRS2007) / Louisiana South (ftUS)",
    "proj4": "+proj=lcc +lat_0=28.5 +lon_0=-91.3333333333333 +lat_1=30.7 +lat_2=29.3 +x_0=999999.999989839 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3554",
    "name": "NAD83(NSRS2007) / Maine CS2000 Central",
    "proj4": "+proj=tmerc +lat_0=43.5 +lon_0=-69.125 +k=0.99998 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3555",
    "name": "NAD83(NSRS2007) / Maine CS2000 East",
    "proj4": "+proj=tmerc +lat_0=43.8333333333333 +lon_0=-67.875 +k=0.99998 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3556",
    "name": "NAD83(NSRS2007) / Maine CS2000 West",
    "proj4": "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-70.375 +k=0.99998 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3557",
    "name": "NAD83(NSRS2007) / Maine East",
    "proj4": "+proj=tmerc +lat_0=43.6666666666667 +lon_0=-68.5 +k=0.9999 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26863",
    "name": "NAD83(NSRS2007) / Maine East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=43.6666666666667 +lon_0=-68.5 +k=0.9999 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3558",
    "name": "NAD83(NSRS2007) / Maine West",
    "proj4": "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-70.1666666666667 +k=0.999966667 +x_0=900000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26864",
    "name": "NAD83(NSRS2007) / Maine West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-70.1666666666667 +k=0.999966667 +x_0=900000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3587",
    "name": "NAD83(NSRS2007) / Michigan Central",
    "proj4": "+proj=lcc +lat_0=43.3166666666667 +lon_0=-84.3666666666667 +lat_1=45.7 +lat_2=44.1833333333333 +x_0=6000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3588",
    "name": "NAD83(NSRS2007) / Michigan Central (ft)",
    "proj4": "+proj=lcc +lat_0=43.3166666666667 +lon_0=-84.3666666666667 +lat_1=45.7 +lat_2=44.1833333333333 +x_0=5999999.999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3589",
    "name": "NAD83(NSRS2007) / Michigan North",
    "proj4": "+proj=lcc +lat_0=44.7833333333333 +lon_0=-87 +lat_1=47.0833333333333 +lat_2=45.4833333333333 +x_0=8000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3590",
    "name": "NAD83(NSRS2007) / Michigan North (ft)",
    "proj4": "+proj=lcc +lat_0=44.7833333333333 +lon_0=-87 +lat_1=47.0833333333333 +lat_2=45.4833333333333 +x_0=7999999.999968 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3592",
    "name": "NAD83(NSRS2007) / Michigan South",
    "proj4": "+proj=lcc +lat_0=41.5 +lon_0=-84.3666666666667 +lat_1=43.6666666666667 +lat_2=42.1 +x_0=4000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3593",
    "name": "NAD83(NSRS2007) / Michigan South (ft)",
    "proj4": "+proj=lcc +lat_0=41.5 +lon_0=-84.3666666666667 +lat_1=43.6666666666667 +lat_2=42.1 +x_0=3999999.999984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3594",
    "name": "NAD83(NSRS2007) / Minnesota Central",
    "proj4": "+proj=lcc +lat_0=45 +lon_0=-94.25 +lat_1=47.05 +lat_2=45.6166666666667 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26866",
    "name": "NAD83(NSRS2007) / Minnesota Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=45 +lon_0=-94.25 +lat_1=47.05 +lat_2=45.6166666666667 +x_0=800000.00001016 +y_0=99999.9999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3595",
    "name": "NAD83(NSRS2007) / Minnesota North",
    "proj4": "+proj=lcc +lat_0=46.5 +lon_0=-93.1 +lat_1=48.6333333333333 +lat_2=47.0333333333333 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26865",
    "name": "NAD83(NSRS2007) / Minnesota North (ftUS)",
    "proj4": "+proj=lcc +lat_0=46.5 +lon_0=-93.1 +lat_1=48.6333333333333 +lat_2=47.0333333333333 +x_0=800000.00001016 +y_0=99999.9999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3596",
    "name": "NAD83(NSRS2007) / Minnesota South",
    "proj4": "+proj=lcc +lat_0=43 +lon_0=-94 +lat_1=45.2166666666667 +lat_2=43.7833333333333 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26867",
    "name": "NAD83(NSRS2007) / Minnesota South (ftUS)",
    "proj4": "+proj=lcc +lat_0=43 +lon_0=-94 +lat_1=45.2166666666667 +lat_2=43.7833333333333 +x_0=800000.00001016 +y_0=99999.9999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3597",
    "name": "NAD83(NSRS2007) / Mississippi East",
    "proj4": "+proj=tmerc +lat_0=29.5 +lon_0=-88.8333333333333 +k=0.99995 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3598",
    "name": "NAD83(NSRS2007) / Mississippi East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=29.5 +lon_0=-88.8333333333333 +k=0.99995 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3599",
    "name": "NAD83(NSRS2007) / Mississippi West",
    "proj4": "+proj=tmerc +lat_0=29.5 +lon_0=-90.3333333333333 +k=0.99995 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3600",
    "name": "NAD83(NSRS2007) / Mississippi West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=29.5 +lon_0=-90.3333333333333 +k=0.99995 +x_0=699999.999898399 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3601",
    "name": "NAD83(NSRS2007) / Missouri Central",
    "proj4": "+proj=tmerc +lat_0=35.8333333333333 +lon_0=-92.5 +k=0.999933333 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3602",
    "name": "NAD83(NSRS2007) / Missouri East",
    "proj4": "+proj=tmerc +lat_0=35.8333333333333 +lon_0=-90.5 +k=0.999933333 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3603",
    "name": "NAD83(NSRS2007) / Missouri West",
    "proj4": "+proj=tmerc +lat_0=36.1666666666667 +lon_0=-94.5 +k=0.999941177 +x_0=850000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3607",
    "name": "NAD83(NSRS2007) / Nevada Central",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-116.666666666667 +k=0.9999 +x_0=500000 +y_0=6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3608",
    "name": "NAD83(NSRS2007) / Nevada Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-116.666666666667 +k=0.9999 +x_0=500000.00001016 +y_0=6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3609",
    "name": "NAD83(NSRS2007) / Nevada East",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-115.583333333333 +k=0.9999 +x_0=200000 +y_0=8000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3610",
    "name": "NAD83(NSRS2007) / Nevada East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-115.583333333333 +k=0.9999 +x_0=200000.00001016 +y_0=8000000.00001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3611",
    "name": "NAD83(NSRS2007) / Nevada West",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-118.583333333333 +k=0.9999 +x_0=800000 +y_0=4000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3612",
    "name": "NAD83(NSRS2007) / Nevada West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=34.75 +lon_0=-118.583333333333 +k=0.9999 +x_0=800000.00001016 +y_0=3999999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3617",
    "name": "NAD83(NSRS2007) / New Mexico Central",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3618",
    "name": "NAD83(NSRS2007) / New Mexico Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.9999 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3619",
    "name": "NAD83(NSRS2007) / New Mexico East",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-104.333333333333 +k=0.999909091 +x_0=165000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3620",
    "name": "NAD83(NSRS2007) / New Mexico East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-104.333333333333 +k=0.999909091 +x_0=165000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3621",
    "name": "NAD83(NSRS2007) / New Mexico West",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-107.833333333333 +k=0.999916667 +x_0=830000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3622",
    "name": "NAD83(NSRS2007) / New Mexico West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=31 +lon_0=-107.833333333333 +k=0.999916667 +x_0=830000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3623",
    "name": "NAD83(NSRS2007) / New York Central",
    "proj4": "+proj=tmerc +lat_0=40 +lon_0=-76.5833333333333 +k=0.9999375 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3624",
    "name": "NAD83(NSRS2007) / New York Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40 +lon_0=-76.5833333333333 +k=0.9999375 +x_0=249999.9998984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3625",
    "name": "NAD83(NSRS2007) / New York East",
    "proj4": "+proj=tmerc +lat_0=38.8333333333333 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3626",
    "name": "NAD83(NSRS2007) / New York East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=38.8333333333333 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3629",
    "name": "NAD83(NSRS2007) / New York West",
    "proj4": "+proj=tmerc +lat_0=40 +lon_0=-78.5833333333333 +k=0.9999375 +x_0=350000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3630",
    "name": "NAD83(NSRS2007) / New York West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40 +lon_0=-78.5833333333333 +k=0.9999375 +x_0=350000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3631",
    "name": "NAD83(NSRS2007) / North Carolina",
    "proj4": "+proj=lcc +lat_0=33.75 +lon_0=-79 +lat_1=36.1666666666667 +lat_2=34.3333333333333 +x_0=609601.22 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3632",
    "name": "NAD83(NSRS2007) / North Carolina (ftUS)",
    "proj4": "+proj=lcc +lat_0=33.75 +lon_0=-79 +lat_1=36.1666666666667 +lat_2=34.3333333333333 +x_0=609601.219202438 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3633",
    "name": "NAD83(NSRS2007) / North Dakota North",
    "proj4": "+proj=lcc +lat_0=47 +lon_0=-100.5 +lat_1=48.7333333333333 +lat_2=47.4333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3634",
    "name": "NAD83(NSRS2007) / North Dakota North (ft)",
    "proj4": "+proj=lcc +lat_0=47 +lon_0=-100.5 +lat_1=48.7333333333333 +lat_2=47.4333333333333 +x_0=599999.9999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3635",
    "name": "NAD83(NSRS2007) / North Dakota South",
    "proj4": "+proj=lcc +lat_0=45.6666666666667 +lon_0=-100.5 +lat_1=47.4833333333333 +lat_2=46.1833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3636",
    "name": "NAD83(NSRS2007) / North Dakota South (ft)",
    "proj4": "+proj=lcc +lat_0=45.6666666666667 +lon_0=-100.5 +lat_1=47.4833333333333 +lat_2=46.1833333333333 +x_0=599999.9999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3637",
    "name": "NAD83(NSRS2007) / Ohio North",
    "proj4": "+proj=lcc +lat_0=39.6666666666667 +lon_0=-82.5 +lat_1=41.7 +lat_2=40.4333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3728",
    "name": "NAD83(NSRS2007) / Ohio North (ftUS)",
    "proj4": "+proj=lcc +lat_0=39.6666666666667 +lon_0=-82.5 +lat_1=41.7 +lat_2=40.4333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3638",
    "name": "NAD83(NSRS2007) / Ohio South",
    "proj4": "+proj=lcc +lat_0=38 +lon_0=-82.5 +lat_1=40.0333333333333 +lat_2=38.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3729",
    "name": "NAD83(NSRS2007) / Ohio South (ftUS)",
    "proj4": "+proj=lcc +lat_0=38 +lon_0=-82.5 +lat_1=40.0333333333333 +lat_2=38.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3639",
    "name": "NAD83(NSRS2007) / Oklahoma North",
    "proj4": "+proj=lcc +lat_0=35 +lon_0=-98 +lat_1=36.7666666666667 +lat_2=35.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3640",
    "name": "NAD83(NSRS2007) / Oklahoma North (ftUS)",
    "proj4": "+proj=lcc +lat_0=35 +lon_0=-98 +lat_1=36.7666666666667 +lat_2=35.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3641",
    "name": "NAD83(NSRS2007) / Oklahoma South",
    "proj4": "+proj=lcc +lat_0=33.3333333333333 +lon_0=-98 +lat_1=35.2333333333333 +lat_2=33.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3642",
    "name": "NAD83(NSRS2007) / Oklahoma South (ftUS)",
    "proj4": "+proj=lcc +lat_0=33.3333333333333 +lon_0=-98 +lat_1=35.2333333333333 +lat_2=33.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3645",
    "name": "NAD83(NSRS2007) / Oregon North",
    "proj4": "+proj=lcc +lat_0=43.6666666666667 +lon_0=-120.5 +lat_1=46 +lat_2=44.3333333333333 +x_0=2500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3646",
    "name": "NAD83(NSRS2007) / Oregon North (ft)",
    "proj4": "+proj=lcc +lat_0=43.6666666666667 +lon_0=-120.5 +lat_1=46 +lat_2=44.3333333333333 +x_0=2500000.0001424 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3647",
    "name": "NAD83(NSRS2007) / Oregon South",
    "proj4": "+proj=lcc +lat_0=41.6666666666667 +lon_0=-120.5 +lat_1=44 +lat_2=42.3333333333333 +x_0=1500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3648",
    "name": "NAD83(NSRS2007) / Oregon South (ft)",
    "proj4": "+proj=lcc +lat_0=41.6666666666667 +lon_0=-120.5 +lat_1=44 +lat_2=42.3333333333333 +x_0=1500000.0001464 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3649",
    "name": "NAD83(NSRS2007) / Pennsylvania North",
    "proj4": "+proj=lcc +lat_0=40.1666666666667 +lon_0=-77.75 +lat_1=41.95 +lat_2=40.8833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3650",
    "name": "NAD83(NSRS2007) / Pennsylvania North (ftUS)",
    "proj4": "+proj=lcc +lat_0=40.1666666666667 +lon_0=-77.75 +lat_1=41.95 +lat_2=40.8833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3651",
    "name": "NAD83(NSRS2007) / Pennsylvania South",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-77.75 +lat_1=40.9666666666667 +lat_2=39.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3652",
    "name": "NAD83(NSRS2007) / Pennsylvania South (ftUS)",
    "proj4": "+proj=lcc +lat_0=39.3333333333333 +lon_0=-77.75 +lat_1=40.9666666666667 +lat_2=39.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3655",
    "name": "NAD83(NSRS2007) / South Carolina",
    "proj4": "+proj=lcc +lat_0=31.8333333333333 +lon_0=-81 +lat_1=34.8333333333333 +lat_2=32.5 +x_0=609600 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3656",
    "name": "NAD83(NSRS2007) / South Carolina (ft)",
    "proj4": "+proj=lcc +lat_0=31.8333333333333 +lon_0=-81 +lat_1=34.8333333333333 +lat_2=32.5 +x_0=609600 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3657",
    "name": "NAD83(NSRS2007) / South Dakota North",
    "proj4": "+proj=lcc +lat_0=43.8333333333333 +lon_0=-100 +lat_1=45.6833333333333 +lat_2=44.4166666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3658",
    "name": "NAD83(NSRS2007) / South Dakota North (ftUS)",
    "proj4": "+proj=lcc +lat_0=43.8333333333333 +lon_0=-100 +lat_1=45.6833333333333 +lat_2=44.4166666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3659",
    "name": "NAD83(NSRS2007) / South Dakota South",
    "proj4": "+proj=lcc +lat_0=42.3333333333333 +lon_0=-100.333333333333 +lat_1=44.4 +lat_2=42.8333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3660",
    "name": "NAD83(NSRS2007) / South Dakota South (ftUS)",
    "proj4": "+proj=lcc +lat_0=42.3333333333333 +lon_0=-100.333333333333 +lat_1=44.4 +lat_2=42.8333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3663",
    "name": "NAD83(NSRS2007) / Texas Central",
    "proj4": "+proj=lcc +lat_0=29.6666666666667 +lon_0=-100.333333333333 +lat_1=31.8833333333333 +lat_2=30.1166666666667 +x_0=700000 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3664",
    "name": "NAD83(NSRS2007) / Texas Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=29.6666666666667 +lon_0=-100.333333333333 +lat_1=31.8833333333333 +lat_2=30.1166666666667 +x_0=699999.999898399 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3667",
    "name": "NAD83(NSRS2007) / Texas North",
    "proj4": "+proj=lcc +lat_0=34 +lon_0=-101.5 +lat_1=36.1833333333333 +lat_2=34.65 +x_0=200000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3668",
    "name": "NAD83(NSRS2007) / Texas North (ftUS)",
    "proj4": "+proj=lcc +lat_0=34 +lon_0=-101.5 +lat_1=36.1833333333333 +lat_2=34.65 +x_0=200000.0001016 +y_0=999999.999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3669",
    "name": "NAD83(NSRS2007) / Texas North Central",
    "proj4": "+proj=lcc +lat_0=31.6666666666667 +lon_0=-98.5 +lat_1=33.9666666666667 +lat_2=32.1333333333333 +x_0=600000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3670",
    "name": "NAD83(NSRS2007) / Texas North Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=31.6666666666667 +lon_0=-98.5 +lat_1=33.9666666666667 +lat_2=32.1333333333333 +x_0=600000 +y_0=2000000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3671",
    "name": "NAD83(NSRS2007) / Texas South",
    "proj4": "+proj=lcc +lat_0=25.6666666666667 +lon_0=-98.5 +lat_1=27.8333333333333 +lat_2=26.1666666666667 +x_0=300000 +y_0=5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3672",
    "name": "NAD83(NSRS2007) / Texas South (ftUS)",
    "proj4": "+proj=lcc +lat_0=25.6666666666667 +lon_0=-98.5 +lat_1=27.8333333333333 +lat_2=26.1666666666667 +x_0=300000 +y_0=5000000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3673",
    "name": "NAD83(NSRS2007) / Texas South Central",
    "proj4": "+proj=lcc +lat_0=27.8333333333333 +lon_0=-99 +lat_1=30.2833333333333 +lat_2=28.3833333333333 +x_0=600000 +y_0=4000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3674",
    "name": "NAD83(NSRS2007) / Texas South Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=27.8333333333333 +lon_0=-99 +lat_1=30.2833333333333 +lat_2=28.3833333333333 +x_0=600000 +y_0=3999999.9998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3675",
    "name": "NAD83(NSRS2007) / Utah Central",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-111.5 +lat_1=40.65 +lat_2=39.0166666666667 +x_0=500000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3676",
    "name": "NAD83(NSRS2007) / Utah Central (ft)",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-111.5 +lat_1=40.65 +lat_2=39.0166666666667 +x_0=500000.0001504 +y_0=1999999.999992 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3677",
    "name": "NAD83(NSRS2007) / Utah Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=38.3333333333333 +lon_0=-111.5 +lat_1=40.65 +lat_2=39.0166666666667 +x_0=500000.00001016 +y_0=2000000.00001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3678",
    "name": "NAD83(NSRS2007) / Utah North",
    "proj4": "+proj=lcc +lat_0=40.3333333333333 +lon_0=-111.5 +lat_1=41.7833333333333 +lat_2=40.7166666666667 +x_0=500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3679",
    "name": "NAD83(NSRS2007) / Utah North (ft)",
    "proj4": "+proj=lcc +lat_0=40.3333333333333 +lon_0=-111.5 +lat_1=41.7833333333333 +lat_2=40.7166666666667 +x_0=500000.0001504 +y_0=999999.999996 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3680",
    "name": "NAD83(NSRS2007) / Utah North (ftUS)",
    "proj4": "+proj=lcc +lat_0=40.3333333333333 +lon_0=-111.5 +lat_1=41.7833333333333 +lat_2=40.7166666666667 +x_0=500000.00001016 +y_0=999999.999989839 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3681",
    "name": "NAD83(NSRS2007) / Utah South",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-111.5 +lat_1=38.35 +lat_2=37.2166666666667 +x_0=500000 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3682",
    "name": "NAD83(NSRS2007) / Utah South (ft)",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-111.5 +lat_1=38.35 +lat_2=37.2166666666667 +x_0=500000.0001504 +y_0=2999999.999988 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3683",
    "name": "NAD83(NSRS2007) / Utah South (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.6666666666667 +lon_0=-111.5 +lat_1=38.35 +lat_2=37.2166666666667 +x_0=500000.00001016 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3685",
    "name": "NAD83(NSRS2007) / Virginia North",
    "proj4": "+proj=lcc +lat_0=37.6666666666667 +lon_0=-78.5 +lat_1=39.2 +lat_2=38.0333333333333 +x_0=3500000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3686",
    "name": "NAD83(NSRS2007) / Virginia North (ftUS)",
    "proj4": "+proj=lcc +lat_0=37.6666666666667 +lon_0=-78.5 +lat_1=39.2 +lat_2=38.0333333333333 +x_0=3500000.0001016 +y_0=2000000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3687",
    "name": "NAD83(NSRS2007) / Virginia South",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-78.5 +lat_1=37.9666666666667 +lat_2=36.7666666666667 +x_0=3500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3688",
    "name": "NAD83(NSRS2007) / Virginia South (ftUS)",
    "proj4": "+proj=lcc +lat_0=36.3333333333333 +lon_0=-78.5 +lat_1=37.9666666666667 +lat_2=36.7666666666667 +x_0=3500000.0001016 +y_0=999999.999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3689",
    "name": "NAD83(NSRS2007) / Washington North",
    "proj4": "+proj=lcc +lat_0=47 +lon_0=-120.833333333333 +lat_1=48.7333333333333 +lat_2=47.5 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3690",
    "name": "NAD83(NSRS2007) / Washington North (ftUS)",
    "proj4": "+proj=lcc +lat_0=47 +lon_0=-120.833333333333 +lat_1=48.7333333333333 +lat_2=47.5 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3691",
    "name": "NAD83(NSRS2007) / Washington South",
    "proj4": "+proj=lcc +lat_0=45.3333333333333 +lon_0=-120.5 +lat_1=47.3333333333333 +lat_2=45.8333333333333 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3692",
    "name": "NAD83(NSRS2007) / Washington South (ftUS)",
    "proj4": "+proj=lcc +lat_0=45.3333333333333 +lon_0=-120.5 +lat_1=47.3333333333333 +lat_2=45.8333333333333 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3693",
    "name": "NAD83(NSRS2007) / West Virginia North",
    "proj4": "+proj=lcc +lat_0=38.5 +lon_0=-79.5 +lat_1=40.25 +lat_2=39 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26869",
    "name": "NAD83(NSRS2007) / West Virginia North (ftUS)",
    "proj4": "+proj=lcc +lat_0=38.5 +lon_0=-79.5 +lat_1=40.25 +lat_2=39 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3694",
    "name": "NAD83(NSRS2007) / West Virginia South",
    "proj4": "+proj=lcc +lat_0=37 +lon_0=-81 +lat_1=38.8833333333333 +lat_2=37.4833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "26870",
    "name": "NAD83(NSRS2007) / West Virginia South (ftUS)",
    "proj4": "+proj=lcc +lat_0=37 +lon_0=-81 +lat_1=38.8833333333333 +lat_2=37.4833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3695",
    "name": "NAD83(NSRS2007) / Wisconsin Central",
    "proj4": "+proj=lcc +lat_0=43.8333333333333 +lon_0=-90 +lat_1=45.5 +lat_2=44.25 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3696",
    "name": "NAD83(NSRS2007) / Wisconsin Central (ftUS)",
    "proj4": "+proj=lcc +lat_0=43.8333333333333 +lon_0=-90 +lat_1=45.5 +lat_2=44.25 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3697",
    "name": "NAD83(NSRS2007) / Wisconsin North",
    "proj4": "+proj=lcc +lat_0=45.1666666666667 +lon_0=-90 +lat_1=46.7666666666667 +lat_2=45.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3698",
    "name": "NAD83(NSRS2007) / Wisconsin North (ftUS)",
    "proj4": "+proj=lcc +lat_0=45.1666666666667 +lon_0=-90 +lat_1=46.7666666666667 +lat_2=45.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3699",
    "name": "NAD83(NSRS2007) / Wisconsin South",
    "proj4": "+proj=lcc +lat_0=42 +lon_0=-90 +lat_1=44.0666666666667 +lat_2=42.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3700",
    "name": "NAD83(NSRS2007) / Wisconsin South (ftUS)",
    "proj4": "+proj=lcc +lat_0=42 +lon_0=-90 +lat_1=44.0666666666667 +lat_2=42.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3702",
    "name": "NAD83(NSRS2007) / Wyoming East",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-105.166666666667 +k=0.9999375 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3730",
    "name": "NAD83(NSRS2007) / Wyoming East (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-105.166666666667 +k=0.9999375 +x_0=200000.00001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3703",
    "name": "NAD83(NSRS2007) / Wyoming East Central",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-107.333333333333 +k=0.9999375 +x_0=400000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3731",
    "name": "NAD83(NSRS2007) / Wyoming East Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-107.333333333333 +k=0.9999375 +x_0=399999.99998984 +y_0=99999.9999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3705",
    "name": "NAD83(NSRS2007) / Wyoming West",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-110.083333333333 +k=0.9999375 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3733",
    "name": "NAD83(NSRS2007) / Wyoming West (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-110.083333333333 +k=0.9999375 +x_0=800000.00001016 +y_0=99999.9999898399 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "3704",
    "name": "NAD83(NSRS2007) / Wyoming West Central",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-108.75 +k=0.9999375 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "3732",
    "name": "NAD83(NSRS2007) / Wyoming West Central (ftUS)",
    "proj4": "+proj=tmerc +lat_0=40.5 +lon_0=-108.75 +k=0.9999375 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6628",
    "name": "NAD83(PA11) / Hawaii zone 1",
    "proj4": "+proj=tmerc +lat_0=18.8333333333333 +lon_0=-155.5 +k=0.999966667 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6629",
    "name": "NAD83(PA11) / Hawaii zone 2",
    "proj4": "+proj=tmerc +lat_0=20.3333333333333 +lon_0=-156.666666666667 +k=0.999966667 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6630",
    "name": "NAD83(PA11) / Hawaii zone 3",
    "proj4": "+proj=tmerc +lat_0=21.1666666666667 +lon_0=-158 +k=0.99999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6633",
    "name": "NAD83(PA11) / Hawaii zone 3 (ftUS)",
    "proj4": "+proj=tmerc +lat_0=21.1666666666667 +lon_0=-158 +k=0.99999 +x_0=500000.00001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs +type=crs",
    "units": "feet"
  },
  {
    "epsg": "6631",
    "name": "NAD83(PA11) / Hawaii zone 4",
    "proj4": "+proj=tmerc +lat_0=21.8333333333333 +lon_0=-159.5 +k=0.99999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  },
  {
    "epsg": "6632",
    "name": "NAD83(PA11) / Hawaii zone 5",
    "proj4": "+proj=tmerc +lat_0=21.6666666666667 +lon_0=-160.166666666667 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
    "units": "meters"
  }
];
