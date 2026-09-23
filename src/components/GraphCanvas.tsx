import React, { useRef, useState, useEffect } from 'react';
import { 
  Vertex, 
  Edge, 
  Step, 
  AlgorithmType 
} from '../types/graph';
import { 
  Plus, 
  Trash2, 
  CircleDot, 
  Maximize2, 
  Sparkles,
  Link,
  Info
} from 'lucide-react';

interface GraphCanvasProps {
  vertices: Vertex[];
  edges: Edge[];
  currentStepData?: Step;
  algorithmType: AlgorithmType;
  selectedVertexId: string | null;
  onSelectVertex: (id: string | null) => void;
  onUpdateVertexPosition: (id: string, x: number, y: number) => void;
  onAddVertex: () => void;
  onAddEdge: () => void;
  onDeleteSelectedVertex: () => void;
  onResetLayout: () => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  vertices,
  edges,
  currentStepData,
  algorithmType,
  selectedVertexId,
  onSelectVertex,
  onUpdateVertexPosition,
  onAddVertex,
  onAddEdge,
  onDeleteSelectedVertex,
  onResetLayout,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingVertexId, setDraggingVertexId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle vertex dragging
  const handleMouseDown = (vertex: Vertex, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectVertex(vertex.id);
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setDraggingVertexId(vertex.id);
    setDragOffset({
      x: mouseX - vertex.x,
      y: mouseY - vertex.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingVertexId || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Clamp to canvas borders
    const clampedX = Math.max(40, Math.min(rect.width - 40, mouseX - dragOffset.x));
    const clampedY = Math.max(40, Math.min(rect.height - 40, mouseY - dragOffset.y));
    
    onUpdateVertexPosition(draggingVertexId, clampedX, clampedY);
  };

  const handleMouseUp = () => {
    setDraggingVertexId(null);
  };

  // Touch support for mobile / tablet
  const handleTouchStart = (vertex: Vertex, e: React.TouchEvent) => {
    if (e.touches.length === 0 || !svgRef.current) return;
    onSelectVertex(vertex.id);
    const touch = e.touches[0];
    const rect = svgRef.current.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    setDraggingVertexId(vertex.id);
    setDragOffset({
      x: touchX - vertex.x,
      y: touchY - vertex.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggingVertexId || !svgRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = svgRef.current.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    
    const clampedX = Math.max(40, Math.min(rect.width - 40, touchX - dragOffset.x));
    const clampedY = Math.max(40, Math.min(rect.height - 40, touchY - dragOffset.y));
    
    onUpdateVertexPosition(draggingVertexId, clampedX, clampedY);
  };

  const handleTouchEnd = () => {
    setDraggingVertexId(null);
  };

  // Determine Edge Visual Status
  const getEdgeVisual = (edge: Edge) => {
    if (!currentStepData) {
      return {
        stroke: '#94a3b8',
        strokeWidth: 2.5,
        strokeDasharray: 'none',
        opacity: 0.85,
        isHighlight: false,
        labelBg: '#ffffff',
        labelColor: '#334155',
      };
    }

    const { activeEdges, selectedEdges, rejectedEdges, candidateEdges } = currentStepData;

    if (activeEdges.includes(edge.id)) {
      return {
        stroke: '#f59e0b', // Amber
        strokeWidth: 4.5,
        strokeDasharray: 'none',
        opacity: 1,
        isHighlight: true,
        labelBg: '#fef3c7',
        labelColor: '#92400e',
      };
    }
    if (selectedEdges.includes(edge.id)) {
      return {
        stroke: '#10b981', // Emerald
        strokeWidth: 4.5,
        strokeDasharray: 'none',
        opacity: 1,
        isHighlight: true,
        labelBg: '#d1fae5',
        labelColor: '#065f46',
      };
    }
    if (rejectedEdges.includes(edge.id)) {
      return {
        stroke: '#ef4444', // Red
        strokeWidth: 3,
        strokeDasharray: '6 4',
        opacity: 0.7,
        isHighlight: false,
        labelBg: '#fee2e2',
        labelColor: '#991b1b',
      };
    }
    if (candidateEdges.includes(edge.id)) {
      return {
        stroke: '#0ea5e9', // Sky blue
        strokeWidth: 3.5,
        strokeDasharray: '5 3',
        opacity: 0.95,
        isHighlight: true,
        labelBg: '#e0f2fe',
        labelColor: '#0369a1',
      };
    }

    return {
      stroke: '#cbd5e1',
      strokeWidth: 2,
      strokeDasharray: 'none',
      opacity: 0.65,
      isHighlight: false,
      labelBg: '#ffffff',
      labelColor: '#64748b',
    };
  };

  // Determine Vertex Visual Status
  const getVertexVisual = (vertex: Vertex) => {
    const isSelectedByUser = selectedVertexId === vertex.id;

    if (!currentStepData) {
      return {
        fill: isSelectedByUser ? '#e0e7ff' : '#ffffff',
        stroke: isSelectedByUser ? '#4f46e5' : '#64748b',
        strokeWidth: isSelectedByUser ? 3.5 : 2.5,
        textColor: '#0f172a',
        badge: null,
        isActive: false,
      };
    }

    const { activeVertices, visitedVertices } = currentStepData;
    const isActive = activeVertices.includes(vertex.id);
    const isVisited = visitedVertices.includes(vertex.id);

    if (isActive) {
      return {
        fill: '#fef3c7',
        stroke: '#f59e0b', // Amber active
        strokeWidth: 4,
        textColor: '#92400e',
        badge: 'Đang xét',
        isActive: true,
      };
    }

    if (isVisited) {
      return {
        fill: '#ecfdf5',
        stroke: '#10b981', // Emerald visited / MST
        strokeWidth: 3,
        textColor: '#065f46',
        badge: 'Đã duyệt',
        isActive: false,
      };
    }

    return {
      fill: isSelectedByUser ? '#e0e7ff' : '#ffffff',
      stroke: isSelectedByUser ? '#4f46e5' : '#94a3b8',
      strokeWidth: isSelectedByUser ? 3 : 2,
      textColor: '#334155',
      badge: null,
      isActive: false,
    };
  };

  return (
    <div className="relative flex-1 h-[calc(100vh-57px-74px)] bg-slate-50 flex flex-col overflow-hidden select-none border-b border-slate-200">
      {/* Top Floating Toolbar for Canvas */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        {/* Left: Vertex/Edge Quick Actions */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-xs px-2.5 py-1.5 rounded-xl pointer-events-auto">
          <button
            onClick={onAddVertex}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            title="Thêm một đỉnh mới vào đồ thị"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm đỉnh</span>
          </button>

          <button
            onClick={onAddEdge}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            title="Thêm cạnh nối 2 đỉnh"
          >
            <Link className="w-3.5 h-3.5" />
            <span>Thêm cạnh</span>
          </button>

          {selectedVertexId && (
            <button
              onClick={onDeleteSelectedVertex}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Xóa đỉnh đang chọn"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa đỉnh ({selectedVertexId})</span>
            </button>
          )}

          <div className="h-4 w-px bg-slate-200 mx-1" />

          <button
            onClick={onResetLayout}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Sắp xếp lại các đỉnh theo hình tròn đều"
          >
            <CircleDot className="w-3.5 h-3.5" />
            <span>Sắp xếp tròn</span>
          </button>
        </div>

        {/* Right: Legend Chú thích màu sắc */}
        <div className="hidden lg:flex items-center gap-3 bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-xs px-3 py-1.5 rounded-xl pointer-events-auto text-[11px] font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500" />
            <span>Đang xét</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600" />
            <span>Đã chọn / MST</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 border border-rose-600" />
            <span>Bị loại / Chu trình</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-400 border border-sky-500" />
            <span>Ứng viên (Cut)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-300 border border-slate-400" />
            <span>Chưa xét</span>
          </div>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <svg
        ref={svgRef}
        className="w-full h-full graph-grid-bg cursor-default"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => onSelectVertex(null)}
      >
        <defs>
          {/* Drop shadow for vertices */}
          <filter id="vertex-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.12" />
          </filter>
          <filter id="active-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f59e0b" floodOpacity="0.5" />
          </filter>
          <filter id="selected-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#10b981" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* 1. EDGES */}
        <g className="edges-layer">
          {edges.map(edge => {
            const uVertex = vertices.find(v => v.id === edge.u);
            const vVertex = vertices.find(v => v.id === edge.v);
            if (!uVertex || !vVertex) return null;

            const visual = getEdgeVisual(edge);
            const midX = (uVertex.x + vVertex.x) / 2;
            const midY = (uVertex.y + vVertex.y) / 2;

            return (
              <g key={edge.id} className="edge-group">
                {/* Visual line */}
                <line
                  x1={uVertex.x}
                  y1={uVertex.y}
                  x2={vVertex.x}
                  y2={vVertex.y}
                  stroke={visual.stroke}
                  strokeWidth={visual.strokeWidth}
                  strokeDasharray={visual.strokeDasharray}
                  opacity={visual.opacity}
                  strokeLinecap="round"
                />

                {/* Edge Weight Pill (Shown for weighted graphs or always for clarity) */}
                <g transform={`translate(${midX}, ${midY})`}>
                  <rect
                    x="-14"
                    y="-11"
                    width="28"
                    height="22"
                    rx="6"
                    fill={visual.labelBg}
                    stroke={visual.stroke}
                    strokeWidth="1.5"
                    className="shadow-xs"
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={visual.labelColor}
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {edge.weight}
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        {/* 2. VERTICES */}
        <g className="vertices-layer">
          {vertices.map(vertex => {
            const visual = getVertexVisual(vertex);
            const radius = 22;

            return (
              <g
                key={vertex.id}
                transform={`translate(${vertex.x}, ${vertex.y})`}
                className="vertex-group cursor-grab active:cursor-grabbing transition-transform"
                onMouseDown={e => handleMouseDown(vertex, e)}
                onTouchStart={e => handleTouchStart(vertex, e)}
                onClick={e => {
                  e.stopPropagation();
                  onSelectVertex(vertex.id);
                }}
              >
                {/* Pulse ring for active vertex */}
                {visual.isActive && (
                  <circle
                    r={radius + 8}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    className="animate-pulse-ring"
                  />
                )}

                {/* Main vertex circle */}
                <circle
                  r={radius}
                  fill={visual.fill}
                  stroke={visual.stroke}
                  strokeWidth={visual.strokeWidth}
                  filter={visual.isActive ? 'url(#active-glow)' : 'url(#vertex-shadow)'}
                  className="transition-colors duration-200"
                />

                {/* Vertex Label */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={visual.textColor}
                  fontSize="14"
                  fontWeight="700"
                  className="select-none pointer-events-none"
                >
                  {vertex.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Helper text overlay */}
      <div className="absolute bottom-2 left-4 text-[11px] text-slate-400 pointer-events-none flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5" />
        <span>Kéo thả đỉnh để đổi vị trí · Nhấp đỉnh để chọn hoặc đổi điểm xuất phát</span>
      </div>
    </div>
  );
};
