import type { LayerData } from '../../types';
import { ExportError, type ExportResult } from './types';

interface HydroCADExportParams {
  layers: LayerData[];
  projectName?: string;
  projectVersion: string;
}

export const exportHydroCAD = async ({
  layers,
  projectName,
  projectVersion,
}: HydroCADExportParams): Promise<ExportResult> => {
  const overlayLayer = layers.find((l) => l.name === 'Overlay');
  if (!overlayLayer) {
    throw new ExportError('Overlay layer not found');
  }

  const { area } = await import('@turf/turf');

  const nodes: Record<string, { area: number; cn: number; desc?: string }[]> = {};
  overlayLayer.geojson.features.forEach((f) => {
    const da = (f.properties as any)?.DA_NAME || 'DA';
    const cn = (f.properties as any)?.CN;
    const lc = (f.properties as any)?.LAND_COVER;
    const hsg = (f.properties as any)?.HSG;
    if (cn === undefined) return;
    const a = area(f as any) * 10.7639; // square feet
    if (!nodes[da]) nodes[da] = [];
    const desc = lc ? `${lc}${hsg ? `, HSG ${hsg}` : ''}` : undefined;
    nodes[da].push({ area: a, cn, desc });
  });

  let content = `[HydroCAD]\nFileUnits=English\nCalcUnits=English\nInputUnits=English-LowFlow\nReportUnits=English-LowFlow\nLargeAreas=False\nSource=HydroCAD® 10.20-6a  s/n 07447  © 2024 HydroCAD Software Solutions LLC\nName=${
    projectName || 'Project'
  }\nPath=\nView=-5.46349942062574 0 15.4634994206257 10\nGridShow=True\nGridSnap=True\nTimeSpan=0 86400\nTimeInc=36\nMaxGraph=0\nRunoffMethod=SCS TR-20\nReachMethod=Stor-Ind+Trans\nPondMethod=Stor-Ind\nUH=SCS\nMinTc=300\nRainEvent=test\n\n[EVENT]\nRainEvent=test\nStormType=Type II 24-hr\nStormDepth=0.0833333333333333\n`;

  let y = 0;
  Object.entries(nodes).forEach(([da, areas]) => {
    content += `\n[NODE]\nNumber=${da}\nType=Subcat\nName=${da}\nXYPos=0 ${y}\n`;
    areas.forEach((ar) => {
      content += `[AREA]\nArea=${ar.area}\nCN=${ar.cn}\n`;
      if (ar.desc) content += `Desc=${ar.desc}\n`;
    });
    content += `[TC]\nMethod=Direct\nTc=300\n`;
    y += 5;
  });

  const blob = new Blob([content], { type: 'text/plain' });
  const filename = `${(projectName || 'project')}_${projectVersion}.hcp`;

  return {
    blob,
    filename,
    logs: [{ message: 'HydroCAD file exported', level: 'info' }],
  };
};
