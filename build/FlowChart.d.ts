import { FlowElement } from './FlowElement';
import { NodeOptions } from './Graph';
export interface FlowChartOptions {
    direction: 'LR' | 'TB' | 'BT' | 'RL';
}
export default class FlowChart {
    options: FlowChartOptions;
    elements: FlowElement[];
    constructor(options?: FlowChartOptions);
    addElement(id: string, options?: NodeOptions): FlowElement;
    destroy(): void;
    render(element: HTMLElement): void;
}
