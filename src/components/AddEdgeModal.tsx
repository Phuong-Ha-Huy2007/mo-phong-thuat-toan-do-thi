import React, { useState } from 'react';
import { Vertex } from '../types/graph';
import { X, Check } from 'lucide-react';

interface AddEdgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  vertices: Vertex[];
  onAddEdge: (u: string, v: string, weight: number) => void;
}

export const AddEdgeModal: React.FC<AddEdgeModalProps> = ({
  isOpen,
  onClose,
  vertices,
  onAddEdge,
}) => {
  const [u, setU] = useState(vertices[0]?.id || 'A');
  const [v, setV] = useState(vertices[1]?.id || 'B');
  const [weight, setWeight] = useState('3');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (u === v) {
      setError('Hai đầu mút của cạnh phải là 2 đỉnh phân biệt!');
      return;
    }
    const numWeight = parseFloat(weight);
    if (isNaN(numWeight)) {
      setError('Trọng số phải là số hợp lệ!');
      return;
    }
    onAddEdge(u, v, numWeight);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Thêm cạnh mới</h3>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Đỉnh đầu mút 1:</label>
            <select
              value={u}
              onChange={e => setU(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
            >
              {vertices.map(vert => (
                <option key={vert.id} value={vert.id}>
                  Đỉnh {vert.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Đỉnh đầu mút 2:</label>
            <select
              value={v}
              onChange={e => setV(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
            >
              {vertices.map(vert => (
                <option key={vert.id} value={vert.id}>
                  Đỉnh {vert.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Trọng số cạnh:</label>
            <input
              type="number"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
            />
          </div>

          {error && <div className="text-rose-600 text-[11px] font-semibold">{error}</div>}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
            >
              Thêm cạnh
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
