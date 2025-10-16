import React, { useEffect, useMemo, useState } from 'react';
import { CN_HYDRO_GROUPS, CnHydrologicGroup, CnRecord } from '../utils/landcover';

interface CnTableModalProps {
  records: CnRecord[];
  onClose: () => void;
  onSave: (records: CnRecord[]) => void;
  saving: boolean;
  error?: string | null;
  allowEditing?: boolean;
}

type EditableRow = {
  id: string;
  landCover: string;
  values: Record<CnHydrologicGroup, string>;
};

const createRowId = (() => {
  let counter = 0;
  return () => {
    counter += 1;
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      try {
        return crypto.randomUUID();
      } catch (_) {
        // ignore and use fallback
      }
    }
    return `cn-row-${Date.now()}-${counter}`;
  };
})();

const createEditableRow = (record?: CnRecord, id?: string): EditableRow => ({
  id: id ?? createRowId(),
  landCover: record ? record.LandCover : '',
  values: CN_HYDRO_GROUPS.reduce((acc, group) => {
    acc[group] = record ? String(record[group]) : '';
    return acc;
  }, {} as Record<CnHydrologicGroup, string>),
});

const CnTableModal: React.FC<CnTableModalProps> = ({
  records,
  onClose,
  onSave,
  saving,
  error,
  allowEditing = true,
}) => {
  const [rows, setRows] = useState<EditableRow[]>(() =>
    records.map((record, index) => createEditableRow(record, `row-${index}`))
  );
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setRows(records.map((record, index) => createEditableRow(record, `row-${index}`)));
  }, [records]);

  const hasChanges = useMemo(() => {
    if (rows.length !== records.length) return true;
    return rows.some((row, index) => {
      const source = records[index];
      if (!source) return true;
      if (row.landCover.trim() !== source.LandCover) return true;
      return CN_HYDRO_GROUPS.some(group => {
        const raw = row.values[group].trim();
        if (raw === '') return true;
        const value = Number(raw);
        return !Number.isFinite(value) || value !== source[group];
      });
    });
  }, [rows, records]);

  const handleRowChange = (
    rowId: string,
    field: 'landCover' | CnHydrologicGroup,
    value: string
  ) => {
    setRows(prev =>
      prev.map(row => {
        if (row.id !== rowId) return row;
        if (field === 'landCover') {
          return { ...row, landCover: value };
        }
        return {
          ...row,
          values: { ...row.values, [field]: value },
        };
      })
    );
  };

  const handleAddRow = () => {
    setRows(prev => [...prev, createEditableRow()]);
  };

  const handleRemoveRow = (rowId: string) => {
    setRows(prev => prev.filter(row => row.id !== rowId));
  };

  const parseRows = (): CnRecord[] | null => {
    const seen = new Set<string>();
    const normalized: CnRecord[] = [];

    for (const row of rows) {
      const name = row.landCover.trim();
      if (!name) {
        setLocalError('Cada fila debe tener un nombre de Land Cover.');
        return null;
      }
      const key = name.toLowerCase();
      if (seen.has(key)) {
        setLocalError('Los nombres de Land Cover deben ser únicos.');
        return null;
      }
      const record: CnRecord = {
        LandCover: name,
        A: 0,
        B: 0,
        C: 0,
        D: 0,
      };
      for (const group of CN_HYDRO_GROUPS) {
        const raw = row.values[group].trim();
        if (raw === '') {
          setLocalError('Todos los valores CN deben completarse.');
          return null;
        }
        const value = Number(raw);
        if (!Number.isFinite(value)) {
          setLocalError('Todos los valores CN deben ser números válidos.');
          return null;
        }
        record[group] = value;
      }
      seen.add(key);
      normalized.push(record);
    }

    setLocalError(null);
    return normalized;
  };

  const handleSave = () => {
    const normalized = parseRows();
    if (!normalized) return;
    onSave(normalized);
  };

  const disabled = !allowEditing;

  return (
    <div className="fixed inset-0 z-[2200] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-h-[90vh] max-w-4xl overflow-hidden rounded-lg border border-gray-600 bg-gray-900 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-3">
          <h2 className="text-lg font-semibold text-white">Curve Number Table</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-300 transition hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 py-4">
          {(error || localError) && (
            <div className="rounded border border-red-500 bg-red-900/40 px-3 py-2 text-sm text-red-200">
              {localError || error}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed border-collapse text-sm text-gray-100">
              <thead>
                <tr className="bg-gray-800 text-xs uppercase text-gray-300">
                  <th className="w-1/3 px-3 py-2 text-left">Land Cover</th>
                  {CN_HYDRO_GROUPS.map(group => (
                    <th key={group} className="px-3 py-2 text-center">{group}</th>
                  ))}
                  {allowEditing && <th className="w-16 px-3 py-2" />}
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.id} className="border-b border-gray-800">
                    <td className="px-3 py-2 align-top">
                      <input
                        type="text"
                        value={row.landCover}
                        onChange={e => handleRowChange(row.id, 'landCover', e.target.value)}
                        disabled={disabled}
                        className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </td>
                    {CN_HYDRO_GROUPS.map(group => (
                      <td key={group} className="px-3 py-2 align-top">
                        <input
                          type="number"
                          step="0.01"
                          value={row.values[group]}
                          onChange={e => handleRowChange(row.id, group, e.target.value)}
                          disabled={disabled}
                          className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </td>
                    ))}
                    {allowEditing && (
                      <td className="px-3 py-2 text-center align-middle">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(row.id)}
                          className="rounded border border-gray-600 px-2 py-1 text-xs text-gray-300 transition hover:border-red-500 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td
                      className="px-3 py-4 text-center text-sm text-gray-400"
                      colSpan={allowEditing ? CN_HYDRO_GROUPS.length + 2 : CN_HYDRO_GROUPS.length + 1}
                    >
                      No hay registros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-gray-700 bg-gray-800 px-4 py-3">
          <div className="text-xs text-gray-400">
            {allowEditing
              ? 'Los cambios se guardarán en el servidor y estarán disponibles en futuras sesiones.'
              : 'Visualización de solo lectura.'}
          </div>
          <div className="flex items-center gap-2">
            {allowEditing && (
              <button
                type="button"
                onClick={handleAddRow}
                disabled={saving}
                className="rounded border border-gray-600 px-3 py-1 text-sm text-gray-200 transition hover:border-cyan-500 hover:text-white"
              >
                Add row
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded border border-gray-600 px-3 py-1 text-sm text-gray-200 transition hover:border-gray-500 hover:text-white"
            >
              Cancel
            </button>
            {allowEditing && (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || rows.length === 0 || !hasChanges}
                className={`rounded px-4 py-1 text-sm font-semibold transition ${
                  saving || rows.length === 0 || !hasChanges
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-cyan-600 text-white hover:bg-cyan-700'
                }`}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CnTableModal;
