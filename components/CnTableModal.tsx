import React, { useEffect, useMemo, useState } from 'react';
import type { CnRecord } from '../utils/landcover';

type DraftCnRecord = {
  LandCover: string;
  A: string;
  B: string;
  C: string;
  D: string;
};

interface CnTableModalProps {
  records: CnRecord[] | null;
  loading: boolean;
  error: string | null;
  onReload: () => void;
  onSave: (records: CnRecord[]) => Promise<void>;
  onClose: () => void;
}

const toDraft = (records: CnRecord[] | null): DraftCnRecord[] =>
  (records || []).map(record => ({
    LandCover: record.LandCover,
    A: String(record.A ?? ''),
    B: String(record.B ?? ''),
    C: String(record.C ?? ''),
    D: String(record.D ?? ''),
  }));

const CnTableModal: React.FC<CnTableModalProps> = ({
  records,
  loading,
  error,
  onReload,
  onSave,
  onClose,
}) => {
  const canonicalDraft = useMemo(() => toDraft(records), [records]);
  const [draft, setDraft] = useState<DraftCnRecord[]>(canonicalDraft);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setDraft(canonicalDraft);
  }, [canonicalDraft]);

  const isDirty = useMemo(() => {
    if (draft.length !== canonicalDraft.length) return true;
    return JSON.stringify(draft) !== JSON.stringify(canonicalDraft);
  }, [draft, canonicalDraft]);

  const handleFieldChange = (index: number, field: keyof DraftCnRecord, value: string) => {
    setDraft(prev => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
    setFormError(null);
    setStatus(null);
  };

  const handleRemoveRow = (index: number) => {
    setDraft(prev => prev.filter((_, i) => i !== index));
    setFormError(null);
    setStatus(null);
  };

  const handleAddRow = () => {
    setDraft(prev => [...prev, { LandCover: '', A: '', B: '', C: '', D: '' }]);
    setFormError(null);
    setStatus(null);
  };

  const parseDraft = (): CnRecord[] => {
    if (draft.length === 0) {
      throw new Error('Agrega al menos un registro a la tabla de Curve Numbers.');
    }
    return draft.map((row, index) => {
      const landCover = row.LandCover.trim();
      if (!landCover) {
        throw new Error(`Fila ${index + 1}: el nombre de Land Cover es obligatorio.`);
      }
      const parseNumber = (value: string, field: string) => {
        const trimmed = value.trim();
        if (trimmed === '') {
          throw new Error(`Fila ${index + 1}: el valor de ${field} es obligatorio.`);
        }
        const num = Number(trimmed);
        if (!Number.isFinite(num)) {
          throw new Error(`Fila ${index + 1}: el valor de ${field} debe ser numérico.`);
        }
        return num;
      };
      return {
        LandCover: landCover,
        A: parseNumber(row.A, 'A'),
        B: parseNumber(row.B, 'B'),
        C: parseNumber(row.C, 'C'),
        D: parseNumber(row.D, 'D'),
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setFormError(null);
    setStatus(null);
    try {
      const normalized = parseDraft();
      await onSave(normalized);
      setStatus('Valores guardados correctamente.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ocurrió un error al guardar.';
      setFormError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2500]">
      <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-xl w-[min(90vw,68rem)] max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-white">Tabla de Curve Numbers</h2>
            <p className="text-sm text-gray-400">Edita los valores de CN para cada Land Cover y guarda los cambios en el servidor.</p>
          </div>
          <button
            className="text-gray-400 hover:text-white"
            onClick={onClose}
            disabled={saving}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="px-6 pt-4 pb-2 space-y-3 text-sm text-gray-200">
          {loading && (
            <div className="rounded border border-gray-600 bg-gray-900/60 px-4 py-3 text-center">
              Cargando valores de Curve Number...
            </div>
          )}
          {error && (
            <div className="rounded border border-red-500/60 bg-red-900/40 px-4 py-3">
              <p className="font-semibold text-red-200">Error al cargar la tabla: {error}</p>
              <button
                type="button"
                className="mt-2 inline-flex items-center justify-center rounded bg-red-600 px-3 py-1 font-medium text-white hover:bg-red-700"
                onClick={onReload}
                disabled={loading || saving}
              >
                Reintentar
              </button>
            </div>
          )}
          {formError && (
            <div className="rounded border border-red-500/60 bg-red-900/40 px-4 py-3 text-red-100">
              {formError}
            </div>
          )}
          {status && (
            <div className="rounded border border-emerald-500/60 bg-emerald-900/40 px-4 py-3 text-emerald-100">
              {status}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-hidden px-6 pb-4">
          <div className="h-full overflow-auto rounded border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700 text-sm">
              <thead className="bg-gray-900/60 text-gray-300">
                <tr>
                  <th className="sticky top-0 px-4 py-2 text-left font-semibold">Land Cover</th>
                  <th className="sticky top-0 px-4 py-2 text-left font-semibold">HSG A</th>
                  <th className="sticky top-0 px-4 py-2 text-left font-semibold">HSG B</th>
                  <th className="sticky top-0 px-4 py-2 text-left font-semibold">HSG C</th>
                  <th className="sticky top-0 px-4 py-2 text-left font-semibold">HSG D</th>
                  <th className="sticky top-0 px-4 py-2 text-left font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-gray-900/40 text-gray-100">
                {draft.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                      {loading ? ' ' : 'No hay registros de Curve Number disponibles.'}
                    </td>
                  </tr>
                ) : (
                  draft.map((row, index) => (
                    <tr key={`${index}-${row.LandCover}`}>
                      <td className="px-4 py-2 align-top">
                        <input
                          type="text"
                          value={row.LandCover}
                          onChange={e => handleFieldChange(index, 'LandCover', e.target.value)}
                          className="w-full rounded bg-gray-800 px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          disabled={loading || saving}
                        />
                      </td>
                      <td className="px-4 py-2 align-top">
                        <input
                          type="number"
                          step="any"
                          value={row.A}
                          onChange={e => handleFieldChange(index, 'A', e.target.value)}
                          className="w-full rounded bg-gray-800 px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          disabled={loading || saving}
                        />
                      </td>
                      <td className="px-4 py-2 align-top">
                        <input
                          type="number"
                          step="any"
                          value={row.B}
                          onChange={e => handleFieldChange(index, 'B', e.target.value)}
                          className="w-full rounded bg-gray-800 px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          disabled={loading || saving}
                        />
                      </td>
                      <td className="px-4 py-2 align-top">
                        <input
                          type="number"
                          step="any"
                          value={row.C}
                          onChange={e => handleFieldChange(index, 'C', e.target.value)}
                          className="w-full rounded bg-gray-800 px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          disabled={loading || saving}
                        />
                      </td>
                      <td className="px-4 py-2 align-top">
                        <input
                          type="number"
                          step="any"
                          value={row.D}
                          onChange={e => handleFieldChange(index, 'D', e.target.value)}
                          className="w-full rounded bg-gray-800 px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          disabled={loading || saving}
                        />
                      </td>
                      <td className="px-4 py-2 align-top text-right">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                          onClick={() => handleRemoveRow(index)}
                          disabled={loading || saving}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-700 px-6 py-4">
          <div className="space-x-3">
            <button
              type="button"
              onClick={handleAddRow}
              className="rounded bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600 disabled:opacity-50"
              disabled={loading || saving}
            >
              Agregar fila
            </button>
            <button
              type="button"
              onClick={onReload}
              className="rounded bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600 disabled:opacity-50"
              disabled={loading || saving}
            >
              Restablecer desde el servidor
            </button>
          </div>
          <div className="space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-gray-600 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-700 disabled:opacity-50"
              disabled={saving}
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-50"
              disabled={saving || loading || !isDirty}
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CnTableModal;
