import { Edge, GraphData, Step } from '../types/graph';

export interface PrimCandidateEdge {
  id: string;
  edgeLabel: string;
  u: string; // in V_new
  v: string; // in V \ V_new
  weight: number;
  isMinimum: boolean;
}

export interface PrimStateData {
  startVertex: string;
  selectedVertices: string[];
  unselectedVertices: string[];
  candidateEdges: PrimCandidateEdge[];
  chosenEdges: string[];
  totalMSTWeight: number;
}

export function generatePrimSteps(graph: GraphData, startVertexId?: string): Step[] {
  const steps: Step[] = [];
  const { vertices, edges } = graph;

  if (vertices.length === 0) return steps;

  const start = (startVertexId && vertices.some(v => v.id === startVertexId))
    ? startVertexId
    : vertices[0].id;

  const selectedVertices: string[] = [start];
  const unselectedVertices: string[] = vertices.filter(v => v.id !== start).map(v => v.id);
  const selectedEdgeIds: string[] = [];
  let totalWeight = 0;

  // Step 0: Initial state
  steps.push({
    stepIndex: 0,
    totalSteps: 1,
    title: `Bước 0: Khởi tạo cây khung Prim từ đỉnh xuất phát ${start}`,
    description: `Khởi tạo: Tập đỉnh đã chọn V_new = {${start}}. Tập đỉnh chưa chọn V \\ V_new = {${unselectedVertices.join(', ')}}. Chưa có cạnh nào trong cây khung.`,
    activeVertices: [start],
    visitedVertices: [start],
    activeEdges: [],
    selectedEdges: [],
    rejectedEdges: [],
    candidateEdges: [],
    stateData: {
      startVertex: start,
      selectedVertices: [...selectedVertices],
      unselectedVertices: [...unselectedVertices],
      candidateEdges: [],
      chosenEdges: [],
      totalMSTWeight: 0,
    } as PrimStateData,
  });

  while (selectedVertices.length < vertices.length) {
    // Find all cut edges: one endpoint in selectedVertices, other in unselectedVertices
    const candidates: PrimCandidateEdge[] = [];

    edges.forEach(e => {
      const uIn = selectedVertices.includes(e.u);
      const vIn = selectedVertices.includes(e.v);

      if ((uIn && !vIn) || (!uIn && vIn)) {
        const selectedEndpoint = uIn ? e.u : e.v;
        const unselectedEndpoint = uIn ? e.v : e.u;

        candidates.push({
          id: e.id,
          edgeLabel: `(${selectedEndpoint}, ${unselectedEndpoint})`,
          u: selectedEndpoint,
          v: unselectedEndpoint,
          weight: e.weight,
          isMinimum: false,
        });
      }
    });

    if (candidates.length === 0) {
      // Disconnected graph
      steps.push({
        stepIndex: steps.length,
        totalSteps: 1,
        title: 'Đồ thị không liên thông!',
        description: `Không còn cạnh nào nối từ tập đỉnh đã chọn {${selectedVertices.join(', ')}} đến các đỉnh còn lại {${unselectedVertices.join(', ')}}. Không thể hoàn thành cây khung bao trùm toàn bộ đồ thị.`,
        activeVertices: [],
        visitedVertices: [...selectedVertices],
        activeEdges: [],
        selectedEdges: [...selectedEdgeIds],
        rejectedEdges: [],
        candidateEdges: [],
        stateData: {
          startVertex: start,
          selectedVertices: [...selectedVertices],
          unselectedVertices: [...unselectedVertices],
          candidateEdges: [],
          chosenEdges: [...selectedEdgeIds],
          totalMSTWeight: totalWeight,
        } as PrimStateData,
        isFinished: true,
        resultSummary: `Dừng lại: Đồ thị không liên thông. Rừng khung đạt trọng số ${totalWeight} với ${selectedEdgeIds.length} cạnh.`,
      });
      break;
    }

    // Sort candidates by weight to find minimum
    candidates.sort((a, b) => a.weight - b.weight);
    const minEdge = candidates[0];
    candidates.forEach(c => {
      if (c.weight === minEdge.weight && c.id === minEdge.id) {
        c.isMinimum = true;
      }
    });

    const candidateEdgeIds = candidates.map(c => c.id);

    // Step A: Show candidate cut edges
    steps.push({
      stepIndex: steps.length,
      totalSteps: 1,
      title: `Bước ${steps.length}: Tìm cạnh có trọng số nhỏ nhất qua lát cắt (Cut)`,
      description: `Từ tập đã chọn {${selectedVertices.join(', ')}}, có ${candidates.length} cạnh ứng viên nối sang tập chưa chọn: ${candidates.map(c => `${c.edgeLabel}[w=${c.weight}]`).join(', ')}. Cạnh nhỏ nhất là ${minEdge.edgeLabel} với trọng số w = ${minEdge.weight}.`,
      activeVertices: [minEdge.u, minEdge.v],
      visitedVertices: [...selectedVertices],
      activeEdges: [minEdge.id],
      selectedEdges: [...selectedEdgeIds],
      rejectedEdges: [],
      candidateEdges: candidateEdgeIds,
      stateData: {
        startVertex: start,
        selectedVertices: [...selectedVertices],
        unselectedVertices: [...unselectedVertices],
        candidateEdges: [...candidates],
        chosenEdges: [...selectedEdgeIds],
        totalMSTWeight: totalWeight,
      } as PrimStateData,
    });

    // Step B: Pick the edge and expand V_new
    selectedEdgeIds.push(minEdge.id);
    totalWeight += minEdge.weight;
    selectedVertices.push(minEdge.v);
    const unselectedIdx = unselectedVertices.indexOf(minEdge.v);
    if (unselectedIdx !== -1) {
      unselectedVertices.splice(unselectedIdx, 1);
    }

    const isFinished = selectedVertices.length === vertices.length;

    steps.push({
      stepIndex: steps.length,
      totalSteps: 1,
      title: `Thêm cạnh ${minEdge.edgeLabel} và đỉnh ${minEdge.v} vào Cây Khung`,
      description: `Đã chọn cạnh ${minEdge.edgeLabel} (w = ${minEdge.weight}). Kết nạp đỉnh mới ${minEdge.v} vào cây khung. Tổng trọng số hiện tại: ${totalWeight}. Số cạnh MST: ${selectedEdgeIds.length}/${vertices.length - 1}.`,
      activeVertices: [minEdge.v],
      visitedVertices: [...selectedVertices],
      activeEdges: [],
      selectedEdges: [...selectedEdgeIds],
      rejectedEdges: [],
      candidateEdges: [],
      stateData: {
        startVertex: start,
        selectedVertices: [...selectedVertices],
        unselectedVertices: [...unselectedVertices],
        candidateEdges: [],
        chosenEdges: [...selectedEdgeIds],
        totalMSTWeight: totalWeight,
      } as PrimStateData,
      isFinished,
      resultSummary: isFinished
        ? `Cây khung nhỏ nhất (Prim) hoàn thành! Đã chọn đủ ${selectedEdgeIds.length} cạnh, Tổng trọng số W = ${totalWeight}.`
        : undefined,
    });
  }

  const total = steps.length;
  steps.forEach(s => { s.totalSteps = total; });

  return steps;
}
