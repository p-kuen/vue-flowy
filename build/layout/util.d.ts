import { Graph } from '@/main';
import { NodeOptions } from '@/Graph';
export declare function maxRank(graph: Graph): number;
export declare function buildLayerMatrix(graph: Graph): string[][];
export declare function addDummyNode(graph: Graph, type: string, attrs: NodeOptions, name: string): string;
