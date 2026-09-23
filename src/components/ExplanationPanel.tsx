import React from 'react';
import { 
  Step, 
  AlgorithmType 
} from '../types/graph';
import { EulerStateData } from '../algorithms/euler';
import { HamiltonStateData } from '../algorithms/hamilton';
import { KruskalStateData } from '../algorithms/kruskal';
import { PrimStateData } from '../algorithms/prim';
import { DijkstraStateData } from '../algorithms/dijkstra';
import { 
  CheckCircle, 
  HelpCircle, 
  AlertTriangle, 
  Info, 
  Layers, 
  Check, 
  X, 
  Calculator,
  Trophy,
  ArrowRight
} from 'lucide-react';

interface ExplanationPanelProps {
  algorithmType: AlgorithmType;
  currentStep?: Step;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  algorithmType,
  currentStep,
}) => {
  if (!currentStep) {
    return (
      <div className="w-96 shrink-0 bg-white border-l border-slate-200 p-5 flex items-center justify-center text-slate-400 text-xs">
        Đang tải trạng thái mô phỏng...
      </div>
    );
  }

  const { title, description, formula, stateData, isFinished, resultSummary } = currentStep;

  return (
    <aside className="w-96 shrink-0 bg-white border-l border-slate-200 flex flex-col h-[calc(100vh-57px-74px)] overflow-y-auto select-none">
      {/* 1. Step Title & Description Card */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
          <Info className="w-3.5 h-3.5" />
          Giải thích bước hiện tại
        </div>
        <h3 className="text-sm font-bold text-slate-900 leading-snug">
          {title}
        </h3>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
          {description}
        </p>

        {/* Math formula if present (e.g. Dijkstra relaxation) */}
        {formula && (
          <div className="mt-3 p-2.5 bg-indigo-50/80 border border-indigo-200 rounded-lg flex items-start gap-2">
            <Calculator className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs font-mono font-medium text-indigo-950 overflow-x-auto">
              {formula}
            </div>
          </div>
        )}
      </div>

      {/* 2. Algorithm Specific Dynamic Data Tables */}
      <div className="p-4 flex-1 space-y-4">
        {/* ================= EULER TABLE ================= */}
        {algorithmType === 'euler' && stateData && (
          (() => {
            const eulerData = stateData as EulerStateData;
            return (
              <div className="space-y-4">
                {/* Degree Table */}
                <div>
                  <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
                    <span>Bảng bậc các đỉnh deg(v):</span>
                    <span className="text-[11px] font-normal text-slate-500">
                      Bậc lẻ: <strong className="text-rose-600">{eulerData.oddCount}</strong>
                    </span>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-1.5 px-3">Đỉnh</th>
                          <th className="py-1.5 px-3">Bậc deg(v)</th>
                          <th className="py-1.5 px-3">Tính chẵn lẻ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {eulerData.degrees.map(d => (
                          <tr key={d.vertexId} className={d.isOdd ? 'bg-rose-50/50' : 'bg-white'}>
                            <td className="py-1.5 px-3 font-bold text-slate-900">{d.label}</td>
                            <td className="py-1.5 px-3">{d.degree}</td>
                            <td className="py-1.5 px-3">
                              {d.isOdd ? (
                                <span className="text-rose-600 font-semibold font-sans">Bậc lẻ</span>
                              ) : (
                                <span className="text-emerald-600 font-sans">Bậc chẵn</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Traversed Path */}
                {eulerData.pathSoFar.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Hành trình đã duyệt:
                    </div>
                    <div className="text-xs font-bold text-indigo-700 font-mono flex flex-wrap items-center gap-1">
                      {eulerData.pathSoFar.map((v, idx) => (
                        <React.Fragment key={idx}>
                          <span>{v}</span>
                          {idx < eulerData.pathSoFar.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-slate-400 inline" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()
        )}

        {/* ================= HAMILTON TABLE ================= */}
        {algorithmType === 'hamilton' && stateData && (
          (() => {
            const hData = stateData as HamiltonStateData;
            return (
              <div className="space-y-3.5">
                {/* Current path */}
                <div className="bg-purple-50/60 border border-purple-200 rounded-lg p-3">
                  <div className="text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-1">
                    Đường đi hiện tại ({hData.currentPath.length} đỉnh):
                  </div>
                  <div className="text-xs font-bold font-mono text-purple-950 flex flex-wrap items-center gap-1">
                    {hData.currentPath.length > 0 ? (
                      hData.currentPath.map((v, i) => (
                        <React.Fragment key={i}>
                          <span className="bg-white border border-purple-300 px-1.5 py-0.5 rounded shadow-xs">
                            {v}
                          </span>
                          {i < hData.currentPath.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-purple-400" />
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <span className="text-slate-400 font-normal">Chưa có</span>
                    )}
                  </div>
                </div>

                {/* Visited & Unvisited list */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
                    <div className="font-bold text-emerald-800 text-[11px] mb-1">
                      Đỉnh đã đi qua ({hData.visitedList.length}):
                    </div>
                    <div className="font-mono text-emerald-950">
                      {hData.visitedList.join(', ') || 'Chưa có'}
                    </div>
                  </div>
                  <div className="bg-slate-100 border border-slate-200 rounded-lg p-2.5">
                    <div className="font-bold text-slate-700 text-[11px] mb-1">
                      Đỉnh chưa đi qua ({hData.unvisitedList.length}):
                    </div>
                    <div className="font-mono text-slate-800">
                      {hData.unvisitedList.join(', ') || 'Hết'}
                    </div>
                  </div>
                </div>

                {/* Backtrack status */}
                {hData.isBacktracking && (
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-xs text-rose-800 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Đang quay lui (Backtracking):</span>
                      <div className="text-[11px] mt-0.5">{hData.backtrackReason}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()
        )}

        {/* ================= KRUSKAL TABLE ================= */}
        {algorithmType === 'kruskal' && stateData && (
          (() => {
            const kData = stateData as KruskalStateData;
            return (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Bảng các cạnh đã sắp xếp:</span>
                  <span className="text-indigo-600 font-mono">
                    W(MST) = {kData.totalMSTWeight}
                  </span>
                </div>

                {/* Edge table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden max-h-56 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-1.5 px-2.5">STT</th>
                        <th className="py-1.5 px-2.5">Cạnh</th>
                        <th className="py-1.5 px-2.5">Trọng số</th>
                        <th className="py-1.5 px-2.5">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {kData.edgeRows.map(row => {
                        let badgeBg = 'bg-slate-100 text-slate-600';
                        let badgeText = 'Chờ xét';
                        let rowBg = 'bg-white';

                        if (row.status === 'examining') {
                          badgeBg = 'bg-amber-100 text-amber-800 border-amber-300';
                          badgeText = 'Đang xét';
                          rowBg = 'bg-amber-50/50';
                        } else if (row.status === 'accepted') {
                          badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                          badgeText = 'Đã chọn';
                          rowBg = 'bg-emerald-50/40';
                        } else if (row.status === 'rejected') {
                          badgeBg = 'bg-rose-100 text-rose-800 border-rose-300';
                          badgeText = 'Bị loại';
                          rowBg = 'bg-rose-50/40';
                        }

                        return (
                          <tr key={row.id} className={rowBg}>
                            <td className="py-1.5 px-2.5 font-sans text-slate-500">{row.index}</td>
                            <td className="py-1.5 px-2.5 font-bold text-slate-900">{row.edgeLabel}</td>
                            <td className="py-1.5 px-2.5">{row.weight}</td>
                            <td className="py-1.5 px-2.5 font-sans">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold border ${badgeBg}`}>
                                {badgeText}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Disjoint Sets Component status */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    Các tập hợp rời nhau (DSU):
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs font-mono mt-1">
                    {Object.entries(kData.setGroups).map(([root, members]) => (
                      <span
                        key={root}
                        className="bg-white border border-slate-300 px-2 py-0.5 rounded text-[11px] text-slate-800 shadow-xs"
                      >
                        &#123;{members.join(', ')}&#125;
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()
        )}

        {/* ================= PRIM TABLE ================= */}
        {algorithmType === 'prim' && stateData && (
          (() => {
            const pData = stateData as PrimStateData;
            return (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Trạng thái lát cắt (Cut):</span>
                  <span className="text-amber-700 font-mono">
                    W(MST) = {pData.totalMSTWeight}
                  </span>
                </div>

                {/* Sets V_new vs V \ V_new */}
                <div className="space-y-2 text-xs">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
                    <div className="font-bold text-emerald-800 text-[11px] mb-0.5">
                      Tập đỉnh đã chọn (V_new):
                    </div>
                    <div className="font-mono text-emerald-950 font-bold">
                      &#123;{pData.selectedVertices.join(', ')}&#125;
                    </div>
                  </div>

                  <div className="bg-slate-100 border border-slate-200 rounded-lg p-2.5">
                    <div className="font-bold text-slate-700 text-[11px] mb-0.5">
                      Tập đỉnh chưa chọn (V \ V_new):
                    </div>
                    <div className="font-mono text-slate-800">
                      &#123;{pData.unselectedVertices.join(', ') || '∅ (Đã hoàn tất)'}&#125;
                    </div>
                  </div>
                </div>

                {/* Candidate cut edges */}
                {pData.candidateEdges.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-slate-700 mb-1.5">
                      Cạnh ứng viên qua lát cắt (nối V_new ↔ V \ V_new):
                    </div>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {pData.candidateEdges.map(cand => (
                        <div
                          key={cand.id}
                          className={`p-2 rounded-lg border text-xs flex items-center justify-between font-mono ${
                            cand.isMinimum
                              ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{cand.edgeLabel}</span>
                            {cand.isMinimum && (
                              <span className="font-sans text-[10px] bg-amber-200 text-amber-900 px-1 rounded font-semibold">
                                Nhỏ nhất
                              </span>
                            )}
                          </div>
                          <span>Trọng số: {cand.weight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()
        )}

        {/* ================= DIJKSTRA TABLE ================= */}
        {algorithmType === 'dijkstra' && stateData && (
          (() => {
            const dData = stateData as DijkstraStateData;
            return (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Bảng khoảng cách & đỉnh trước:</span>
                  <span className="text-slate-500 font-normal">
                    Nguồn: <strong>{dData.source}</strong> → Đích: <strong>{dData.target}</strong>
                  </span>
                </div>

                {/* Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-1.5 px-3">Đỉnh</th>
                        <th className="py-1.5 px-3">Khoảng cách d(v)</th>
                        <th className="py-1.5 px-3">Đỉnh trước p(v)</th>
                        <th className="py-1.5 px-3">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {dData.table.map(row => {
                        let statusText = 'Chưa xét';
                        let statusColor = 'bg-slate-100 text-slate-600';
                        let rowBg = 'bg-white';

                        if (row.status === 'current') {
                          statusText = 'Đang xét';
                          statusColor = 'bg-amber-100 text-amber-800 border-amber-300';
                          rowBg = 'bg-amber-50/60';
                        } else if (row.status === 'finalized') {
                          statusText = 'Đã chốt';
                          statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                          rowBg = 'bg-emerald-50/40';
                        }

                        return (
                          <tr key={row.vertexId} className={rowBg}>
                            <td className="py-1.5 px-3 font-bold text-slate-900">{row.vertexId}</td>
                            <td className="py-1.5 px-3 font-bold text-indigo-700">{row.distDisplay}</td>
                            <td className="py-1.5 px-3 text-slate-600">{row.prev || '—'}</td>
                            <td className="py-1.5 px-3 font-sans">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold border ${statusColor}`}>
                                {statusText}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Shortest path if finished */}
                {dData.shortestPath.length > 0 && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                    <div className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider mb-1">
                      Đường đi ngắn nhất:
                    </div>
                    <div className="text-xs font-bold font-mono text-indigo-950 flex flex-wrap items-center gap-1.5">
                      {dData.shortestPath.map((v, i) => (
                        <React.Fragment key={i}>
                          <span className="bg-white border border-indigo-300 px-2 py-0.5 rounded shadow-xs">
                            {v}
                          </span>
                          {i < dData.shortestPath.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-indigo-400" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="text-xs text-indigo-800 font-semibold mt-2">
                      Tổng độ dài đường đi: {dData.totalDistance}
                    </div>
                  </div>
                )}
              </div>
            );
          })()
        )}
      </div>

      {/* 3. Final Result Card (Visible when finished) */}
      {isFinished && resultSummary && (
        <div className="p-4 bg-emerald-50 border-t border-emerald-200 mt-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4 text-emerald-600" />
            Kết quả cuối cùng
          </div>
          <p className="text-xs font-semibold text-emerald-950 leading-relaxed">
            {resultSummary}
          </p>
        </div>
      )}
    </aside>
  );
};
