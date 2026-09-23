import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  GraphData, 
  Vertex, 
  Edge, 
  AlgorithmType, 
  Step 
} from './types/graph';
import { SAMPLE_GRAPHS } from './data/sampleGraphs';
import { generateEulerSteps } from './algorithms/euler';
import { generateHamiltonSteps } from './algorithms/hamilton';
import { generateKruskalSteps } from './algorithms/kruskal';
import { generatePrimSteps } from './algorithms/prim';
import { generateDijkstraSteps } from './algorithms/dijkstra';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GraphCanvas } from './components/GraphCanvas';
import { ControlBar } from './components/ControlBar';
import { ExplanationPanel } from './components/ExplanationPanel';
import { ComparisonView } from './components/ComparisonView';
import { GraphInputModal } from './components/GraphInputModal';
import { SampleGraphModal } from './components/SampleGraphModal';
import { TheoryModal } from './components/TheoryModal';
import { StandaloneExporterModal } from './components/StandaloneExporterModal';
import { AddEdgeModal } from './components/AddEdgeModal';

export default function App() {
  // 1. Core State
  const [currentAlgorithm, setCurrentAlgorithm] = useState<AlgorithmType>('euler');
  const [graph, setGraph] = useState<GraphData>(() => SAMPLE_GRAPHS.eulerDefault.data);
  const [selectedVertexId, setSelectedVertexId] = useState<string | null>(null);

  // Algorithm Parameters
  const [eulerStartVertex, setEulerStartVertex] = useState<string>('A');
  const [hamiltonMode, setHamiltonMode] = useState<'path' | 'circuit'>('path');
  const [hamiltonStartVertex, setHamiltonStartVertex] = useState<string>('A');
  const [primStartVertex, setPrimStartVertex] = useState<string>('A');
  const [dijkstraSource, setDijkstraSource] = useState<string>('A');
  const [dijkstraTarget, setDijkstraTarget] = useState<string>('D');

  // Simulation Playback State
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1200);

  // Modals
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isCustomGraphModalOpen, setIsCustomGraphModalOpen] = useState(false);
  const [isTheoryModalOpen, setIsTheoryModalOpen] = useState(false);
  const [isStandaloneModalOpen, setIsStandaloneModalOpen] = useState(false);
  const [isAddEdgeModalOpen, setIsAddEdgeModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync default start/target when vertices change
  useEffect(() => {
    if (graph.vertices.length > 0) {
      const firstId = graph.vertices[0].id;
      const lastId = graph.vertices[graph.vertices.length - 1].id;
      if (!graph.vertices.some(v => v.id === eulerStartVertex)) setEulerStartVertex(firstId);
      if (!graph.vertices.some(v => v.id === hamiltonStartVertex)) setHamiltonStartVertex(firstId);
      if (!graph.vertices.some(v => v.id === primStartVertex)) setPrimStartVertex(firstId);
      if (!graph.vertices.some(v => v.id === dijkstraSource)) setDijkstraSource(firstId);
      if (!graph.vertices.some(v => v.id === dijkstraTarget)) setDijkstraTarget(lastId);
    }
  }, [graph.vertices]);

  // 2. Generate Steps dynamically based on current algorithm & graph
  const steps: Step[] = useMemo(() => {
    if (currentAlgorithm === 'compare') return [];

    switch (currentAlgorithm) {
      case 'euler':
        return generateEulerSteps(graph, eulerStartVertex);
      case 'hamilton':
        return generateHamiltonSteps(graph, hamiltonMode, hamiltonStartVertex);
      case 'kruskal':
        return generateKruskalSteps(graph);
      case 'prim':
        return generatePrimSteps(graph, primStartVertex);
      case 'dijkstra':
        return generateDijkstraSteps(graph, dijkstraSource, dijkstraTarget);
      default:
        return [];
    }
  }, [
    currentAlgorithm,
    graph,
    eulerStartVertex,
    hamiltonMode,
    hamiltonStartVertex,
    primStartVertex,
    dijkstraSource,
    dijkstraTarget,
  ]);

  // Ensure currentStepIndex stays in bounds
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [
    currentAlgorithm,
    graph,
    eulerStartVertex,
    hamiltonMode,
    hamiltonStartVertex,
    primStartVertex,
    dijkstraSource,
    dijkstraTarget,
  ]);

  // Auto-play timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playbackSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, steps.length, playbackSpeed]);

  // 3. Playback Handlers
  const handleTogglePlay = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleGoToStep = (index: number) => {
    setCurrentStepIndex(index);
  };

  // 4. Algorithm Selection
  const handleSelectAlgorithm = (algo: AlgorithmType) => {
    setCurrentAlgorithm(algo);
    setIsPlaying(false);

    // Switch default graph to optimize for each algorithm's classic textbook example
    if (algo === 'euler') {
      setGraph(SAMPLE_GRAPHS.eulerDefault.data);
    } else if (algo === 'hamilton') {
      setGraph(SAMPLE_GRAPHS.hamiltonDefault.data);
    } else if (algo === 'kruskal' || algo === 'prim') {
      setGraph(SAMPLE_GRAPHS.mstDefault.data);
    } else if (algo === 'dijkstra') {
      setGraph(SAMPLE_GRAPHS.dijkstraNetwork.data);
    }
  };

  // 5. Interactive Graph Operations
  const handleUpdateVertexPosition = useCallback((id: string, x: number, y: number) => {
    setGraph(prev => ({
      ...prev,
      vertices: prev.vertices.map(v => (v.id === id ? { ...v, x, y } : v)),
    }));
  }, []);

  const handleAddVertex = () => {
    // Generate next letter name (A, B, C... Z, A1...)
    const existingLabels = new Set(graph.vertices.map(v => v.label));
    let nextLabel = 'A';
    for (let i = 0; i < 26; i++) {
      const candidate = String.fromCharCode(65 + i);
      if (!existingLabels.has(candidate)) {
        nextLabel = candidate;
        break;
      }
    }
    if (existingLabels.has(nextLabel)) {
      nextLabel = `V${graph.vertices.length + 1}`;
    }

    const newVertex: Vertex = {
      id: nextLabel,
      label: nextLabel,
      x: 350 + (Math.random() - 0.5) * 80,
      y: 250 + (Math.random() - 0.5) * 80,
    };

    setGraph(prev => ({
      ...prev,
      vertices: [...prev.vertices, newVertex],
    }));
    showToast(`Đã thêm đỉnh mới: ${nextLabel}`);
  };

  const handleAddEdge = (u: string, v: string, weight: number) => {
    // Check if edge already exists
    const exists = graph.edges.some(
      e => (e.u === u && e.v === v) || (e.u === v && e.v === u)
    );
    if (exists) {
      showToast(`Cạnh giữa đỉnh ${u} và ${v} đã tồn tại!`);
      return;
    }

    const newEdge: Edge = {
      id: `e_${u}_${v}_${Date.now()}`,
      u,
      v,
      weight,
    };

    setGraph(prev => ({
      ...prev,
      edges: [...prev.edges, newEdge],
    }));
    showToast(`Đã thêm cạnh: (${u}, ${v}) trọng số ${weight}`);
  };

  const handleDeleteSelectedVertex = () => {
    if (!selectedVertexId) return;
    if (graph.vertices.length <= 2) {
      showToast('Đồ thị phải có ít nhất 2 đỉnh!');
      return;
    }
    const idToDelete = selectedVertexId;
    setGraph(prev => ({
      vertices: prev.vertices.filter(v => v.id !== idToDelete),
      edges: prev.edges.filter(e => e.u !== idToDelete && e.v !== idToDelete),
    }));
    setSelectedVertexId(null);
    showToast(`Đã xóa đỉnh ${idToDelete}`);
  };

  const handleResetLayout = () => {
    const n = graph.vertices.length;
    const centerX = 360;
    const centerY = 250;
    const radius = Math.min(180, 80 + n * 14);

    setGraph(prev => ({
      ...prev,
      vertices: prev.vertices.map((v, i) => {
        const angle = (2 * Math.PI * i) / n - Math.PI / 2;
        return {
          ...v,
          x: Math.round(centerX + radius * Math.cos(angle)),
          y: Math.round(centerY + radius * Math.sin(angle)),
        };
      }),
    }));
    showToast('Đã sắp xếp lại các đỉnh theo hình tròn');
  };

  // 6. Screenshot Capture (SVG to PNG download)
  const handleCaptureScreenshot = () => {
    const svgElement = document.querySelector('svg.graph-grid-bg') as SVGSVGElement | null;
    if (!svgElement) return;

    try {
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svgElement);

      if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = svgElement.clientWidth * 2;
        canvas.height = svgElement.clientHeight * 2;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `dothi_${currentAlgorithm}_buoc_${currentStepIndex + 1}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
        showToast('Đã chụp ảnh đồ thị để chèn vào báo cáo!');
      };

      img.src = url;
    } catch (err) {
      showToast('Đang tạo ảnh đồ thị...');
    }
  };

  const currentStep = steps[currentStepIndex];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 text-slate-800">
      {/* 1. Top Header */}
      <Header
        onOpenSampleModal={() => setIsSampleModalOpen(true)}
        onOpenCustomGraphModal={() => setIsCustomGraphModalOpen(true)}
        onOpenTheoryModal={() => setIsTheoryModalOpen(true)}
        onOpenStandaloneModal={() => setIsStandaloneModalOpen(true)}
        onCaptureScreenshot={handleCaptureScreenshot}
      />

      {/* 2. Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar
          currentAlgorithm={currentAlgorithm}
          onSelectAlgorithm={handleSelectAlgorithm}
          vertices={graph.vertices}
          eulerStartVertex={eulerStartVertex}
          onChangeEulerStart={setEulerStartVertex}
          hamiltonMode={hamiltonMode}
          onChangeHamiltonMode={setHamiltonMode}
          hamiltonStartVertex={hamiltonStartVertex}
          onChangeHamiltonStart={setHamiltonStartVertex}
          primStartVertex={primStartVertex}
          onChangePrimStart={setPrimStartVertex}
          dijkstraSource={dijkstraSource}
          onChangeDijkstraSource={setDijkstraSource}
          dijkstraTarget={dijkstraTarget}
          onChangeDijkstraTarget={setDijkstraTarget}
        />

        {/* Center / Right Section */}
        {currentAlgorithm === 'compare' ? (
          <ComparisonView />
        ) : (
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Interactive Graph Canvas + Right Explanation Panel */}
            <div className="flex-1 flex min-h-0">
              <GraphCanvas
                vertices={graph.vertices}
                edges={graph.edges}
                currentStepData={currentStep}
                algorithmType={currentAlgorithm}
                selectedVertexId={selectedVertexId}
                onSelectVertex={setSelectedVertexId}
                onUpdateVertexPosition={handleUpdateVertexPosition}
                onAddVertex={handleAddVertex}
                onAddEdge={() => setIsAddEdgeModalOpen(true)}
                onDeleteSelectedVertex={handleDeleteSelectedVertex}
                onResetLayout={handleResetLayout}
              />

              <ExplanationPanel
                algorithmType={currentAlgorithm}
                currentStep={currentStep}
              />
            </div>

            {/* Bottom Simulation Control Bar */}
            <ControlBar
              currentStepIndex={currentStepIndex}
              totalSteps={steps.length}
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              onTogglePlay={handleTogglePlay}
              onNextStep={handleNextStep}
              onPrevStep={handlePrevStep}
              onReset={handleReset}
              onGoToStep={handleGoToStep}
              onChangeSpeed={setPlaybackSpeed}
            />
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg animate-fade-in pointer-events-none">
          {toastMessage}
        </div>
      )}

      {/* Modals */}
      <SampleGraphModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelectSample={newGraph => {
          setGraph(newGraph);
          showToast('Đã nạp đồ thị mẫu thành công!');
        }}
      />

      <GraphInputModal
        isOpen={isCustomGraphModalOpen}
        onClose={() => setIsCustomGraphModalOpen(false)}
        onApplyGraph={newGraph => {
          setGraph(newGraph);
          showToast('Đã tạo đồ thị mới thành công!');
        }}
      />

      <TheoryModal
        isOpen={isTheoryModalOpen}
        onClose={() => setIsTheoryModalOpen(false)}
        defaultAlgo={currentAlgorithm}
      />

      <StandaloneExporterModal
        isOpen={isStandaloneModalOpen}
        onClose={() => setIsStandaloneModalOpen(false)}
      />

      <AddEdgeModal
        isOpen={isAddEdgeModalOpen}
        onClose={() => setIsAddEdgeModalOpen(false)}
        vertices={graph.vertices}
        onAddEdge={handleAddEdge}
      />
    </div>
  );
}
