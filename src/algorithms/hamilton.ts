import { GraphData, Step } from '../types/graph';

export interface HamiltonStateData {
  currentPath: string[];
  visitedList: string[];
  unvisitedList: string[];
  isBacktracking: boolean;
  backtrackReason?: string;
  foundSolution: boolean;
  mode: 'path' | 'circuit';
  backtrackCount: number;
}

export function generateHamiltonSteps(
  graph: GraphData,
  mode: 'path' | 'circuit' = 'path',
  startVertexId?: string
): Step[] {
  const steps: Step[] = [];
  const { vertices, edges } = graph;

  if (vertices.length === 0) return steps;

  // Build adjacency list
  const adj: Record<string, string[]> = {};
  const edgeMap: Record<string, string> = {}; // key "u-v" or "v-u" -> edgeId

  vertices.forEach(v => { adj[v.id] = []; });
  edges.forEach(e => {
    adj[e.u].push(e.v);
    adj[e.v].push(e.u);
    edgeMap[`${e.u}-${e.v}`] = e.id;
    edgeMap[`${e.v}-${e.u}`] = e.id;
  });

  // Sort neighbors for deterministic execution
  vertices.forEach(v => { adj[v.id].sort(); });

  const start = (startVertexId && vertices.some(v => v.id === startVertexId))
    ? startVertexId
    : vertices[0].id;

  const currentPath: string[] = [start];
  const visitedSet = new Set<string>([start]);
  let backtrackCount = 0;
  let solutionFound = false;
  let finalPath: string[] = [];

  // Helper to get edge IDs for a path
  function getPathEdgeIds(path: string[]): string[] {
    const ids: string[] = [];
    for (let i = 0; i < path.length - 1; i++) {
      const eId = edgeMap[`${path[i]}-${path[i + 1]}`];
      if (eId) ids.push(eId);
    }
    return ids;
  }

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    totalSteps: 1,
    title: `Bước 0: Bắt đầu tìm ${mode === 'circuit' ? 'Chu trình' : 'Đường đi'} Hamilton từ đỉnh ${start}`,
    description: `Khởi tạo đường đi xuất phát từ đỉnh ${start}. Quy tắc: Mỗi đỉnh chỉ được ghé thăm ĐÚNG MỘT LẦN.${mode === 'circuit' ? ' Kết thúc phải quay về đỉnh ban đầu ' + start + '.' : ''}`,
    activeVertices: [start],
    visitedVertices: [start],
    activeEdges: [],
    selectedEdges: [],
    rejectedEdges: [],
    candidateEdges: [],
    stateData: {
      currentPath: [start],
      visitedList: [start],
      unvisitedList: vertices.filter(v => v.id !== start).map(v => v.id),
      isBacktracking: false,
      foundSolution: false,
      mode,
      backtrackCount: 0,
    } as HamiltonStateData,
  });

  function backtrack(u: string): boolean {
    if (solutionFound) return true;

    // Check base condition
    if (currentPath.length === vertices.length) {
      if (mode === 'path') {
        solutionFound = true;
        finalPath = [...currentPath];
        return true;
      } else {
        // Mode circuit: need edge from u back to start
        const hasEdgeToStart = adj[u].includes(start);
        const closingEdgeId = edgeMap[`${u}-${start}`];
        if (hasEdgeToStart && closingEdgeId) {
          currentPath.push(start);
          solutionFound = true;
          finalPath = [...currentPath];
          return true;
        } else {
          backtrackCount++;
          steps.push({
            stepIndex: steps.length,
            totalSteps: 1,
            title: `Quay lui tại đỉnh ${u} (Không thể khép kín chu trình)`,
            description: `Đã đi qua tất cả ${vertices.length} đỉnh (${currentPath.join(' → ')}), nhưng không có cạnh từ đỉnh cuối ${u} quay về đỉnh bắt đầu ${start}. Phải quay lui!`,
            activeVertices: [u],
            visitedVertices: [...currentPath],
            activeEdges: [],
            selectedEdges: getPathEdgeIds(currentPath),
            rejectedEdges: [],
            candidateEdges: [],
            stateData: {
              currentPath: [...currentPath],
              visitedList: [...currentPath],
              unvisitedList: [],
              isBacktracking: true,
              backtrackReason: `Không có cạnh (${u} — ${start}) để khép kín chu trình`,
              foundSolution: false,
              mode,
              backtrackCount,
            } as HamiltonStateData,
          });
          return false;
        }
      }
    }

    // Try adjacent vertices
    const neighbors = adj[u];
    let branchTried = false;

    for (const v of neighbors) {
      if (solutionFound) return true;

      const edgeId = edgeMap[`${u}-${v}`];

      if (!visitedSet.has(v)) {
        branchTried = true;
        // Step forward
        visitedSet.add(v);
        currentPath.push(v);

        steps.push({
          stepIndex: steps.length,
          totalSteps: 1,
          title: `Thử nhánh mới: Di chuyển đến đỉnh ${v}`,
          description: `Từ ${u}, đi qua cạnh (${u} — ${v}) đến đỉnh ${v}. Đỉnh ${v} chưa được thăm. Đường đi hiện tại: ${currentPath.join(' → ')}. Còn ${vertices.length - currentPath.length} đỉnh chưa thăm.`,
          activeVertices: [v],
          visitedVertices: [...currentPath],
          activeEdges: edgeId ? [edgeId] : [],
          selectedEdges: getPathEdgeIds(currentPath),
          rejectedEdges: [],
          candidateEdges: [],
          stateData: {
            currentPath: [...currentPath],
            visitedList: [...currentPath],
            unvisitedList: vertices.filter(n => !visitedSet.has(n.id)).map(n => n.id),
            isBacktracking: false,
            foundSolution: false,
            mode,
            backtrackCount,
          } as HamiltonStateData,
        });

        const success = backtrack(v);
        if (success) return true;

        // Backtrack
        currentPath.pop();
        visitedSet.delete(v);
      }
    }

    // If reached here and not finished, we are forced to backtrack from u
    if (!solutionFound) {
      backtrackCount++;
      const lastVertex = currentPath.length > 0 ? currentPath[currentPath.length - 1] : start;
      steps.push({
        stepIndex: steps.length,
        totalSteps: 1,
        title: `Quay lui (Backtrack) từ đỉnh ${u} về ${lastVertex}`,
        description: `Từ đỉnh ${u}, tất cả các đỉnh kề [${neighbors.join(', ')}] đều đã được thăm hoặc các nhánh đều vào ngõ cụt. Thuật toán hủy lựa chọn ${u} và quay lại đỉnh ${lastVertex}.`,
        activeVertices: [lastVertex],
        visitedVertices: [...currentPath],
        activeEdges: [],
        selectedEdges: getPathEdgeIds(currentPath),
        rejectedEdges: edgeMap[`${lastVertex}-${u}`] ? [edgeMap[`${lastVertex}-${u}`]] : [],
        candidateEdges: [],
        stateData: {
          currentPath: [...currentPath],
          visitedList: [...currentPath],
          unvisitedList: vertices.filter(n => !visitedSet.has(n.id)).map(n => n.id),
          isBacktracking: true,
          backtrackReason: `Từ đỉnh ${u} không còn đỉnh kề chưa thăm hợp lệ`,
          foundSolution: false,
          mode,
          backtrackCount,
        } as HamiltonStateData,
      });
    }

    return false;
  }

  backtrack(start);

  // Final conclusion step
  if (solutionFound) {
    const finalEdges = getPathEdgeIds(finalPath);
    steps.push({
      stepIndex: steps.length,
      totalSteps: 1,
      title: `Thành công! Đã tìm thấy ${mode === 'circuit' ? 'Chu trình' : 'Đường đi'} Hamilton`,
      description: `Thuật toán hoàn tất sau ${backtrackCount} lần quay lui. Đã đi qua tất cả các đỉnh của đồ thị mỗi đỉnh đúng 1 lần: ${finalPath.join(' → ')}.`,
      activeVertices: finalPath,
      visitedVertices: vertices.map(v => v.id),
      activeEdges: [],
      selectedEdges: finalEdges,
      rejectedEdges: [],
      candidateEdges: [],
      stateData: {
        currentPath: finalPath,
        visitedList: finalPath,
        unvisitedList: [],
        isBacktracking: false,
        foundSolution: true,
        mode,
        backtrackCount,
      } as HamiltonStateData,
      isFinished: true,
      resultSummary: `${mode === 'circuit' ? 'Chu trình' : 'Đường đi'} Hamilton tìm được: ${finalPath.join(' → ')} (Tổng số đỉnh: ${vertices.length}, số lần quay lui: ${backtrackCount})`,
    });
  } else {
    steps.push({
      stepIndex: steps.length,
      totalSteps: 1,
      title: `Không tồn tại ${mode === 'circuit' ? 'Chu trình' : 'Đường đi'} Hamilton từ đỉnh ${start}`,
      description: `Đã thử vét cạn và quay lui tất cả các khả năng từ đỉnh ${start} (tổng cộng ${backtrackCount} lần quay lui) nhưng không tìm được hành trình thỏa mãn.`,
      activeVertices: [],
      visitedVertices: [],
      activeEdges: [],
      selectedEdges: [],
      rejectedEdges: [],
      candidateEdges: [],
      stateData: {
        currentPath: [],
        visitedList: [],
        unvisitedList: vertices.map(v => v.id),
        isBacktracking: false,
        foundSolution: false,
        mode,
        backtrackCount,
      } as HamiltonStateData,
      isFinished: true,
      resultSummary: `Không tìm thấy ${mode === 'circuit' ? 'chu trình' : 'đường đi'} Hamilton xuất phát từ ${start}.`,
    });
  }

  const total = steps.length;
  steps.forEach(s => { s.totalSteps = total; });

  return steps;
}
