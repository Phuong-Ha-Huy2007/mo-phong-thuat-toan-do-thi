import React, { useState } from 'react';
import { ALGORITHM_METADATA } from '../algorithms/metadata';
import { AlgorithmType } from '../types/graph';
import { X, BookOpen, Clock, ShieldCheck, Code2, Copy, Check } from 'lucide-react';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAlgo?: AlgorithmType;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({
  isOpen,
  onClose,
  defaultAlgo = 'euler',
}) => {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmType>(
    defaultAlgo === 'compare' ? 'euler' : defaultAlgo
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const current = ALGORITHM_METADATA[selectedAlgo];

  const handleCopyPseudocode = () => {
    navigator.clipboard.writeText(current.pseudocode.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: AlgorithmType; label: string }[] = [
    { id: 'euler', label: 'Euler' },
    { id: 'hamilton', label: 'Hamilton' },
    { id: 'kruskal', label: 'Kruskal' },
    { id: 'prim', label: 'Prim' },
    { id: 'dijkstra', label: 'Dijkstra' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Lý thuyết, Điều kiện áp dụng & Mã giả
              </h3>
              <p className="text-xs text-slate-500">
                Tài liệu phục vụ học tập và viết báo cáo môn Toán rời rạc
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 gap-2 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedAlgo(tab.id)}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                selectedAlgo === tab.id
                  ? 'border-indigo-600 text-indigo-700 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Overview */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">{current.name}</h4>
            <p className="text-slate-600 leading-relaxed">{current.problem}</p>
          </div>

          {/* Core Idea */}
          <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-xl">
            <div className="font-bold text-indigo-950 mb-1">Ý tưởng thuật toán:</div>
            <p className="text-slate-700 leading-relaxed">{current.coreIdea}</p>
          </div>

          {/* Complexity & Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                Độ phức tạp tính toán
              </div>
              <div className="space-y-1 text-slate-700">
                <div>• Thời gian: <strong className="font-mono text-indigo-700">{current.timeComplexity}</strong></div>
                <div>• Không gian: <strong className="font-mono text-indigo-700">{current.spaceComplexity}</strong></div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Điều kiện áp dụng & Định lý
              </div>
              <ul className="space-y-1 text-slate-700 list-disc pl-4">
                {current.conditions.map((cond, idx) => (
                  <li key={idx}>{cond}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pseudocode */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-slate-700" />
                Mã giả (Pseudocode)
              </span>
              <button
                onClick={handleCopyPseudocode}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md border border-slate-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép mã giả'}</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
              {current.pseudocode.join('\n')}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
