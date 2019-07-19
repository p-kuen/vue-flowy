import { FlowChartElementOptions } from './FlowChart';
export interface FlowElementEdgeOptions {
    label?: string;
}
export interface FlowElementEdge {
    otherId: string;
    options?: FlowElementEdgeOptions;
}
export interface FlowElementListener {
    event: string;
    callback: () => void;
}
export declare const flowElementsById: Record<string, FlowElement>;
export declare class FlowElement {
    id: string;
    options: FlowChartElementOptions;
    edges: FlowElementEdge[];
    listeners: FlowElementListener[];
    constructor(id: string, options?: FlowChartElementOptions);
    static getById(id: string): FlowElement;
    leadsTo(destinationElement: FlowElement, options?: FlowElementEdgeOptions): FlowElement;
    unregister(): void;
    private register;
    on(event: string, callback: () => void): void;
}
