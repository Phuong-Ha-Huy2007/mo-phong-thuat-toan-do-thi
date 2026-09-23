import { GraphData, Step } from '../types/graph';

export interface EulerVertexDegree {
  vertexId: string;
  label: string;
  degree: number;
  isOdd: boolean;
}

export interface EulerStateData {
  degrees: EulerVertexDegree[];
  oddCount: number;
  oddVertices: string[];
  type: 'circuit' | 'path' | 'none';
  conclusion: string;
  pathSoFar: string[];
  traversedEdges: string[];
  remainingEdgesCount: number;
}

export function generateEulerSteps(graph: GraphData, preferredStartVertex?: string): Step[] {
  const steps: Step[] = [];
  const { vertices, edges } = graph;

  // 1. Calculate degrees
  const degreesMap: Record<string, number> = {};
  vertices.forEach(v => { degreesMap[v.id] = 0; });
  edges.forEach(e => {
    degreesMap[e.u] = (degreesMap[e.u] || 0) + 1;
    degreesMap[e.v] = (degreesMap[e.v] || 0) + 1;
  });

  const degreeList: EulerVertexDegree[] = vertices.map(v => ({
    vertexId: v.id,
    label: v.label,
    degree: degreesMap[v.id] || 0,
    isOdd: (degreesMap[v.id] || 0) % 2 !== 0,
  }));

  const oddVertices = degreeList.filter(d => d.isOdd).map(d => d.vertexId);
  const oddCount = oddVertices.length;

  // 2. Check connectivity for non-isolated vertices
  const nonIsolated = vertices.filter(v => (degreesMap[v.id] || 0) > 0);
  let isConnected = true;
  if (nonIsolated.length > 0) {
    const visitedSet = new Set<string>();
    const queue = [nonIsolated[0].id];
    visitedSet.add(nonIsolated[0].id);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      edges.forEach(e => {
        let neighbor = '';
        if (e.u === curr) neighbor = e.v;
        else if (e.v === curr) neighbor = e.u;
        if (neighbor && !visitedSet.has(neighbor)) {
          visitedSet.add(neighbor);
          queue.push(neighbor);
        }
      });
    }

    if (visitedSet.size !== nonIsolated.length) {
      isConnected = false;
    }
  }

  let eulerType: 'circuit' | 'path' | 'none' = 'none';
  let conclusion = '';

  if (!isConnected && nonIsolated.length > 0) {
    eulerType = 'none';
    conclusion = 'Đồ thị không liên thông (các đỉnh có cạnh không cùng một thành phần liên thông). Không có chu trình hay đường đi Euler.';
  } else if (oddCount === 0) {
    eulerType = 'circuit';
    conclusion = 'Tất cả các đỉnh đều có bậc chẵn (0 đỉnh bậc lẻ). Đồ thị có CHU TRÌNH EULER!';
  } else if (oddCount === 2) {
    eulerType = 'path';
    conclusion = `Đồ thị có đúng 2 đỉnh bậc lẻ (${oddVertices.join(', ')}). Đồ thị có ĐƯỜNG ĐI EULER xuất phát từ một trong hai đỉnh này!`;
  } else {
    eulerType = 'none';
    conclusion = `Đồ thị có ${oddCount} đỉnh bậc lẻ (${oddVertices.join(', ')}). Theo định lý Euler, đồ thị KHÔNG có đường đi hay chu trình Euler (cần 0 hoặc 2 đỉnh bậc lẻ).`;
  }

  // Step 0: Initial assessment
  steps.push({
    stepIndex: 0,
    totalSteps: 1, // updated at end
    title: 'Bước 0: Phân tích bậc các đỉnh & Kiểm tra định lý Euler',
    description: `Bậc các đỉnh: ${degreeList.map(d => `${d.label}(${d.degree})`).join(', ')}. Số đỉnh bậc lẻ: ${oddCount}. Kết luận: ${conclusion}`,
    activeVertices: oddVertices,
    visitedVertices: [],
    activeEdges: [],
    selectedEdges: [],
    rejectedEdges: [],
    candidateEdges: [],
    stateData: {
      degrees: degreeList,
      oddCount,
      oddVertices,
      type: eulerType,
      conclusion,
      pathSoFar: [],
      traversedEdges: [],
      remainingEdgesCount: edges.length,
    } as EulerStateData,
  });

  if (eulerType === 'none' || edges.length === 0) {
    steps[0].isFinished = true;
    steps[0].resultSummary = conclusion;
    steps[0].totalSteps = steps.length;
    return steps;
  }

  // Choose starting vertex
  let startVertexId = vertices[0].id;
  if (eulerType === 'path') {
    startVertexId = (preferredStartVertex && oddVertices.includes(preferredStartVertex))
      ? preferredStartVertex
      : oddVertices[0];
  } else {
    startVertexId = preferredStartVertex || vertices[0].id;
  }

  // Hierholzer / Fleury algorithm to find sequence of edges
  // Make a working copy of adjacency list with edge IDs
  interface AdjEdge {
    edgeId: string;
    to: string;
  }
  const adj: Record<string, AdjEdge[]> = {};
  vertices.forEach(v => { adj[v.id] = []; });
  edges.forEach(e => {
    adj[e.u].push({ edgeId: e.id, to: e.v });
    adj[e.v].push({ edgeId: e.id, to: e.u });
  });

  // Hierholzer algorithm:
  const edgeUsed = new Set<string>();
  const currPath: string[] = [startVertexId];
  const eulerTour: { from: string; to: string; edgeId: string }[] = [];
  const vertexTour: string[] = [];

  // Helper function: find circuit
  function findEulerTour() {
    const stack: string[] = [startVertexId];
    const edgeStack: { from: string; to: string; edgeId: string }[] = [];

    while (stack.length > 0) {
      const u = stack[stack.length - 1];
      // find first unused edge from u
      const nextEdge = adj[u]?.find(e => !edgeUsed.has(e.edgeId));
      if (nextEdge) {
        edgeUsed.add(nextEdge.edgeId);
        stack.push(nextEdge.to);
        edgeStack.push({ from: u, to: nextEdge.to, edgeId: nextEdge.edgeId });
      } else {
        const v = stack.pop()!;
        vertexTour.push(v);
        if (edgeStack.length > 0) {
          eulerTour.push(edgeStack.pop()!);
        }
      }
    }
  }

  findEulerTour();
  vertexTour.reverse();
  eulerTour.reverse();

  // Now create step-by-step animation
  const traversedEdgeIds: string[] = [];
  const currentPathSeq: string[] = [startVertexId];

  // Step 1: Starting point
  steps.push({
    stepIndex: steps.length,
    totalSteps: 1,
    title: `Bước 1: Chọn đỉnh xuất phát ${startVertexId}`,
    description: eulerType === 'path'
      ? `Vì đây là đường đi Euler, ta bắt buộc phải xuất phát từ đỉnh bậc lẻ. Đã chọn đỉnh ${startVertexId} (bậc ${degreesMap[startVertexId]}).`
      : `Vì đây là chu trình Euler (mọi đỉnh bậc chẵn), ta có thể xuất phát từ bất kỳ đỉnh nào. Đã chọn đỉnh ${startVertexId}.`,
    activeVertices: [startVertexId],
    visitedVertices: [startVertexId],
    activeEdges: [],
    selectedEdges: [],
    rejectedEdges: [],
    candidateEdges: [],
    stateData: {
      degrees: degreeList,
      oddCount,
      oddVertices,
      type: eulerType,
      conclusion,
      pathSoFar: [startVertexId],
      traversedEdges: [],
      remainingEdgesCount: edges.length,
    } as EulerStateData,
  });

  // Step by step edge traversal
  for (let i = 0; i < eulerTour.length; i++) {
    const tourStep = eulerTour[i];
    traversedEdgeIds.push(tourStep.edgeId);
    currentPathSeq.push(tourStep.to);

    const isLast = i === eulerTour.length - 1;

    steps.push({
      stepIndex: steps.length,
      totalSteps: 1,
      title: `Bước ${steps.length}: Đi qua cạnh (${tourStep.from} — ${tourStep.to})`,
      description: isLast
        ? `Đã đi qua cạnh cuối cùng (${tourStep.from} — ${tourStep.to}). Toàn bộ ${edges.length} cạnh đã được duyệt đúng 1 lần!`
        : `Từ đỉnh ${tourStep.from}, ta di chuyển qua cạnh (${tourStep.from} — ${tourStep.to}) đến đỉnh ${tourStep.to}. Đã duyệt ${traversedEdgeIds.length}/${edges.length} cạnh.`,
      activeVertices: [tourStep.to],
      visitedVertices: Array.from(new Set(currentPathSeq)),
      activeEdges: [tourStep.edgeId],
      selectedEdges: [...traversedEdgeIds],
      rejectedEdges: [],
      candidateEdges: [],
      stateData: {
        degrees: degreeList,
        oddCount,
        oddVertices,
        type: eulerType,
        conclusion,
        pathSoFar: [...currentPathSeq],
        traversedEdges: [...traversedEdgeIds],
        remainingEdgesCount: edges.length - traversedEdgeIds.length,
      } as EulerStateData,
      isFinished: isLast,
      resultSummary: isLast
        ? `${eulerType === 'circuit' ? 'Chu trình Euler' : 'Đường đi Euler'}: ${currentPathSeq.join(' → ')} (Tổng số cạnh: ${traversedEdgeIds.length})`
        : undefined,
    });
  }

  // Update totalSteps across all generated steps
  const total = steps.length;
  steps.forEach(s => { s.totalSteps = total; });

  return steps;
}
