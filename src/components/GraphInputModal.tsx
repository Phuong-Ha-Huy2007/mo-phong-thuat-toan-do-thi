import React, { useState } from 'react';
import { GraphData, Vertex, Edge } from '../types/graph';
import { X, Check, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';
import { SAMPLE_GRAPHS } from '../data/sampleGraphs';

interface GraphInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyGraph: (graph: GraphData) => void;
}

export const GraphInputModal: React.FC<GraphInputModalProps> = ({
  isOpen,
  onClose,
  onApplyGraph,
}) => {
  const [verticesInput, setVerticesInput] = useState('A, B, C, D, E');
  const [edgesInput, setEdgesInput] = useState(
    'A-B: 4\nA-C: 2\nA-D: 5\nB-C: 1\nB-D: 6\nC-D: 3\nC-E: 7\nD-E: 2'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApply = () => {
    setErrorMessage(null);

    // 1. Parse Vertices
    let vertexNames: string[] = [];
    const rawVertices = verticesInput.trim();

    if (!rawVertices) {
      setErrorMessage('Vui lòng nhập danh sách đỉnh!');
      return;
    }

    // Check if user entered a number like "5"
    if (/^\d+$/.test(rawVertices)) {
      const count = parseInt(rawVertices, 10);
      if (count < 2 || count > 20) {
        setErrorMessage('Số đỉnh phải từ 2 đến 20!');
        return;
      }
      for (let i = 0; i < count; i++) {
        vertexNames.push(String.fromCharCode(65 + i)); // A, B, C...
      }
    } else {
      // Split by comma or space
      vertexNames = rawVertices
        .split(/[,;\s]+/)
        .map(v => v.trim().toUpperCase())
        .filter(v => v.length > 0);
      
      // Deduplicate
      vertexNames = Array.from(new Set(vertexNames));

      if (vertexNames.length < 2) {
        setErrorMessage('Đồ thị phải có ít nhất 2 đỉnh!');
        return;
      }
      if (vertexNames.length > 26) {
        setErrorMessage('Đồ thị hỗ trợ tối đa 26 đỉnh để hiển thị tối ưu!');
        return;
      }
    }

    // Generate circular layout coordinates
    const centerX = 350;
    const centerY = 260;
    const radius = Math.min(180, 70 + vertexNames.length * 15);

    const vertices: Vertex[] = vertexNames.map((name, i) => {
      const angle = (2 * Math.PI * i) / vertexNames.length - Math.PI / 2;
      return {
        id: name,
        label: name,
        x: Math.round(centerX + radius * Math.cos(angle)),
        y: Math.round(centerY + radius * Math.sin(angle)),
      };
    });

    // 2. Parse Edges
    const lines = edgesInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const edges: Edge[] = [];
    const edgeSet = new Set<string>();

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      // Format examples: "A-B: 4", "A-B 4", "A B 4", "A-B", "A B"
      // Regex matches: vertex1, vertex2, optional weight
      const match = line.match(/^([A-Za-z0-9]+)[\s\-–—:,]+([A-Za-z0-9]+)(?:[\s\-–—:,]+([0-9.]+))?$/);

      if (!match) {
        setErrorMessage(
          `Dòng ${lineIndex + 1} không hợp lệ: "${line}". Định dạng chuẩn: "A-B: 4" hoặc "A B 4" hoặc "A-B"`
        );
        return;
      }

      const u = match[1].toUpperCase();
      const v = match[2].toUpperCase();
      const weight = match[3] ? parseFloat(match[3]) : 1;

      if (!vertexNames.includes(u)) {
        setErrorMessage(`Đỉnh "${u}" ở dòng ${lineIndex + 1} chưa được định nghĩa trong danh sách đỉnh!`);
        return;
      }
      if (!vertexNames.includes(v)) {
        setErrorMessage(`Đỉnh "${v}" ở dòng ${lineIndex + 1} chưa được định nghĩa trong danh sách đỉnh!`);
        return;
      }
      if (u === v) {
        setErrorMessage(`Dòng ${lineIndex + 1}: Thuật toán không hỗ trợ khuyên (cạnh từ đỉnh đến chính nó: ${u}-${v})!`);
        return;
      }

      // Check duplicate edge in undirected graph
      const key1 = `${u}-${v}`;
      const key2 = `${v}-${u}`;
      if (edgeSet.has(key1) || edgeSet.has(key2)) {
        // Skip duplicate or warn
        continue;
      }

      edgeSet.add(key1);
      edges.push({
        id: `e_${u}_${v}_${lineIndex}`,
        u,
        v,
        weight: isNaN(weight) ? 1 : weight,
      });
    }

    if (edges.length === 0) {
      setErrorMessage('Đồ thị phải có ít nhất 1 cạnh!');
      return;
    }

    // Success!
    onApplyGraph({ vertices, edges });
    onClose();
  };

  const loadPreset = (presetKey: string) => {
    const preset = SAMPLE_GRAPHS[presetKey];
    if (!preset) return;
    setVerticesInput(preset.data.vertices.map(v => v.label).join(', '));
    setEdgesInput(
      preset.data.edges.map(e => `${e.u}-${e.v}: ${e.weight}`).join('\n')
    );
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Tạo đồ thị tùy chỉnh
            </h3>
            <p className="text-xs text-slate-500">
              Nhập số đỉnh / danh sách đỉnh và các cạnh kèm trọng số
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Quick Presets */}
          <div>
            <div className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Nạp nhanh dữ liệu mẫu:
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => loadPreset('eulerDefault')}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors"
              >
                Mẫu Euler
              </button>
              <button
                type="button"
                onClick={() => loadPreset('hamiltonDefault')}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors"
              >
                Mẫu Hamilton
              </button>
              <button
                type="button"
                onClick={() => loadPreset('mstDefault')}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors"
              >
                Mẫu Kruskal/Prim
              </button>
              <button
                type="button"
                onClick={() => loadPreset('dijkstraNetwork')}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors"
              >
                Mẫu Dijkstra
              </button>
            </div>
          </div>

          {/* Vertices Input */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              1. Danh sách đỉnh (hoặc nhập số lượng đỉnh):
            </label>
            <input
              type="text"
              value={verticesInput}
              onChange={e => setVerticesInput(e.target.value)}
              placeholder="Ví dụ: A, B, C, D, E hoặc 5"
              className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:bg-white focus:outline-indigo-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Nhập các tên đỉnh cách nhau bằng dấu phẩy hoặc khoảng trắng (A, B, C, D...)
            </p>
          </div>

          {/* Edges Input */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              2. Danh sách cạnh (Mỗi dòng một cạnh):
            </label>
            <textarea
              rows={6}
              value={edgesInput}
              onChange={e => setEdgesInput(e.target.value)}
              placeholder="Định dạng: Đỉnh1-Đỉnh2: TrọngSố (Ví dụ: A-B: 4)"
              className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg p-3 focus:bg-white focus:outline-indigo-500 leading-relaxed"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Định dạng hỗ trợ: <code className="bg-slate-100 px-1 py-0.5 rounded">A-B: 4</code>, <code className="bg-slate-100 px-1 py-0.5 rounded">A B 4</code>, hoặc không trọng số <code className="bg-slate-100 px-1 py-0.5 rounded">A-B</code>
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Lỗi nhập liệu: </span>
                {errorMessage}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Tạo đồ thị</span>
          </button>
        </div>
      </div>
    </div>
  );
};
