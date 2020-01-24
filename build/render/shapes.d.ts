import { Node } from '../Graph';
import { BaseTypeSelection } from '../types/d3-extra';
export declare function rect(parent: BaseTypeSelection, bbox: DOMRect, node: Node<string>): import("d3-selection").Selection<SVGRectElement, any, any, any>;
export declare function ellipse(parent: BaseTypeSelection, bbox: DOMRect, node: Node<string>): import("d3-selection").Selection<SVGEllipseElement, any, any, any>;
export declare function circle(parent: BaseTypeSelection, bbox: DOMRect, node: Node<string>): import("d3-selection").Selection<SVGCircleElement, any, any, any>;
export declare function diamond(parent: BaseTypeSelection, bbox: DOMRect, node: Node<string>): import("d3-selection").Selection<SVGPolygonElement, any, any, any>;
