import React from 'react';
import { 
  Network, 
  Sparkles, 
  FileCode, 
  PlusCircle, 
  FolderOpen, 
  Camera, 
  BookOpen 
} from 'lucide-react';

interface HeaderProps {
  onOpenSampleModal: () => void;
  onOpenCustomGraphModal: () => void;
  onOpenTheoryModal: () => void;
  onOpenStandaloneModal: () => void;
  onCaptureScreenshot: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSampleModal,
  onOpenCustomGraphModal,
  onOpenTheoryModal,
  onOpenStandaloneModal,
  onCaptureScreenshot,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-2.5 flex items-center justify-between shadow-xs select-none sticky top-0 z-30">
      {/* Brand & Academic context */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
          <Network className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base lg:text-lg font-bold text-slate-900 tracking-tight">
              MÔ PHỎNG THUẬT TOÁN ĐỒ THỊ
            </h1>
            <span className="hidden sm:inline-block text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
              Toán rời rạc
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden md:block">
            Graph Algorithm Simulator · Trực quan hóa từng bước 5 thuật toán kinh điển
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSampleModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors cursor-pointer"
          title="Chọn đồ thị mẫu có sẵn"
        >
          <FolderOpen className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Đồ thị mẫu</span>
        </button>

        <button
          onClick={onOpenCustomGraphModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors cursor-pointer"
          title="Tự nhập đỉnh và danh sách cạnh"
        >
          <PlusCircle className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Nhập đồ thị</span>
        </button>

        <button
          onClick={onOpenTheoryModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors cursor-pointer"
          title="Xem lý thuyết, điều kiện áp dụng & mã giả"
        >
          <BookOpen className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Lý thuyết</span>
        </button>

        <button
          onClick={onCaptureScreenshot}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors cursor-pointer"
          title="Chụp ảnh đồ thị để chèn vào báo cáo"
        >
          <Camera className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Chụp báo cáo</span>
        </button>

        <button
          onClick={onOpenStandaloneModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors cursor-pointer"
          title="Xem & Tải mã nguồn thuần HTML/CSS/JS (1 file duy nhất)"
        >
          <FileCode className="w-4 h-4" />
          <span className="hidden sm:inline">Mã nguồn thuần HTML/JS</span>
          <span className="sm:hidden">Mã nguồn</span>
        </button>
      </div>
    </header>
  );
};
