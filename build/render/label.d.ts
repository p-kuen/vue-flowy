import { Node } from "@/Graph";
import { Selection } from "d3-selection";
import { SVGGElementSelection } from "@/types/d3-extra";
export declare function addLabel<T extends string>(labelGroup: SVGGElementSelection, node: Node<T>): Selection<SVGGElement, any, any, any>;
