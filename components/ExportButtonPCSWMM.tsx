import { PCSWMMExportInput } from '@/types/export-pcswmm';

export function ExportButtonPCSWMM({ payload }: { payload: PCSWMMExportInput }) {
  const onClick = async () => {
    const res = await fetch('/api/export/pcswwm.zip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) { alert('Error exportando'); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${payload.projectName || 'pcswmm_export'}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return <button onClick={onClick} className="btn">Export → PCSWMM (.zip)</button>;
}
