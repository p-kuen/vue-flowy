import { Graph } from '@/main';
import { NodeOptions } from '@/Graph';
export declare function maxRank<T extends string>(graph: Graph<T>): number;
export declare function buildLayerMatrix<T extends string>(graph: Graph<T>): T[][];
export declare function addDummyNode(graph: Graph<string>, type: string, attrs: NodeOptions, name: string): string;
