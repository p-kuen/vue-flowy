import { FlowChartElementOptions } from './FlowChart';

export interface FlowElementEdgeOptions {
  label?: string
}

export interface FlowElementEdge {
  otherId: string
  options?: FlowElementEdgeOptions
}

export class FlowElement {
  id: string
  options: FlowChartElementOptions
  edges: FlowElementEdge[] = []

  constructor(id: string, options?: FlowChartElementOptions) {
    this.id = id
    this.options = Object.assign({}, options)
  }

  leadsTo(destinationElement: FlowElement, options?: FlowElementEdgeOptions) {
    this.edges.push({otherId: destinationElement.id, options})
    return destinationElement
  }
}