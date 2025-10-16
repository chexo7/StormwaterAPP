import React, { useEffect, useState } from 'react';
import type { CnRecord } from '../utils/landcover';

type DraftRecord = {
  LandCover: string;
  A: string;
  B: string;
  C: string;
  D: string;
};

interface CnTableModalProps {
  records: CnRecord[];
  onClose: () => void;
  onSave: (records: CnRecord[]) => Promise<void> | void;
}

const emptyRow = (): DraftRecord => ({ LandCover: '', A: '', B: '', C: '', D: '' });

const toDraftRecord = (record: CnRecord): DraftRecord => ({
  LandCover: record.LandCover ?? '',
  A: String(record.A ?? ''),
  B: String(record.B ?? ''),
  C: String(record.C ?? ''),
  D: String(record.D ?? ''),
});

const CnTableModal: React.FC<CnTableModalProps> = ({ records, onClose, onSave }) => {
  const [draft, setDraft] = useState<DraftRecord[]>(() =>
    records.length > 0 ? records.map(toDraftRecord) : [emptyRow()]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(records.length > 0 ? records.map(toDraftRecord) : [emptyRow()]);
  }, [records]);

  const handleChange = (index: number, field: keyof DraftRecord, value: string) => {
    setDraft(prev =>
      prev.map((row, idx) => (idx === index ? { ...row, [field]: value } : row))
    );
  };

  const handleRemoveRow = (index: number) => {
    setDraft(prev => {
      if (prev.length === 1) {
        return [emptyRow()];
      }
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const handleAddRow = () => {
    setDraft(prev => [...prev, emptyRow()]);
  };

  const parseNumber = (
    value: string,
    label: string,
    rowIndex: number
  ): number | null => {
    if (value.trim() === '') {
      setError(`Fila ${rowIndex + 1}: completa el valor ${label}.`);
      return null;
    }
    const num = Number(value);
    if (!Number.isFinite(num)) {
      setError(`Fila ${rowIndex + 1}: ${label} debe ser un número válido.`);
      return null;
    }
    return num;
  };

  const handleSave = async () => {
    setError(null);
    const cleaned: CnRecord[] = [];
    const seen = new Map<string, string>();

    for (let i = 0; i < draft.length; i += 1) {
      const row = draft[i];
      const landCover = row.LandCover.trim();
      const allEmpty =
        landCover === '' &&
        row.A.trim() === '' &&
        row.B.trim() === '' &&
        row.C.trim() === '' &&
        row.D.trim() === '';

      if (allEmpty) {
        continue;
      }

      if (!landCover) {
        setError(`Fila ${i + 1}: ingresa un valor para Land Cover.`);
        return;
      }

      const key = landCover.toLowerCase();
      if (seen.has(key)) {
        setError(
          `Fila ${i + 1}: el Land Cover "${landCover}" duplica a "${seen.get(
            key
          )}".`
        );
        return;
      }

      const a = parseNumber(row.A, 'CN (HSG A)', i);
      if (a === null) return;
      const b = parseNumber(row.B, 'CN (HSG B)', i);
      if (b === null) return;
      const c = parseNumber(row.C, 'CN (HSG C)', i);
      if (c === null) return;
      const d = parseNumber(row.D, 'CN (HSG D)', i);
      if (d === null) return;

      seen.set(key, landCover);
      cleaned.push({ LandCover: landCover, A: a, B: b, C: c, D: d });
    }

    if (cleaned.length === 0) {
      setError('Agrega al menos un registro de Curve Number.');
      return;
    }

    setSaving(true);
    try {
      await onSave(cleaned);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  const hasRemovableRows = draft.length > 1;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000]">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 w-[52rem] max-h-[80vh] flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Curve Number Table</h2>
          <button className="text-gray-400 hover:text-white" onClick={onClose} disabled={saving}>
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-auto border border-gray-700 rounded">
          <table className="w-full text-sm text-gray-200">
            <thead className="bg-gray-700 text-gray-100 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left w-10">#</th>
                <th className="px-3 py-2 text-left">Land Cover</th>
                <th className="px-3 py-2 text-left w-28">CN (HSG A)</th>
                <th className="px-3 py-2 text-left w-28">CN (HSG B)</th>
                <th className="px-3 py-2 text-left w-28">CN (HSG C)</th>
                <th className="px-3 py-2 text-left w-28">CN (HSG D)</th>
                <th className="px-3 py-2 text-left w-24">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {draft.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}
                >
                  <td className="px-3 py-2 text-gray-400 align-top">{index + 1}</td>
                  <td className="px-3 py-2">
                    <input
                      className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={row.LandCover}
                      onChange={e => handleChange(index, 'LandCover', e.target.value)}
                      placeholder="Land Cover"
                      disabled={saving}
                    />
                  </td>
                  {(['A', 'B', 'C', 'D'] as (keyof DraftRecord)[]).map(field => (
                    <td key={field} className="px-3 py-2">
                      <input
                        type="number"
                        step="0.1"
                        className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        value={row[field]}
                        onChange={e => handleChange(index, field, e.target.value)}
                        placeholder="0"
                        disabled={saving}
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2 text-center">
                    <button
                      className={
                        'px-3 py-1 rounded text-sm ' +
                        (hasRemovableRows
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed')
                      }
                      onClick={() => handleRemoveRow(index)}
                      disabled={saving || !hasRemovableRows}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex justify-between items-center">
          <button
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
            onClick={handleAddRow}
            disabled={saving}
          >
            Add row
          </button>
          <div className="space-x-2">
            <button
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className={
                'px-4 py-2 rounded font-semibold ' +
                (saving
                  ? 'bg-cyan-700 text-white cursor-progress'
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white')
              }
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CnTableModal;
