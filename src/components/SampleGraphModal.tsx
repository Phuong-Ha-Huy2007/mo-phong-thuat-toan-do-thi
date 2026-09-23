import React from 'react';
import { SAMPLE_GRAPHS } from '../data/sampleGraphs';
import { GraphData } from '../types/graph';
import { X, Check, ArrowRight } from 'lucide-react';

interface SampleGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (graph: GraphData) => void;
}

export const SampleGraphModal: React.FC<SampleGraphModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Thư viện đồ thị mẫu chuẩn
            </h3>
            <p className="text-xs text-slate-500">
              Chọn đồ thị đã được cấu hình tối ưu theo giáo trình Toán rời rạc
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Graphs */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3.5 overflow-y-auto">
          {Object.entries(SAMPLE_GRAPHS).map(([key, item]) => {
            const vertexCount = item.data.vertices.length;
            const edgeCount = item.data.edges.length;

            return (
              <div
                key={key}
                onClick={() => {
                  onSelectSample(item.data);
                  onClose();
                }}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {vertexCount} đỉnh, {edgeCount} cạnh
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-indigo-600">
                  <span>Sử dụng đồ thị này</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
