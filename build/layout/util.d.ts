import Graph from "@/Graph";
export declare function maxRank<T extends string>(graph: Graph<T>): number;
export declare function buildLayerMatrix<T extends string>(graph: Graph<T>): T[][];
