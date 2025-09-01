export interface StatePlaneOption {
  label: string;
  epsg: string;
}

export const STATE_PLANE_OPTIONS: StatePlaneOption[] = [
  { label: 'NAD83 / California zone 3 (ftUS)', epsg: '2227' },
  { label: 'NAD83 / Texas South Central (ftUS)', epsg: '2278' },
  { label: 'NAD83 / New York Long Island (ftUS)', epsg: '2263' },
  { label: 'NAD83 / Florida East (ftUS)', epsg: '2236' },
  { label: 'NAD83 / Washington North (m)', epsg: '32148' }
];
