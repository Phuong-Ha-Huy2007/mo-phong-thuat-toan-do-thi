import React from 'react';
import { 
  GitFork, 
  Sparkles, 
  MapPin, 
  Repeat, 
  Milestone, 
  Scale, 
  Play, 
  RotateCcw,
  CheckCircle2,
  Clock,
  CheckSquare
} from 'lucide-react';
import { AlgorithmType, Vertex } from '../types/graph';
import { ALGORITHM_METADATA } from '../algorithms/metadata';

interface SidebarProps {
  currentAlgorithm: AlgorithmType;
  onSelectAlgorithm: (algo: AlgorithmType) => void;
  vertices: Vertex[];
  // Parameters
  eulerStartVertex: string;
  onChangeEulerStart: (v: string) => void;
  hamiltonMode: 'path' | 'circuit';
  onChangeHamiltonMode: (m: 'path' | 'circuit') => void;
  hamiltonStartVertex: string;
  onChangeHamiltonStart: (v: string) => void;
  primStartVertex: string;
  onChangePrimStart: (v: string) => void;
  dijkstraSource: string;
  onChangeDijkstraSource: (v: string) => void;
  dijkstraTarget: string;
  onChangeDijkstraTarget: (v: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentAlgorithm,
  onSelectAlgorithm,
  vertices,
  eulerStartVertex,
  onChangeEulerStart,
  hamiltonMode,
  onChangeHamiltonMode,
  hamiltonStartVertex,
  onChangeHamiltonStart,
  primStartVertex,
  onChangePrimStart,
  dijkstraSource,
  onChangeDijkstraSource,
  dijkstraTarget,
  onChangeDijkstraTarget,
}) => {
  const navItems = [
    {
      id: 'euler' as AlgorithmType,
      name: '1. Thuật toán Euler',
      subtitle: 'Đường đi & Chu trình Euler',
      icon: Repeat,
      badge: 'Cạnh',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'hamilton' as AlgorithmType,
      name: '2. Thuật toán Hamilton',
      subtitle: 'Quay lui (Backtracking)',
      icon: Milestone,
      badge: 'Đỉnh',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'kruskal' as AlgorithmType,
      name: '3. Thuật toán Kruskal',
      subtitle: 'Cây khung nhỏ nhất (MST)',
      icon: GitFork,
      badge: 'Greedy',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'prim' as AlgorithmType,
      name: '4. Thuật toán Prim',
      subtitle: 'Mở rộng lát cắt (Cut MST)',
      icon: Sparkles,
      badge: 'Greedy',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'dijkstra' as AlgorithmType,
      name: '5. Thuật toán Dijkstra',
      subtitle: 'Đường đi ngắn nhất 1 nguồn',
      icon: MapPin,
      badge: 'SSSP',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      id: 'compare' as AlgorithmType,
      name: '6. So sánh thuật toán',
      subtitle: 'Bảng đối chiếu tổng hợp',
      icon: Scale,
      badge: 'Báo cáo',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    },
  ];

  const currentMeta = ALGORITHM_METADATA[currentAlgorithm];

  return (
    <aside className="w-80 shrink-0 bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-57px)] overflow-y-auto select-none">
      {/* Navigation List */}
      <div className="p-3 border-b border-slate-100">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
          Danh mục thuật toán
        </div>
        <div className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentAlgorithm === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectAlgorithm(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-950 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate leading-tight">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                      {item.subtitle}
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] font-medium border px-1.5 py-0.5 rounded-sm shrink-0 ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Algorithm Config Section (Only if not in compare mode) */}
      {currentAlgorithm !== 'compare' && (
        <div className="p-3.5 border-b border-slate-100 bg-slate-50/60">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2.5 flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
            Cấu hình tham số mô phỏng
          </div>

          {/* EULER CONFIG */}
          {currentAlgorithm === 'euler' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Đỉnh xuất phát ưu tiên:
              </label>
              <select
                value={eulerStartVertex}
                onChange={e => onChangeEulerStart(e.target.value)}
                className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-indigo-500 focus:border-indigo-500"
              >
                {vertices.map(v => (
                  <option key={v.id} value={v.id}>
                    Đỉnh {v.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 italic">
                *Nếu đồ thị có 2 đỉnh bậc lẻ, đường đi Euler sẽ tự động bắt đầu từ một trong hai đỉnh đó.
              </p>
            </div>
          )}

          {/* HAMILTON CONFIG */}
          {currentAlgorithm === 'hamilton' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Mục tiêu tìm kiếm:
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/70 rounded-lg">
                  <button
                    onClick={() => onChangeHamiltonMode('path')}
                    className={`text-xs py-1 px-2 rounded-md font-medium transition-colors ${
                      hamiltonMode === 'path'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Đường đi
                  </button>
                  <button
                    onClick={() => onChangeHamiltonMode('circuit')}
                    className={`text-xs py-1 px-2 rounded-md font-medium transition-colors ${
                      hamiltonMode === 'circuit'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Chu trình
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Đỉnh bắt đầu duyệt (Gốc đệ quy):
                </label>
                <select
                  value={hamiltonStartVertex}
                  onChange={e => onChangeHamiltonStart(e.target.value)}
                  className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-indigo-500"
                >
                  {vertices.map(v => (
                    <option key={v.id} value={v.id}>
                      Đỉnh {v.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* KRUSKAL CONFIG */}
          {currentAlgorithm === 'kruskal' && (
            <div className="space-y-2">
              <div className="text-xs text-slate-600 bg-blue-50/70 border border-blue-200/70 p-2.5 rounded-lg leading-relaxed">
                Kruskal xét <strong>toàn cục</strong> danh sách cạnh đã sắp xếp trọng số tăng dần và dùng <strong>Union-Find (DSU)</strong> để tránh chu trình. Không phụ thuộc đỉnh bắt đầu.
              </div>
            </div>
          )}

          {/* PRIM CONFIG */}
          {currentAlgorithm === 'prim' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Đỉnh xuất phát gieo mầm cây khung (s):
              </label>
              <select
                value={primStartVertex}
                onChange={e => onChangePrimStart(e.target.value)}
                className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-indigo-500"
              >
                {vertices.map(v => (
                  <option key={v.id} value={v.id}>
                    Đỉnh {v.label} (Mặc định A)
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 italic">
                *Prim mở rộng cây từ tập V_new = &#123;{primStartVertex}&#125;.
              </p>
            </div>
          )}

          {/* DIJKSTRA CONFIG */}
          {currentAlgorithm === 'dijkstra' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Đỉnh nguồn (Source S):
                </label>
                <select
                  value={dijkstraSource}
                  onChange={e => onChangeDijkstraSource(e.target.value)}
                  className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-indigo-500"
                >
                  {vertices.map(v => (
                    <option key={v.id} value={v.id}>
                      Đỉnh {v.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Đỉnh đích (Target T):
                </label>
                <select
                  value={dijkstraTarget}
                  onChange={e => onChangeDijkstraTarget(e.target.value)}
                  className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-indigo-500"
                >
                  {vertices.map(v => (
                    <option key={v.id} value={v.id}>
                      Đỉnh {v.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Theory & Complexity Card for Current Algorithm */}
      <div className="p-3.5 mt-auto">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Độ phức tạp
            </span>
            <span className="font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded text-[11px] font-semibold">
              {currentMeta.timeComplexity}
            </span>
          </div>

          <div>
            <div className="font-semibold text-slate-700 text-[11px] mb-1">
              Điều kiện áp dụng:
            </div>
            <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-3.5">
              {currentMeta.conditions.slice(0, 2).map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
};
