import { GraphData } from '../types/graph';

export const SAMPLE_GRAPHS: Record<string, { name: string; description: string; data: GraphData }> = {
  eulerDefault: {
    name: 'Đồ thị Euler chuẩn (Đề bài)',
    description: 'Đồ thị có 4 đỉnh A, B, C, D với 5 cạnh. Có 2 đỉnh bậc lẻ (A bậc 3, C bậc 3, B bậc 2, D bậc 2) nên tồn tại đường đi Euler.',
    data: {
      vertices: [
        { id: 'A', label: 'A', x: 200, y: 150 },
        { id: 'B', label: 'B', x: 450, y: 150 },
        { id: 'C', label: 'C', x: 450, y: 380 },
        { id: 'D', label: 'D', x: 200, y: 380 },
      ],
      edges: [
        { id: 'e1', u: 'A', v: 'B', weight: 1 },
        { id: 'e2', u: 'B', v: 'C', weight: 1 },
        { id: 'e3', u: 'C', v: 'D', weight: 1 },
        { id: 'e4', u: 'D', v: 'A', weight: 1 },
        { id: 'e5', u: 'A', v: 'C', weight: 1 },
      ],
    },
  },
  eulerCircuit: {
    name: 'Đồ thị Chu trình Euler (Tất cả bậc chẵn)',
    description: 'Đồ thị liên thông 5 đỉnh, tất cả đỉnh đều có bậc 2 hoặc 4, tồn tại chu trình Euler đi qua tất cả cạnh và quay lại điểm xuất phát.',
    data: {
      vertices: [
        { id: 'A', label: 'A', x: 325, y: 120 },
        { id: 'B', label: 'B', x: 500, y: 240 },
        { id: 'C', label: 'C', x: 430, y: 410 },
        { id: 'D', label: 'D', x: 220, y: 410 },
        { id: 'E', label: 'E', x: 150, y: 240 },
      ],
      edges: [
        { id: 'ec1', u: 'A', v: 'B', weight: 1 },
        { id: 'ec2', u: 'B', v: 'C', weight: 1 },
        { id: 'ec3', u: 'C', v: 'D', weight: 1 },
        { id: 'ec4', u: 'D', v: 'E', weight: 1 },
        { id: 'ec5', u: 'E', v: 'A', weight: 1 },
        { id: 'ec6', u: 'A', v: 'C', weight: 1 },
        { id: 'ec7', u: 'A', v: 'D', weight: 1 },
      ],
    },
  },
  hamiltonDefault: {
    name: 'Đồ thị Hamilton chuẩn (Đề bài)',
    description: 'Đồ thị gồm 5 đỉnh A, B, C, D, E và 7 cạnh: A-B, A-C, B-C, B-D, C-D, C-E, D-E.',
    data: {
      vertices: [
        { id: 'A', label: 'A', x: 160, y: 260 },
        { id: 'B', label: 'B', x: 290, y: 150 },
        { id: 'C', label: 'C', x: 340, y: 360 },
        { id: 'D', label: 'D', x: 470, y: 170 },
        { id: 'E', label: 'E', x: 520, y: 340 },
      ],
      edges: [
        { id: 'h1', u: 'A', v: 'B', weight: 1 },
        { id: 'h2', u: 'A', v: 'C', weight: 1 },
        { id: 'h3', u: 'B', v: 'C', weight: 1 },
        { id: 'h4', u: 'B', v: 'D', weight: 1 },
        { id: 'h5', u: 'C', v: 'D', weight: 1 },
        { id: 'h6', u: 'C', v: 'E', weight: 1 },
        { id: 'h7', u: 'D', v: 'E', weight: 1 },
      ],
    },
  },
  mstDefault: {
    name: 'Đồ thị Kruskal & Prim chuẩn (Đề bài)',
    description: 'Đồ thị có trọng số 5 đỉnh A, B, C, D, E với 8 cạnh: A-B:4, A-C:2, A-D:5, B-C:1, B-D:6, C-D:3, C-E:7, D-E:2.',
    data: {
      vertices: [
        { id: 'A', label: 'A', x: 170, y: 260 },
        { id: 'B', label: 'B', x: 310, y: 140 },
        { id: 'C', label: 'C', x: 320, y: 370 },
        { id: 'D', label: 'D', x: 480, y: 160 },
        { id: 'E', label: 'E', x: 520, y: 360 },
      ],
      edges: [
        { id: 'm1', u: 'A', v: 'B', weight: 4 },
        { id: 'm2', u: 'A', v: 'C', weight: 2 },
        { id: 'm3', u: 'A', v: 'D', weight: 5 },
        { id: 'm4', u: 'B', v: 'C', weight: 1 },
        { id: 'm5', u: 'B', v: 'D', weight: 6 },
        { id: 'm6', u: 'C', v: 'D', weight: 3 },
        { id: 'm7', u: 'C', v: 'E', weight: 7 },
        { id: 'm8', u: 'D', v: 'E', weight: 2 },
      ],
    },
  },
  dijkstraNetwork: {
    name: 'Mạng lưới Dijkstra chuẩn (A → E)',
    description: 'Mạng lưới gồm 6 đỉnh A, B, C, D, E, F có trọng số không âm, tối ưu tìm đường ngắn nhất từ A đến E.',
    data: {
      vertices: [
        { id: 'A', label: 'A', x: 140, y: 250 },
        { id: 'B', label: 'B', x: 280, y: 150 },
        { id: 'C', label: 'C', x: 290, y: 360 },
        { id: 'D', label: 'D', x: 440, y: 150 },
        { id: 'E', label: 'E', x: 550, y: 260 },
        { id: 'F', label: 'F', x: 430, y: 370 },
      ],
      edges: [
        { id: 'd1', u: 'A', v: 'B', weight: 4 },
        { id: 'd2', u: 'A', v: 'C', weight: 2 },
        { id: 'd3', u: 'B', v: 'C', weight: 1 },
        { id: 'd4', u: 'B', v: 'D', weight: 5 },
        { id: 'd5', u: 'C', v: 'D', weight: 8 },
        { id: 'd6', u: 'C', v: 'F', weight: 4 },
        { id: 'd7', u: 'D', v: 'E', weight: 2 },
        { id: 'd8', u: 'D', v: 'F', weight: 1 },
        { id: 'd9', u: 'F', v: 'E', weight: 3 },
      ],
    },
  },
  completeK5: {
    name: 'Đồ thị đầy đủ K5 (5 đỉnh)',
    description: 'Đồ thị 5 đỉnh trong đó mọi cặp đỉnh đều có cạnh nối, dùng để thử nghiệm Hamilton và cây khung nhỏ nhất.',
    data: {
      vertices: [
        { id: 'A', label: 'A', x: 330, y: 120 },
        { id: 'B', label: 'B', x: 500, y: 230 },
        { id: 'C', label: 'C', x: 440, y: 400 },
        { id: 'D', label: 'D', x: 220, y: 400 },
        { id: 'E', label: 'E', x: 160, y: 230 },
      ],
      edges: [
        { id: 'k1', u: 'A', v: 'B', weight: 3 },
        { id: 'k2', u: 'A', v: 'C', weight: 5 },
        { id: 'k3', u: 'A', v: 'D', weight: 4 },
        { id: 'k4', u: 'A', v: 'E', weight: 2 },
        { id: 'k5', u: 'B', v: 'C', weight: 1 },
        { id: 'k6', u: 'B', v: 'D', weight: 6 },
        { id: 'k7', u: 'B', v: 'E', weight: 7 },
        { id: 'k8', u: 'C', v: 'D', weight: 3 },
        { id: 'k9', u: 'C', v: 'E', weight: 8 },
        { id: 'k10', u: 'D', v: 'E', weight: 4 },
      ],
    },
  },
};
