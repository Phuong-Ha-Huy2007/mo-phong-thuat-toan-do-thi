import React, { useState } from 'react';
import { STANDALONE_HTML_SOURCE } from '../utils/vanillaSourceCode';
import { X, Copy, Download, Check, FileCode, CheckCircle2 } from 'lucide-react';

interface StandaloneExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneExporterModal: React.FC<StandaloneExporterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(STANDALONE_HTML_SOURCE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([STANDALONE_HTML_SOURCE], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph_algorithm_simulator_vanilla.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Xuất mã nguồn thuần HTML5, CSS3 & JavaScript (Single File)
              </h3>
              <p className="text-xs text-slate-500">
                Tập tin độc lập 100% không phụ thuộc thư viện bên ngoài, mở chạy trực tiếp trên bất kỳ trình duyệt nào
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

        {/* Action Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đã đóng gói hoàn chỉnh: Euler, Hamilton, Kruskal, Prim, Dijkstra & SVG Canvas</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép!' : 'Sao chép mã nguồn'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file index.html</span>
            </button>
          </div>
        </div>

        {/* Code Preview */}
        <div className="p-6 overflow-hidden flex-1 flex flex-col bg-slate-950">
          <pre className="text-slate-200 font-mono text-xs overflow-auto flex-1 p-4 rounded-xl leading-relaxed">
            {STANDALONE_HTML_SOURCE}
          </pre>
        </div>
      </div>
    </div>
  );
};
