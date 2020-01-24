import { AnySelection } from "@/types/d3-extra";
import Graph from "@/Graph";
export declare function createNodes<T extends string>(selection: AnySelection, graph: Graph<T>): import("d3-selection").Selection<import("d3-selection").BaseType, T, any, any>;
export declare function positionNodes<T extends string>(selection: AnySelection, graph: Graph<T>): void;
