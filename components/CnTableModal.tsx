import React, { useEffect, useMemo, useState } from 'react';
import { CnRecord } from '../utils/landcover';

interface CnTableModalProps {
  records: CnRecord[];
  onClose: () => void;
  onSave: (records: CnRecord[]) => Promise<void> | void;
}

type EditableRecord = {
  LandCover: string;
  A: string;
  B: string;
  C: string;
  D: string;
};

const createEditableRecord = (record?: CnRecord): EditableRecord => ({
  LandCover: record ? String(record.LandCover ?? '') : '',
  A: record && record.A !== undefined ? String(record.A) : '',
  B: record && record.B !== undefined ? String(record.B) : '',
  C: record && record.C !== undefined ? String(record.C) : '',
  D: record && record.D !== undefined ? String(record.D) : '',
});

const parseNumberField = (value: string, label: string): number => {
  const trimmed = value.trim();
  if (trimmed === '') {
    throw new Error(`Ingresa un valor para ${label}.`);
  }
  const num = Number(trimmed);
  if (!Number.isFinite(num)) {
    throw new Error(`El valor de ${label} debe ser numérico.`);
  }
  if (num < 0 || num > 100) {
    throw new Error(`${label} debe estar entre 0 y 100.`);
  }
  return Math.round(num * 100) / 100;
};

const CnTableModal: React.FC<CnTableModalProps> = ({ records, onClose, onSave }) => {
  const [rows, setRows] = useState<EditableRecord[]>(() =>
    records.length ? records.map(createEditableRecord) : [createEditableRecord()]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRows(records.length ? records.map(createEditableRecord) : [createEditableRecord()]);
  }, [records]);

  const hasData = useMemo(() => rows.some(row => row.LandCover.trim() !== ''), [rows]);

  const handleChange = (index: number, field: keyof EditableRecord, value: string) => {
    setRows(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddRow = () => {
    setRows(prev => [...prev, createEditableRecord()]);
  };

  const handleRemoveRow = (index: number) => {
    setRows(prev => {
      if (prev.length <= 1) {
        return [createEditableRecord()];
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSaveClick = async () => {
    const sanitized: CnRecord[] = [];
    try {
      rows.forEach((row, idx) => {
        const name = row.LandCover.trim();
        if (!name) {
          throw new Error(`La fila ${idx + 1} no tiene Land Cover.`);
        }
        sanitized.push({
          LandCover: name,
          A: parseNumberField(row.A, `CN-A (fila ${idx + 1})`),
          B: parseNumberField(row.B, `CN-B (fila ${idx + 1})`),
          C: parseNumberField(row.C, `CN-C (fila ${idx + 1})`),
          D: parseNumberField(row.D, `CN-D (fila ${idx + 1})`),
        });
      });
      const seen = new Set<string>();
      sanitized.forEach(record => {
        const key = record.LandCover.toLowerCase();
        if (seen.has(key)) {
          throw new Error(`El valor "${record.LandCover}" está duplicado.`);
        }
        seen.add(key);
      });
    } catch (validationError) {
      const message =
        validationError instanceof Error ? validationError.message : String(validationError);
      setError(message);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave(sanitized);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[2200] p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-full max-w-5xl max-h-full flex flex-col">
        <div className="flex items-start justify-between p-4 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-white">Curve Number Table</h2>
            <p className="text-sm text-gray-300 mt-1">
              Edita los valores de Curve Number (CN) para cada Land Cover. Los cambios se aplican solo en
              esta sesión y se usarán inmediatamente al ejecutar "HydroCAD".
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            type="button"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        {error && (
          <div className="px-4 pt-4">
            <div className="bg-red-900/60 text-red-100 border border-red-700 rounded p-3 text-sm">
              {error}
            </div>
          </div>
        )}
        <div className="px-4 pt-4 pb-2 text-sm text-gray-400">
          {hasData
            ? 'Usa los campos numéricos para cada grupo hidrológico (A/B/C/D).'
            : 'Agrega filas para definir los valores de CN necesarios.'}
        </div>
        <div className="flex-1 overflow-auto px-4">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="text-gray-300 border-b border-gray-700">
                <th className="py-2 pr-2 font-medium">Land Cover</th>
                <th className="py-2 px-2 font-medium text-center">CN A</th>
                <th className="py-2 px-2 font-medium text-center">CN B</th>
                <th className="py-2 px-2 font-medium text-center">CN C</th>
                <th className="py-2 px-2 font-medium text-center">CN D</th>
                <th className="py-2 pl-2 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border-b border-gray-800 last:border-b-0">
                  <td className="py-2 pr-2 align-top">
                    <input
                      type="text"
                      value={row.LandCover}
                      onChange={event => handleChange(index, 'LandCover', event.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Descripción de Land Cover"
                    />
                  </td>
                  {(['A', 'B', 'C', 'D'] as const).map(field => (
                    <td key={field} className="py-2 px-2 align-top">
                      <input
                        type="number"
                        step="0.01"
                        min={0}
                        max={100}
                        value={row[field]}
                        onChange={event => handleChange(index, field, event.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </td>
                  ))}
                  <td className="py-2 pl-2 text-center align-top">
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(index)}
                      className="px-2 py-1 text-sm text-red-300 hover:text-red-200"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-700 flex items-center justify-between">
          <button
            type="button"
            onClick={handleAddRow}
            className="px-3 py-1.5 rounded bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-700"
          >
            Añadir fila
          </button>
          <div className="space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveClick}
              className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-60"
              disabled={saving}
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
