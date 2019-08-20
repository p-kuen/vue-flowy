import { FlowElement } from './FlowElement';
import wrap from 'word-wrap';
export interface FlowChartElementOptions {
    label?: string;
    style?: ElementCSSInlineStyle;
}
export interface FlowChartOptions {
    direction: 'LR' | 'TB' | 'BT' | 'RL';
    wordWrap?: wrap.IOptions;
}
export declare class FlowChart {
    options: FlowChartOptions;
    elements: FlowElement[];
    constructor(options?: FlowChartOptions);
    addElement(id: string, options?: FlowChartElementOptions): FlowElement;
    destroy(): void;
    render(element: HTMLElement): void;
}
