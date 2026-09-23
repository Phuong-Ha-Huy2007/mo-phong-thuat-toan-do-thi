import React from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw,
  Gauge
} from 'lucide-react';

interface ControlBarProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  playbackSpeed: number; // in ms per step, e.g. 1000ms
  onTogglePlay: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
  onGoToStep: (stepIndex: number) => void;
  onChangeSpeed: (speedMs: number) => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  playbackSpeed,
  onTogglePlay,
  onNextStep,
  onPrevStep,
  onReset,
  onGoToStep,
  onChangeSpeed,
}) => {
  const isAtEnd = currentStepIndex >= totalSteps - 1;
  const isAtStart = currentStepIndex <= 0;

  const speedOptions = [
    { label: '0.5x (Chậm)', value: 2000 },
    { label: '1.0x (Chuẩn)', value: 1200 },
    { label: '1.5x (Nhanh)', value: 750 },
    { label: '2.5x (Rất nhanh)', value: 400 },
  ];

  return (
    <div className="h-[74px] bg-white border-t border-slate-200 px-4 lg:px-6 flex items-center justify-between gap-4 select-none shrink-0 z-20">
      {/* 1. Left: Navigation & Playback Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors cursor-pointer"
          title="Đặt lại về bước 0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Đặt lại</span>
        </button>

        <button
          onClick={onPrevStep}
          disabled={isAtStart}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            isAtStart
              ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
              : 'text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300'
          }`}
          title="Lùi lại một bước"
        >
          <SkipBack className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Bước trước</span>
        </button>

        <button
          onClick={onTogglePlay}
          className={`flex items-center gap-2 px-5 py-2 text-xs font-bold text-white rounded-lg shadow-xs transition-all cursor-pointer ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800'
              : isAtEnd
              ? 'bg-slate-700 hover:bg-slate-800'
              : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
          }`}
          title={isPlaying ? 'Tạm dừng mô phỏng' : 'Tự động chạy từng bước'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Tạm dừng</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>{isAtEnd ? 'Chạy lại' : 'Chạy'}</span>
            </>
          )}
        </button>

        <button
          onClick={onNextStep}
          disabled={isAtEnd}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            isAtEnd
              ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
              : 'text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300'
          }`}
          title="Tiến lên một bước"
        >
          <span>Bước tiếp</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Center: Step Progress Slider */}
      <div className="flex-1 max-w-xl flex items-center gap-3">
        <span className="text-xs font-bold font-mono text-slate-700 whitespace-nowrap">
          Bước {totalSteps > 0 ? currentStepIndex + 1 : 0} / {totalSteps}
        </span>
        <input
          type="range"
          min="0"
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={e => onGoToStep(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>

      {/* 3. Right: Speed Selector */}
      <div className="flex items-center gap-2">
        <Gauge className="w-4 h-4 text-slate-500 hidden md:block" />
        <span className="text-xs font-medium text-slate-600 hidden md:block">
          Tốc độ:
        </span>
        <select
          value={playbackSpeed}
          onChange={e => onChangeSpeed(Number(e.target.value))}
          className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-indigo-500 cursor-pointer"
        >
          {speedOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
