export interface Vertex {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface Edge {
  id: string;
  u: string; // vertex id
  v: string; // vertex id
  weight: number;
}

export interface GraphData {
  vertices: Vertex[];
  edges: Edge[];
}

export type AlgorithmType = 'euler' | 'hamilton' | 'kruskal' | 'prim' | 'dijkstra' | 'compare';

export type EdgeState = 'normal' | 'active' | 'selected' | 'rejected' | 'candidate';
export type VertexState = 'normal' | 'active' | 'visited' | 'start' | 'target' | 'unvisited';

export interface Step {
  stepIndex: number;
  totalSteps: number;
  title: string;
  description: string;
  
  // Visual states
  activeVertices: string[];
  visitedVertices: string[];
  activeEdges: string[];
  selectedEdges: string[];
  rejectedEdges: string[];
  candidateEdges: string[];
  
  // Custom tabular / algorithm specific data
  stateData: any;
  formula?: string;
  pseudocodeLine?: number;
  isFinished?: boolean;
  resultSummary?: string;
}

export interface AlgorithmMetadata {
  id: AlgorithmType;
  name: string;
  shortDesc: string;
  problem: string;
  coreIdea: string;
  timeComplexity: string;
  spaceComplexity: string;
  conditions: string[];
  pseudocode: string[];
}
