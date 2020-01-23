import { Selection } from "d3";
import Graph from './Graph';
export declare class Renderer<T extends string> {
    graph: Graph<T>;
    constructor(graph: Graph<T>);
    preprocess(): void;
    render(element: Selection<any, any, any, any>, graph: Graph<T>): void;
}
