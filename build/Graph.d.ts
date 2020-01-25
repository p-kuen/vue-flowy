import { BaseType } from "d3";
interface GraphOptions {
    directed?: boolean;
    multigraph?: boolean;
    compound?: boolean;
}
export interface GraphObject {
    rankdir: 'LR' | 'TB' | 'BT' | 'RL';
    marginx?: number;
    marginy?: number;
    ranker?: 'network-simplex' | 'tight-tree' | 'longest-path';
}
export interface NodeOptions {
    label?: string;
    shape?: 'rect' | 'circle';
    rx?: number;
    ry?: number;
}
export interface InternalNodeOptions<T extends string> {
    id: T;
    width: number;
    height: number;
    x: number;
    y: number;
    padding: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    parent?: T;
    children: Record<string, any>;
    inEdges: Record<string, Edge<T>>;
    outEdges: Record<string, Edge<T>>;
    predecessors: Record<string, Record<T, any>>;
    successors: Record<string, Record<T, any>>;
    labelType: 'svg' | 'html' | 'text';
    svg?: BaseType;
    rank?: number;
    order: number;
    low?: number;
    lim?: number;
}
export declare type Node<T extends string> = NodeOptions & InternalNodeOptions<T>;
export interface EdgeOptions {
    label?: string;
}
interface InternalEdgeOptions<T extends string> {
    fromId: T;
    toId: T;
    minlen: number;
    weight: number;
    cutvalue?: number;
}
declare type Edge<T extends string> = EdgeOptions & InternalEdgeOptions<T>;
export default class Graph<T extends string> {
    directed: boolean;
    private compound;
    graph?: GraphObject;
    nodes: Record<T, Node<T>>;
    private edges;
    constructor(options?: GraphOptions);
    setGraph(graph: GraphObject): this;
    setNode(id: T, options: NodeOptions): this;
    node(id: T): Record<T, Node<T>>[T];
    hasNode(id: T): boolean;
    get nodeIds(): T[];
    get nodeObjects(): Node<T>[];
    setEdge(fromId: T, toId: T, options: EdgeOptions): void;
    edge(childId: T, parentId: T, name?: string): Edge<T>;
    get edgeIds(): string[];
    get edgeObjects(): Edge<T>[];
    inEdgeObjects(id: T, fromId?: T): Edge<T>[];
    outEdgeObjects(id: T, toId?: T): Edge<T>[];
    nodeEdgeObjects(fromId: T, toId?: T): Edge<T>[];
    hasEdge(fromId: T, toId: T, name?: string): boolean;
    predecessors(id: T): T[];
    successors(id: T): T[];
    neighbors(id: T): T[];
    get rootNodeIds(): T[];
    createEdgeId<F, To>(fromId: F, toId: To): string;
}
export {};
