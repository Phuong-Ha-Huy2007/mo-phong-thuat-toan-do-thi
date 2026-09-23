import { Edge, GraphData, Step } from '../types/graph';

export interface KruskalEdgeRow {
  index: number;
  id: string;
  edgeLabel: string;
  u: string;
  v: string;
  weight: number;
  status: 'pending' | 'examining' | 'accepted' | 'rejected';
  reason?: string;
}

export interface KruskalStateData {
  edgeRows: KruskalEdgeRow[];
  currentEdgeIndex: number;
  totalMSTWeight: number;
  mstEdgeCount: number;
  disjointSets: Record<string, string>; // vertexId -> root parent
  setGroups: Record<string, string[]>; // root -> list of vertexIds
}

export function generateKruskalSteps(graph: GraphData): Step[] {
  const steps: Step[] = [];
  const { vertices, edges } = graph;

  if (vertices.length === 0 || edges.length === 0) return steps;

  // 1. Sort edges ascending by weight
  const sortedEdges = [...edges].sort((a, b) => {
    if (a.weight !== b.weight) return a.weight - b.weight;
    return a.id.localeCompare(b.id);
  });

  // Prepare table rows
  const edgeRows: KruskalEdgeRow[] = sortedEdges.map((e, idx) => ({
    index: idx + 1,
    id: e.id,
    edgeLabel: `(${e.u}, ${e.v})`,
    u: e.u,
    v: e.v,
    weight: e.weight,
    status: 'pending',
  }));

  // Disjoint Set data structures
  const parent: Record<string, string> = {};
  const rank: Record<string, number> = {};

  vertices.forEach(v => {
    parent[v.id] = v.id;
    rank[v.id] = 0;
  });

  function find(i: string): string {
    if (parent[i] === i) return i;
    parent[i] = find(parent[i]); // path compression
    return parent[i];
  }

  function union(x: string, y: string): boolean {
    const rootX = find(x);
    const rootY = find(y);
    if (rootX === rootY) return false;

    if (rank[rootX] < rank[rootY]) {
      parent[rootX] = rootY;
    } else if (rank[rootX] > rank[rootY]) {
      parent[rootY] = rootX;
    } else {
      parent[rootY] = rootX;
      rank[rootX]++;
    }
    return true;
  }

  function getSetGroups(): Record<string, string[]> {
    const groups: Record<string, string[]> = {};
    vertices.forEach(v => {
      const root = find(v.id);
      if (!groups[root]) groups[root] = [];
      groups[root].push(v.id);
    });
    return groups;
  }

  // Step 0: Initial forest
  steps.push({
    stepIndex: 0,
    totalSteps: 1,
    title: 'Bước 0: Khởi tạo rừng & Sắp xếp danh sách cạnh theo trọng số tăng dần',
    description: `Đã sắp xếp ${edges.length} cạnh theo trọng số tăng dần. Ban đầu mỗi đỉnh thuộc một tập hợp rời nhau riêng biệt (${vertices.map(v => `{${v.id}}`).join(', ')}). Cây khung cần đúng |V| - 1 = ${vertices.length - 1} cạnh.`,
    activeVertices: [],
    visitedVertices: [],
    activeEdges: [],
    selectedEdges: [],
    rejectedEdges: [],
    candidateEdges: [],
    stateData: {
      edgeRows: JSON.parse(JSON.stringify(edgeRows)),
      currentEdgeIndex: -1,
      totalMSTWeight: 0,
      mstEdgeCount: 0,
      disjointSets: { ...parent },
      setGroups: getSetGroups(),
    } as KruskalStateData,
  });

  const selectedEdgeIds: string[] = [];
  const rejectedEdgeIds: string[] = [];
  let totalWeight = 0;

  for (let i = 0; i < sortedEdges.length; i++) {
    const currentEdge = sortedEdges[i];
    const rootU = find(currentEdge.u);
    const rootV = find(currentEdge.v);

    // Step A: Examining edge
    const examiningRows = JSON.parse(JSON.stringify(edgeRows));
    examiningRows[i].status = 'examining';

    steps.push({
      stepIndex: steps.length,
      totalSteps: 1,
      title: `Bước ${steps.length}: Xét cạnh ${currentEdge.u}—${currentEdge.v} (Trọng số w = ${currentEdge.weight})`,
      description: `Đang xét cạnh tiếp theo trong danh sách: (${currentEdge.u}, ${currentEdge.v}) có trọng số ${currentEdge.weight}. Kiểm tra: Gốc của ${currentEdge.u} là '${rootU}', gốc của ${currentEdge.v} là '${rootV}'.`,
      activeVertices: [currentEdge.u, currentEdge.v],
      visitedVertices: [...new Set(selectedEdgeIds.flatMap(id => {
        const e = edges.find(edge => edge.id === id);
        return e ? [e.u, e.v] : [];
      }))],
      activeEdges: [currentEdge.id],
      selectedEdges: [...selectedEdgeIds],
      rejectedEdges: [...rejectedEdgeIds],
      candidateEdges: [],
      stateData: {
        edgeRows: examiningRows,
        currentEdgeIndex: i,
        totalMSTWeight: totalWeight,
        mstEdgeCount: selectedEdgeIds.length,
        disjointSets: { ...parent },
        setGroups: getSetGroups(),
      } as KruskalStateData,
    });

    // Step B: Decision (Accept or Reject)
    if (rootU !== rootV) {
      // Accept
      union(rootU, rootV);
      selectedEdgeIds.push(currentEdge.id);
      totalWeight += currentEdge.weight;
      edgeRows[i].status = 'accepted';
      edgeRows[i].reason = `Không tạo chu trình: Gốc ${rootU} ≠ Gốc ${rootV}. Hợp nhất hai tập hợp!`;

      const isMSTComplete = selectedEdgeIds.length === vertices.length - 1;

      steps.push({
        stepIndex: steps.length,
        totalSteps: 1,
        title: `CHẤP NHẬN cạnh (${currentEdge.u} — ${currentEdge.v}) vào Cây Khung`,
        description: `Vì đỉnh ${currentEdge.u} và ${currentEdge.v} nằm ở 2 cây con rời nhau (Gốc: ${rootU} ≠ ${rootV}), thêm cạnh này KHÔNG tạo chu trình. Chọn cạnh, cộng trọng số +${currentEdge.weight} (Tổng MST = ${totalWeight}). Số cạnh MST hiện tại: ${selectedEdgeIds.length}/${vertices.length - 1}.`,
        activeVertices: [currentEdge.u, currentEdge.v],
        visitedVertices: [...new Set(selectedEdgeIds.flatMap(id => {
          const e = edges.find(edge => edge.id === id);
          return e ? [e.u, e.v] : [];
        }))],
        activeEdges: [],
        selectedEdges: [...selectedEdgeIds],
        rejectedEdges: [...rejectedEdgeIds],
        candidateEdges: [],
        stateData: {
          edgeRows: JSON.parse(JSON.stringify(edgeRows)),
          currentEdgeIndex: i,
          totalMSTWeight: totalWeight,
          mstEdgeCount: selectedEdgeIds.length,
          disjointSets: { ...parent },
          setGroups: getSetGroups(),
        } as KruskalStateData,
        isFinished: isMSTComplete,
        resultSummary: isMSTComplete
          ? `Cây khung nhỏ nhất (Kruskal) hoàn thành! Đã chọn đủ |V|-1 = ${selectedEdgeIds.length} cạnh, Tổng trọng số W = ${totalWeight}.`
          : undefined,
      });

      if (isMSTComplete) {
        break;
      }
    } else {
      // Reject - forms cycle!
      rejectedEdgeIds.push(currentEdge.id);
      edgeRows[i].status = 'rejected';
      edgeRows[i].reason = `Tạo chu trình: Cả hai đỉnh đều thuộc cùng cây con gốc '${rootU}'!`;

      steps.push({
        stepIndex: steps.length,
        totalSteps: 1,
        title: `LOẠI BỎ cạnh (${currentEdge.u} — ${currentEdge.v}) (Tạo chu trình)`,
        description: `Hai đỉnh ${currentEdge.u} và ${currentEdge.v} đã cùng thuộc một tập hợp liên thông (cùng gốc '${rootU}'). Nếu thêm cạnh này sẽ TẠO CHU TRÌNH! Bỏ qua cạnh này.`,
        activeVertices: [currentEdge.u, currentEdge.v],
        visitedVertices: [...new Set(selectedEdgeIds.flatMap(id => {
          const e = edges.find(edge => edge.id === id);
          return e ? [e.u, e.v] : [];
        }))],
        activeEdges: [],
        selectedEdges: [...selectedEdgeIds],
        rejectedEdges: [...rejectedEdgeIds],
        candidateEdges: [],
        stateData: {
          edgeRows: JSON.parse(JSON.stringify(edgeRows)),
          currentEdgeIndex: i,
          totalMSTWeight: totalWeight,
          mstEdgeCount: selectedEdgeIds.length,
          disjointSets: { ...parent },
          setGroups: getSetGroups(),
        } as KruskalStateData,
      });
    }
  }

  // Final summary if not ended early
  if (steps.length > 0 && !steps[steps.length - 1].isFinished) {
    const isComplete = selectedEdgeIds.length === vertices.length - 1;
    steps[steps.length - 1].isFinished = true;
    steps[steps.length - 1].resultSummary = isComplete
      ? `Cây khung nhỏ nhất hoàn thành: ${selectedEdgeIds.length} cạnh, Tổng trọng số = ${totalWeight}`
      : `Đồ thị không liên thông, chỉ tạo được rừng khung gồm ${selectedEdgeIds.length} cạnh (Tổng trọng số = ${totalWeight})`;
  }

  const total = steps.length;
  steps.forEach(s => { s.totalSteps = total; });

  return steps;
}
