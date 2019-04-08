import { FlowChartElementOptions } from './FlowChart';

export interface FlowElementEdgeOptions {
  label?: string
}

export interface FlowElementEdge {
  otherId: string
  options?: FlowElementEdgeOptions
}

export interface FlowElementListener {
  event: string
  callback: () => void
}

export const flowElementsById: Record<string, FlowElement> = {}

export class FlowElement {
  id: string
  options: FlowChartElementOptions
  edges: FlowElementEdge[] = []
  listeners: FlowElementListener[] = []

  constructor(id: string, options?: FlowChartElementOptions) {
    this.id = id
    this.options = Object.assign({}, options)
    this.register()
  }

  static getById(id: string) {
    return flowElementsById[id]
  }

  leadsTo(destinationElement: FlowElement, options?: FlowElementEdgeOptions) {
    this.edges.push({otherId: destinationElement.id, options})
    return destinationElement
  }

  private register() {
    if (flowElementsById[this.id]) {
      throw new Error('ID ' + this.id + 'is already registered!')
    }

    flowElementsById[this.id] = this
  }

  on(event: string, callback: () => void) {
    this.listeners.push({event, callback})
  }
}