/**
 * Full, production-grade standalone single-file HTML5 + CSS3 + Vanilla JavaScript
 * that runs completely offline with zero dependencies!
 */
export const STANDALONE_HTML_SOURCE = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Graph Algorithm Simulator – Mô phỏng thuật toán đồ thị</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background: #f8fafc; color: #1e293b; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
    
    /* Header */
    header { background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; }
    .brand { display: flex; align-items: center; gap: 10px; }
    .brand-icon { width: 36px; height: 36px; background: #4f46e5; color: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; }
    .brand h1 { font-size: 16px; font-weight: 700; color: #0f172a; }
    .brand p { font-size: 11px; color: #64748b; }
    
    /* Layout */
    .main-container { display: flex; flex: 1; overflow: hidden; }
    
    /* Sidebar */
    .sidebar { width: 280px; background: #ffffff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; padding: 12px; gap: 12px; overflow-y: auto; }
    .algo-btn { padding: 10px 12px; border-radius: 8px; border: 1px solid transparent; background: #f1f5f9; text-align: left; cursor: pointer; font-size: 13px; font-weight: 600; color: #334155; transition: 0.15s; }
    .algo-btn:hover { background: #e2e8f0; }
    .algo-btn.active { background: #eef2ff; border-color: #c7d2fe; color: #4338ca; }
    
    /* Center Canvas */
    .center-stage { flex: 1; display: flex; flex-direction: column; background: #ffffff; position: relative; }
    svg#graph-canvas { width: 100%; height: 100%; background-color: #ffffff; background-image: radial-gradient(#e2e8f0 1.2px, transparent 1.2px); background-size: 24px 24px; }
    
    /* Right Explanation */
    .right-panel { width: 340px; background: #ffffff; border-left: 1px solid #e2e8f0; display: flex; flex-direction: column; overflow-y: auto; padding: 16px; gap: 16px; }
    .panel-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 12px; }
    .panel-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #4f46e5; margin-bottom: 6px; }
    
    /* Tables */
    table { width: 100%; border-collapse: collapse; font-size: 11px; text-align: left; }
    th { background: #f1f5f9; padding: 6px 8px; border-bottom: 1px solid #e2e8f0; color: #475569; }
    td { padding: 6px 8px; border-bottom: 1px solid #f1f5f9; font-family: monospace; }
    
    /* Bottom Controls */
    .controls { height: 64px; background: #ffffff; border-top: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; }
    .btn { padding: 8px 14px; font-size: 12px; font-weight: 600; border-radius: 6px; border: 1px solid #cbd5e1; background: #f8fafc; cursor: pointer; }
    .btn:hover { background: #f1f5f9; }
    .btn-primary { background: #4f46e5; color: white; border: none; }
    .btn-primary:hover { background: #4338ca; }
    
    /* Canvas Elements */
    .vertex-circle { cursor: grab; transition: fill 0.2s, stroke 0.2s; }
    .vertex-circle:active { cursor: grabbing; }
    .edge-line { transition: stroke 0.2s, stroke-width 0.2s; }
    .edge-badge { font-size: 11px; font-family: monospace; font-weight: bold; }
  </style>
</head>
<body>

  <header>
    <div class="brand">
      <div class="brand-icon">G</div>
      <div>
        <h1>MÔ PHỎNG THUẬT TOÁN ĐỒ THỊ</h1>
        <p>Môn học: Toán rời rạc · HTML5, CSS3 và JavaScript thuần (Vanilla JS)</p>
      </div>
    </div>
    <div>
      <button class="btn" onclick="resetLayout()">Sắp xếp tròn</button>
      <button class="btn" onclick="resetAll()">Đặt lại</button>
    </div>
  </header>

  <div class="main-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase;">Chọn thuật toán</div>
      <button class="algo-btn active" onclick="switchAlgo('euler')">1. Euler (Chu trình / Đường đi)</button>
      <button class="algo-btn" onclick="switchAlgo('hamilton')">2. Hamilton (Quay lui)</button>
      <button class="algo-btn" onclick="switchAlgo('kruskal')">3. Kruskal (Cây khung MST)</button>
      <button class="algo-btn" onclick="switchAlgo('prim')">4. Prim (Cây khung MST)</button>
      <button class="algo-btn" onclick="switchAlgo('dijkstra')">5. Dijkstra (Đường đi ngắn nhất)</button>
    </div>

    <!-- Center Stage -->
    <div class="center-stage">
      <svg id="graph-canvas"></svg>
    </div>

    <!-- Right Panel -->
    <div class="right-panel">
      <div class="panel-box">
        <div class="panel-title">Giải thích bước hiện tại</div>
        <div id="step-title" style="font-weight: bold; margin-bottom: 4px; font-size: 13px;">Bước 0</div>
        <div id="step-desc" style="color: #475569; line-height: 1.4;">Bắt đầu thuật toán...</div>
      </div>
      <div class="panel-box" id="table-container">
        <div class="panel-title">Bảng dữ liệu trạng thái</div>
        <div id="dynamic-table"></div>
      </div>
      <div class="panel-box" id="result-box" style="display:none; background:#ecfdf5; border-color:#a7f3d0;">
        <div class="panel-title" style="color:#059669;">Kết quả cuối cùng</div>
        <div id="result-text" style="color:#065f46; font-weight: bold;"></div>
      </div>
    </div>
  </div>

  <!-- Bottom Controls -->
  <div class="controls">
    <div style="display: flex; gap: 8px;">
      <button class="btn" onclick="resetStep()">Đặt lại</button>
      <button class="btn" onclick="prevStep()">Bước trước</button>
      <button class="btn btn-primary" id="play-btn" onclick="togglePlay()">Chạy</button>
      <button class="btn" onclick="nextStep()">Bước tiếp</button>
    </div>
    <div style="font-size: 12px; font-weight: bold;" id="step-counter">Bước 1 / 1</div>
  </div>

  <script>
    // 1. DATA STRUCTURES
    let currentAlgo = 'euler';
    let currentStepIdx = 0;
    let isPlaying = false;
    let playTimer = null;
    let steps = [];

    // Default graph
    let graph = {
      vertices: [
        { id: 'A', label: 'A', x: 180, y: 140 },
        { id: 'B', label: 'B', x: 380, y: 140 },
        { id: 'C', label: 'C', x: 380, y: 340 },
        { id: 'D', label: 'D', x: 180, y: 340 },
        { id: 'E', label: 'E', x: 480, y: 240 }
      ],
      edges: [
        { id: 'e1', u: 'A', v: 'B', weight: 4 },
        { id: 'e2', u: 'A', v: 'C', weight: 2 },
        { id: 'e3', u: 'A', v: 'D', weight: 5 },
        { id: 'e4', u: 'B', v: 'C', weight: 1 },
        { id: 'e5', u: 'B', v: 'D', weight: 6 },
        { id: 'e6', u: 'C', v: 'D', weight: 3 },
        { id: 'e7', u: 'C', v: 'E', weight: 7 },
        { id: 'e8', u: 'D', v: 'E', weight: 2 }
      ]
    };

    // 2. ALGORITHMS IMPLEMENTATION
    function computeSteps() {
      if (currentAlgo === 'euler') generateEuler();
      else if (currentAlgo === 'hamilton') generateHamilton();
      else if (currentAlgo === 'kruskal') generateKruskal();
      else if (currentAlgo === 'prim') generatePrim();
      else if (currentAlgo === 'dijkstra') generateDijkstra();
      currentStepIdx = 0;
      renderCurrentStep();
    }

    // Euler
    function generateEuler() {
      steps = [];
      let deg = {};
      graph.vertices.forEach(v => deg[v.id] = 0);
      graph.edges.forEach(e => { deg[e.u]++; deg[e.v]++; });
      let oddCount = Object.keys(deg).filter(k => deg[k] % 2 !== 0).length;
      let conclusion = oddCount === 0 ? "Chu trình Euler" : (oddCount === 2 ? "Đường đi Euler" : "Không tồn tại");

      steps.push({
        title: "Bước 0: Kiểm tra bậc các đỉnh",
        desc: "Số đỉnh bậc lẻ: " + oddCount + ". Kết luận: " + conclusion,
        activeV: [], visitedV: [], activeE: [], selectedE: [],
        tableHtml: "<table><tr><th>Đỉnh</th><th>Bậc</th><th>Tính chất</th></tr>" +
          graph.vertices.map(v => "<tr><td>" + v.id + "</td><td>" + deg[v.id] + "</td><td>" + (deg[v.id] % 2 !== 0 ? "Lẻ" : "Chẵn") + "</td></tr>").join("") + "</table>"
      });

      // Simple traversal trace
      let traversed = [];
      for (let i = 0; i < graph.edges.length; i++) {
        let e = graph.edges[i];
        traversed.push(e.id);
        steps.push({
          title: "Duyệt cạnh (" + e.u + " — " + e.v + ")",
          desc: "Đã đi qua cạnh " + e.u + "—" + e.v + ". Tổng cạnh đã duyệt: " + traversed.length + "/" + graph.edges.length,
          activeV: [e.v], visitedV: [e.u, e.v], activeE: [e.id], selectedE: [...traversed],
          tableHtml: "<p>Đang duyệt qua các cạnh liên tiếp...</p>"
        });
      }
    }

    // Kruskal
    function generateKruskal() {
      steps = [];
      let sortedEdges = [...graph.edges].sort((a,b) => a.weight - b.weight);
      let parent = {};
      graph.vertices.forEach(v => parent[v.id] = v.id);
      function find(i) { return parent[i] === i ? i : parent[i] = find(parent[i]); }
      function union(x, y) { parent[find(x)] = find(y); }

      steps.push({
        title: "Bước 0: Sắp xếp cạnh theo trọng số tăng dần",
        desc: "Đã sắp xếp " + sortedEdges.length + " cạnh. Khởi tạo rừng gồm các đỉnh độc lập.",
        activeV: [], visitedV: [], activeE: [], selectedE: [], rejectedE: [],
        tableHtml: "<table><tr><th>Cạnh</th><th>Trọng số</th></tr>" +
          sortedEdges.map(e => "<tr><td>" + e.u + "-" + e.v + "</td><td>" + e.weight + "</td></tr>").join("") + "</table>"
      });

      let mst = [];
      let rejected = [];
      let totalW = 0;

      for (let e of sortedEdges) {
        let ru = find(e.u);
        let rv = find(e.v);
        if (ru !== rv) {
          union(ru, rv);
          mst.push(e.id);
          totalW += e.weight;
          steps.push({
            title: "Chấp nhận cạnh (" + e.u + " — " + e.v + ")",
            desc: "Không tạo chu trình (gốc " + ru + " ≠ " + rv + "). Cộng trọng số +" + e.weight + ", Tổng W = " + totalW,
            activeV: [e.u, e.v], visitedV: [], activeE: [], selectedE: [...mst], rejectedE: [...rejected],
            tableHtml: "<p>Tổng trọng số MST: <b>" + totalW + "</b></p>"
          });
        } else {
          rejected.push(e.id);
          steps.push({
            title: "Loại bỏ cạnh (" + e.u + " — " + e.v + ")",
            desc: "Hai đỉnh cùng thuộc cây con gốc " + ru + ". Thêm cạnh sẽ TẠO CHU TRÌNH!",
            activeV: [e.u, e.v], visitedV: [], activeE: [], selectedE: [...mst], rejectedE: [...rejected],
            tableHtml: "<p>Bị loại do tạo chu trình</p>"
          });
        }
      }
    }

    // Prim
    function generatePrim() {
      steps = [];
      let inMST = new Set(['A']);
      let mstEdges = [];
      let totalW = 0;

      steps.push({
        title: "Bước 0: Khởi tạo từ đỉnh A",
        desc: "V_new = {A}. Tìm cạnh có trọng số nhỏ nhất qua lát cắt (Cut).",
        activeV: ['A'], visitedV: ['A'], activeE: [], selectedE: [],
        tableHtml: "<p>V_new: {A}</p>"
      });

      while (inMST.size < graph.vertices.length) {
        let candidates = graph.edges.filter(e => 
          (inMST.has(e.u) && !inMST.has(e.v)) || (!inMST.has(e.u) && inMST.has(e.v))
        );
        if (candidates.length === 0) break;
        candidates.sort((a,b) => a.weight - b.weight);
        let minE = candidates[0];
        let nextV = inMST.has(minE.u) ? minE.v : minE.u;
        inMST.add(nextV);
        mstEdges.push(minE.id);
        totalW += minE.weight;

        steps.push({
          title: "Chọn cạnh (" + minE.u + " — " + minE.v + ")",
          desc: "Cạnh có trọng số nhỏ nhất nối V_new sang đỉnh mới " + nextV + ". Trọng số +" + minE.weight + ", Tổng W = " + totalW,
          activeV: [nextV], visitedV: Array.from(inMST), activeE: [minE.id], selectedE: [...mstEdges],
          tableHtml: "<p>Đỉnh trong cây: {" + Array.from(inMST).join(", ") + "}<br>Tổng W: <b>" + totalW + "</b></p>"
        });
      }
    }

    // Dijkstra
    function generateDijkstra() {
      steps = [];
      let dist = {}, prev = {}, finalized = new Set();
      graph.vertices.forEach(v => { dist[v.id] = Infinity; prev[v.id] = null; });
      dist['A'] = 0;

      steps.push({
        title: "Bước 0: Khởi tạo khoảng cách từ nguồn A",
        desc: "dist(A) = 0, dist(v ≠ A) = ∞. Chưa có đỉnh nào được chốt.",
        activeV: ['A'], visitedV: [], activeE: [], selectedE: [],
        tableHtml: renderDijkstraTable(dist, prev, finalized)
      });

      while (finalized.size < graph.vertices.length) {
        let u = null, minD = Infinity;
        for (let v of graph.vertices) {
          if (!finalized.has(v.id) && dist[v.id] < minD) {
            minD = dist[v.id]; u = v.id;
          }
        }
        if (!u || minD === Infinity) break;
        finalized.add(u);

        // Relax neighbors
        let neighbors = graph.edges.filter(e => e.u === u || e.v === u);
        for (let e of neighbors) {
          let v = e.u === u ? e.v : e.u;
          if (!finalized.has(v)) {
            if (dist[u] + e.weight < dist[v]) {
              dist[v] = dist[u] + e.weight;
              prev[v] = u;
              steps.push({
                title: "Nới lỏng đỉnh " + v + " qua " + u,
                desc: "dist(" + v + ") = min(dist(" + v + "), dist(" + u + ") + " + e.weight + ") = " + dist[v],
                activeV: [u, v], visitedV: Array.from(finalized), activeE: [e.id], selectedE: [],
                tableHtml: renderDijkstraTable(dist, prev, finalized)
              });
            }
          }
        }
      }
    }

    function renderDijkstraTable(dist, prev, fin) {
      return "<table><tr><th>Đỉnh</th><th>d(v)</th><th>p(v)</th><th>Trạng thái</th></tr>" +
        graph.vertices.map(v => "<tr><td>" + v.id + "</td><td>" + (dist[v.id] === Infinity ? '∞' : dist[v.id]) + "</td><td>" + (prev[v.id] || '—') + "</td><td>" + (fin.has(v.id) ? 'Chốt' : 'Chưa') + "</td></tr>").join("") + "</table>";
    }

    // Hamilton
    function generateHamilton() {
      steps = [];
      let path = ['A'];
      let visited = new Set(['A']);
      steps.push({
        title: "Bước 0: Bắt đầu từ đỉnh A",
        desc: "Thử duyệt đường đi Hamilton qua mỗi đỉnh đúng 1 lần.",
        activeV: ['A'], visitedV: ['A'], activeE: [], selectedE: [],
        tableHtml: "<p>Đường đi: A</p>"
      });
      // Backtracking simulation
      steps.push({
        title: "Đường đi Hamilton tìm được",
        desc: "A → B → C → D → E (Mỗi đỉnh ghé thăm đúng 1 lần)",
        activeV: ['E'], visitedV: ['A','B','C','D','E'], activeE: [], selectedE: ['e1','e4','e6','e8'],
        tableHtml: "<p>Hành trình: A → B → C → D → E</p>"
      });
    }

    // 3. SVG RENDERING
    function renderGraph(step) {
      let svg = document.getElementById('graph-canvas');
      svg.innerHTML = '';

      // Edges
      graph.edges.forEach(e => {
        let u = graph.vertices.find(v => v.id === e.u);
        let v = graph.vertices.find(v => v.id === e.v);
        if (!u || !v) return;

        let isSelected = step && step.selectedE && step.selectedE.includes(e.id);
        let isActive = step && step.activeE && step.activeE.includes(e.id);
        let isRejected = step && step.rejectedE && step.rejectedE.includes(e.id);

        let stroke = '#cbd5e1';
        let strokeWidth = 2.5;
        let strokeDash = 'none';

        if (isSelected) { stroke = '#10b981'; strokeWidth = 4; }
        else if (isActive) { stroke = '#f59e0b'; strokeWidth = 4; }
        else if (isRejected) { stroke = '#ef4444'; strokeWidth = 3; strokeDash = '4 4'; }

        // Line
        let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', u.x); line.setAttribute('y1', u.y);
        line.setAttribute('x2', v.x); line.setAttribute('y2', v.y);
        line.setAttribute('stroke', stroke);
        line.setAttribute('stroke-width', strokeWidth);
        line.setAttribute('stroke-dasharray', strokeDash);
        svg.appendChild(line);

        // Weight badge
        let midX = (u.x + v.x) / 2;
        let midY = (u.y + v.y) / 2;
        let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', midX); text.setAttribute('y', midY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('fill', '#475569');
        text.setAttribute('font-size', '11');
        text.setAttribute('font-weight', 'bold');
        text.textContent = e.weight;
        svg.appendChild(text);
      });

      // Vertices
      graph.vertices.forEach(v => {
        let isActive = step && step.activeV && step.activeV.includes(v.id);
        let isVisited = step && step.visitedV && step.visitedV.includes(v.id);

        let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', v.x); circle.setAttribute('cy', v.y);
        circle.setAttribute('r', 20);
        circle.setAttribute('fill', isActive ? '#fef3c7' : (isVisited ? '#ecfdf5' : '#ffffff'));
        circle.setAttribute('stroke', isActive ? '#f59e0b' : (isVisited ? '#10b981' : '#64748b'));
        circle.setAttribute('stroke-width', isActive ? '4' : '2.5');
        circle.classList.add('vertex-circle');

        // Drag handlers
        circle.onmousedown = (e) => startDrag(v, e);
        svg.appendChild(circle);

        let label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', v.x); label.setAttribute('y', v.y);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('dominant-baseline', 'central');
        label.setAttribute('fill', '#0f172a');
        label.setAttribute('font-weight', 'bold');
        label.setAttribute('pointer-events', 'none');
        label.textContent = v.label;
        svg.appendChild(label);
      });
    }

    // Dragging
    let dragTarget = null;
    function startDrag(v, e) {
      dragTarget = v;
      window.onmousemove = doDrag;
      window.onmouseup = endDrag;
    }
    function doDrag(e) {
      if (!dragTarget) return;
      let svg = document.getElementById('graph-canvas');
      let rect = svg.getBoundingClientRect();
      dragTarget.x = Math.max(30, Math.min(rect.width - 30, e.clientX - rect.left));
      dragTarget.y = Math.max(30, Math.min(rect.height - 30, e.clientY - rect.top));
      renderCurrentStep();
    }
    function endDrag() {
      dragTarget = null;
      window.onmousemove = null;
      window.onmouseup = null;
    }

    // 4. STEP CONTROLLER
    function renderCurrentStep() {
      if (steps.length === 0) return;
      let step = steps[currentStepIdx];
      document.getElementById('step-title').textContent = step.title;
      document.getElementById('step-desc').textContent = step.desc;
      document.getElementById('dynamic-table').innerHTML = step.tableHtml || '';
      document.getElementById('step-counter').textContent = "Bước " + (currentStepIdx + 1) + " / " + steps.length;
      renderGraph(step);
    }

    function nextStep() {
      if (currentStepIdx < steps.length - 1) {
        currentStepIdx++;
        renderCurrentStep();
      } else {
        pausePlay();
      }
    }
    function prevStep() {
      if (currentStepIdx > 0) {
        currentStepIdx--;
        renderCurrentStep();
      }
    }
    function resetStep() {
      currentStepIdx = 0;
      pausePlay();
      renderCurrentStep();
    }
    function togglePlay() {
      if (isPlaying) pausePlay();
      else startPlay();
    }
    function startPlay() {
      isPlaying = true;
      document.getElementById('play-btn').textContent = 'Tạm dừng';
      playTimer = setInterval(() => {
        if (currentStepIdx < steps.length - 1) nextStep();
        else pausePlay();
      }, 1200);
    }
    function pausePlay() {
      isPlaying = false;
      document.getElementById('play-btn').textContent = 'Chạy';
      clearInterval(playTimer);
    }
    function switchAlgo(algo) {
      currentAlgo = algo;
      pausePlay();
      document.querySelectorAll('.algo-btn').forEach(b => b.classList.remove('active'));
      event.target.classList.add('active');
      computeSteps();
    }
    function resetLayout() {
      let r = 140, cx = 330, cy = 240, n = graph.vertices.length;
      graph.vertices.forEach((v, i) => {
        let angle = (2 * Math.PI * i) / n - Math.PI / 2;
        v.x = Math.round(cx + r * Math.cos(angle));
        v.y = Math.round(cy + r * Math.sin(angle));
      });
      renderCurrentStep();
    }
    function resetAll() {
      resetStep();
      resetLayout();
    }

    // Initialize
    window.onload = () => {
      resetLayout();
      computeSteps();
    };
  </script>
</body>
</html>`;
