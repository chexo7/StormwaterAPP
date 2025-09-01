import fs from 'fs/promises';
import path from 'path';
import JSZip from 'jszip';
import { buildSUBCATCHMENTS, buildSUBAREAS, buildINFILTRATION, buildOUTFALLS, insertAfterSection, type PCSWMMExportInput } from '@/lib/pcswwm-writer';

const TPL_DIR = path.join(process.cwd(), 'export_templates', 'swmm');

export default async function handler(req, res) {
  try {
    const input = req.body as PCSWMMExportInput;

    // 1) Carga template base
    const inpTpl = await fs.readFile(path.join(TPL_DIR, 'SWMM_TEMPLATE.inp'), 'utf8');

    // 2) Construye bloques (solo drainage areas en este primer paso)
    let inp = inpTpl;
    inp = insertAfterSection(inp, 'SUBCATCHMENTS', buildSUBCATCHMENTS(input));
    inp = insertAfterSection(inp, 'SUBAREAS',      buildSUBAREAS(input));
    inp = insertAfterSection(inp, 'INFILTRATION',  buildINFILTRATION(input));
    inp = insertAfterSection(inp, 'OUTFALLS',      buildOUTFALLS(input)); // para que los outlets existan

    // 3) Arma el ZIP
    const zip = new JSZip();
    zip.file(`${input.projectName || 'project'}.inp`, inp.replace(/\n/g, '\r\n'));
    // Copia los demás (ini/thm/chi/readme) tal cual:
    for (const fname of ['SWMM_TEMPLATE.ini','SWMM_TEMPLATE.thm','SWMM_TEMPLATE.chi','README.md']) {
      try {
        const buf = await fs.readFile(path.join(TPL_DIR, fname));
        zip.file(fname.replace('SWMM_TEMPLATE', input.projectName || 'project'), buf);
      } catch { /* opcional */ }
    }

    const content = await zip.generateAsync({ type: 'nodebuffer' });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${(input.projectName || 'pcswmm_export')}.zip"`);
    res.status(200).send(content);

  } catch (e:any) {
    res.status(400).json({ error: e.message });
  }
}
