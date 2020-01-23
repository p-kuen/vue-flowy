import { BaseType } from "d3";
interface GraphOptions {
    multigraph?: boolean;
    compound?: boolean;
}
export interface GraphObject {
    rankdir: 'LR' | 'TB' | 'BT' | 'RL';
    marginx?: number;
    marginy?: number;
}
export interface NodeOptions {
    label?: string;
    shape?: 'rect' | 'circle';
    rx?: number;
    ry?: number;
}
export interface InternalNodeOptions {
    width: number;
    height: number;
    padding: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    parent: null;
    children: Record<string, any>;
    labelType: 'svg' | 'html' | 'text';
    svg?: BaseType;
}
export declare type Node = NodeOptions & InternalNodeOptions;
export interface EdgeOptions {
    label?: string;
}
export default class Graph<T extends string> {
    private compound;
    graph?: GraphObject;
    private nodes;
    private edges;
    constructor(options?: GraphOptions);
    setGraph(graph: GraphObject): this;
    setNode(id: T, options: NodeOptions): this;
    node(id: T): Record<T, Node>[T];
    get nodeIds(): T[];
    setEdge(fromId: T, toId: T, options: EdgeOptions): void;
    edge(id: string): EdgeOptions;
    get edgeIds(): string[];
    createEdgeId(fromId: T, toId: T): string;
}
export {};
