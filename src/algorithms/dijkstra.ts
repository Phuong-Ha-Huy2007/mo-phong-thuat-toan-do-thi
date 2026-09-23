import { GraphData, Step } from '../types/graph';

export interface DijkstraTableRow {
  vertexId: string;
  dist: number; // Infinity represented by Number.POSITIVE_INFINITY
  distDisplay: string;
  prev: string | null;
  status: 'unvisited' | 'current' | 'finalized';
  formula?: string;
}

export interface DijkstraStateData {
  source: string;
  target: string;
  currentVertex: string | null;
  table: DijkstraTableRow[];
  relaxingEdge: string | null;
  shortestPath: string[];
  totalDistance: number;
}

export function generateDijkstraSteps(
  graph: GraphData,
  sourceId?: string,
  targetId?: string
): Step[] {
  const steps: Step[] = [];
  const { vertices, edges } = graph;

  if (vertices.length === 0) return steps;

  const source = (sourceId && vertices.some(v => v.id === sourceId))
    ? sourceId
    : vertices[0].id;

  const target = (targetId && vertices.some(v => v.id === targetId))
    ? targetId
    : (vertices.find(v => v.id === 'E')?.id || vertices[vertices.length - 1].id);

  // Build adjacency
  interface Neighbor {
    to: string;
    weight: number;
    edgeId: string;
  }
  const adj: Record<string, Neighbor[]> = {};
  vertices.forEach(v => { adj[v.id] = []; });
  edges.forEach(e => {
    adj[e.u].push({ to: e.v, weight: e.weight, edgeId: e.id });
    adj[e.v].push({ to: e.u, weight: e.weight, edgeId: e.id });
  });

  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const finalized = new Set<string>();

  vertices.forEach(v => {
    dist[v.id] = Infinity;
    prev[v.id] = null;
  });
  dist[source] = 0;

  function buildTable(currentVisiting: string | null, activeFormulaVertex?: string, formulaText?: string): DijkstraTableRow[] {
    return vertices.map(v => {
      let status: 'unvisited' | 'current' | 'finalized' = 'unvisited';
      if (finalized.has(v.id)) status = 'finalized';
      else if (v.id === currentVisiting) status = 'current';

      return {
        vertexId: v.id,
        dist: dist[v.id],
        distDisplay: dist[v.id] === Infinity ? '∞' : dist[v.id].toString(),
        prev: prev[v.id],
        status,
        formula: v.id === activeFormulaVertex ? formulaText : undefined,
      };
    });
  }

  // Step 0: Initialization
  steps.push({
    stepIndex: 0,
    totalSteps: 1,
    title: `Bước 0: Khởi tạo khoảng cách từ đỉnh nguồn ${source}`,
    description: `Đặt dist(${source}) = 0. Tất cả các đỉnh còn lại đặt dist(v) = ∞, prev(v) = null. Chưa có đỉnh nào được chốt (finalized).`,
    activeVertices: [source],
    visitedVertices: [],
    activeEdges: [],
    selectedEdges: [],
    rejectedEdges: [],
    candidateEdges: [],
    formula: `dist(${source}) = 0, dist(v ≠ ${source}) = ∞`,
    stateData: {
      source,
      target,
      currentVertex: source,
      table: buildTable(source),
      relaxingEdge: null,
      shortestPath: [],
      totalDistance: 0,
    } as DijkstraStateData,
  });

  while (finalized.size < vertices.length) {
    // Find unvisited vertex with minimum distance
    let u: string | null = null;
    let minDist = Infinity;

    for (const v of vertices) {
      if (!finalized.has(v.id) && dist[v.id] < minDist) {
        minDist = dist[v.id];
        u = v.id;
      }
    }

    if (u === null || minDist === Infinity) {
      // Remaining vertices are unreachable
      break;
    }

    // Step A: Pick vertex u
    steps.push({
      stepIndex: steps.length,
      totalSteps: 1,
      title: `Bước ${steps.length}: Chọn đỉnh ${u} có khoảng cách nhỏ nhất [d(${u}) = ${minDist}]`,
      description: `Trong số các đỉnh chưa chốt, đỉnh ${u} có khoảng cách ngắn nhất từ nguồn là ${minDist}. Ta chọn ${u} làm đỉnh hiện tại để duyệt và nới lỏng (relax) các đỉnh kề.`,
      activeVertices: [u],
      visitedVertices: [...finalized],
      activeEdges: [],
      selectedEdges: [],
      rejectedEdges: [],
      candidateEdges: [],
      formula: `min { dist(v) | v ∉ S } = dist(${u}) = ${minDist}`,
      stateData: {
        source,
        target,
        currentVertex: u,
        table: buildTable(u),
        relaxingEdge: null,
        shortestPath: [],
        totalDistance: 0,
      } as DijkstraStateData,
    });

    // Step B: Relax neighbors
    const neighbors = adj[u];
    for (const neighbor of neighbors) {
      const v = neighbor.to;
      const weight = neighbor.weight;

      if (!finalized.has(v)) {
        const oldDist = dist[v];
        const newDist = dist[u] + weight;
        const oldDisplay = oldDist === Infinity ? '∞' : oldDist;

        if (newDist < oldDist) {
          dist[v] = newDist;
          prev[v] = u;

          const formulaStr = `dist(${v}) = min(${oldDisplay}, dist(${u}) + w(${u},${v})) = min(${oldDisplay}, ${dist[u]} + ${weight}) = ${newDist}`;

          steps.push({
            stepIndex: steps.length,
            totalSteps: 1,
            title: `Cập nhật khoảng cách đỉnh kề ${v} qua đỉnh ${u}`,
            description: `Kiểm tra đỉnh kề ${v}: dist(${u}) + w(${u},${v}) = ${dist[u]} + ${weight} = ${newDist} < dist(${v}) = ${oldDisplay}. Cập nhật: dist(${v}) = ${newDist}, prev(${v}) = ${u}.`,
            activeVertices: [u, v],
            visitedVertices: [...finalized],
            activeEdges: [neighbor.edgeId],
            selectedEdges: [],
            rejectedEdges: [],
            candidateEdges: [],
            formula: formulaStr,
            stateData: {
              source,
              target,
              currentVertex: u,
              table: buildTable(u, v, formulaStr),
              relaxingEdge: neighbor.edgeId,
              shortestPath: [],
              totalDistance: 0,
            } as DijkstraStateData,
          });
        } else {
          const formulaStr = `dist(${v}) = min(${oldDisplay}, ${dist[u]} + ${weight}) = ${oldDisplay} (không đổi)`;

          steps.push({
            stepIndex: steps.length,
            totalSteps: 1,
            title: `Xét đỉnh kề ${v} (Không cập nhật)`,
            description: `Kiểm tra đỉnh kề ${v}: dist(${u}) + w(${u},${v}) = ${dist[u]} + ${weight} = ${newDist} ≥ dist(${v}) = ${oldDisplay}. Không có đường đi ngắn hơn, giữ nguyên dist(${v}) = ${oldDisplay}.`,
            activeVertices: [u, v],
            visitedVertices: [...finalized],
            activeEdges: [neighbor.edgeId],
            selectedEdges: [],
            rejectedEdges: [],
            candidateEdges: [],
            formula: formulaStr,
            stateData: {
              source,
              target,
              currentVertex: u,
              table: buildTable(u, v, formulaStr),
              relaxingEdge: neighbor.edgeId,
              shortestPath: [],
              totalDistance: 0,
            } as DijkstraStateData,
          });
        }
      }
    }

    // Step C: Finalize vertex u
    finalized.add(u);
    steps.push({
      stepIndex: steps.length,
      totalSteps: 1,
      title: `Chốt khoảng cách tối ưu cho đỉnh ${u}`,
      description: `Đã hoàn tất duyệt các đỉnh kề của ${u}. Đỉnh ${u} được đánh dấu ĐÃ TỐI ƯU (Finalized) với dist(${u}) = ${dist[u]}.`,
      activeVertices: [],
      visitedVertices: [...finalized],
      activeEdges: [],
      selectedEdges: [],
      rejectedEdges: [],
      candidateEdges: [],
      stateData: {
        source,
        target,
        currentVertex: null,
        table: buildTable(null),
        relaxingEdge: null,
        shortestPath: [],
        totalDistance: 0,
      } as DijkstraStateData,
    });

    if (u === target) {
      // Reached destination
      break;
    }
  }

  // Trace shortest path from target to source
  const path: string[] = [];
  let curr: string | null = target;
  let hasPath = true;

  if (dist[target] === Infinity) {
    hasPath = false;
  } else {
    while (curr !== null) {
      path.unshift(curr);
      if (curr === source) break;
      curr = prev[curr];
      if (!curr && path[0] !== source) {
        hasPath = false;
        break;
      }
    }
  }

  // Find edges in path
  const pathEdgeIds: string[] = [];
  if (hasPath && path.length > 1) {
    for (let i = 0; i < path.length - 1; i++) {
      const uId = path[i];
      const vId = path[i + 1];
      const edge = edges.find(e => (e.u === uId && e.v === vId) || (e.u === vId && e.v === uId));
      if (edge) pathEdgeIds.push(edge.id);
    }
  }

  // Final conclusion step
  steps.push({
    stepIndex: steps.length,
    totalSteps: 1,
    title: hasPath ? `Truy vết đường đi ngắn nhất: ${path.join(' → ')}` : `Không có đường đi từ ${source} đến ${target}`,
    description: hasPath
      ? `Truy vết ngược từ đích ${target} qua các đỉnh trước prev(v): ${path.join(' → ')}. Tổng khoảng cách ngắn nhất: ${dist[target]}.`
      : `Không tồn tại đường đi nối giữa đỉnh ${source} và đỉnh ${target} trong đồ thị này.`,
    activeVertices: hasPath ? path : [],
    visitedVertices: [...finalized],
    activeEdges: [],
    selectedEdges: pathEdgeIds,
    rejectedEdges: [],
    candidateEdges: [],
    stateData: {
      source,
      target,
      currentVertex: null,
      table: buildTable(null),
      relaxingEdge: null,
      shortestPath: path,
      totalDistance: hasPath ? dist[target] : Infinity,
    } as DijkstraStateData,
    isFinished: true,
    resultSummary: hasPath
      ? `Đường đi ngắn nhất từ ${source} đến ${target}: ${path.join(' → ')} (Tổng trọng số: ${dist[target]})`
      : `Không có đường đi từ ${source} đến ${target}.`,
  });

  const total = steps.length;
  steps.forEach(s => { s.totalSteps = total; });

  return steps;
}
