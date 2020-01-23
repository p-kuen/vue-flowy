import { BaseType } from "d3"

interface GraphOptions {
  multigraph?: boolean
  compound?: boolean
}

export interface GraphObject {
  rankdir: 'LR' | 'TB' | 'BT' | 'RL'
  marginx?: number
  marginy?: number
}

export interface NodeOptions {
  label?: string
  shape?: 'rect' | 'circle'
  rx?: number
  ry?: number
}

export interface InternalNodeOptions {
  width: number
  height: number
  padding: {
    left: number
    right: number
    top: number
    bottom: number
  },
  parent: null
  children: Record<string, any>
  labelType: 'svg' | 'html' | 'text'
  svg?: BaseType
}

export type Node = NodeOptions & InternalNodeOptions

export interface EdgeOptions {
  label?: string
}

type Edge = EdgeOptions

const delimiter = '\x01'

export default class Graph<T extends string> {
  private compound: boolean = false

  public graph?: GraphObject
  private nodes: Record<T, Node> = {} as Record<T, Node>
  private edges: Record<string, Edge> = {}

  constructor(options?: GraphOptions) {
    this.compound = options?.compound ?? false
  }

  setGraph(graph: GraphObject) {
    this.graph = graph
    return this
  }

  setNode(id: T, options: NodeOptions) {
    const defaultOptions: InternalNodeOptions = {
      width: 10,
      height: 10,
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      },
      parent: null,
      children: {},
      labelType: 'text'
    }

    this.nodes[id] = Object.assign(defaultOptions, options)
    return this
  }

  node(id: T) {
    return this.nodes[id]
  }

  get nodeIds() {
    return Object.keys(this.nodes) as Array<T>
  }

  setEdge(fromId: T, toId: T, options: EdgeOptions) {
    const id = this.createEdgeId(fromId, toId)

    this.edges[id] = options
  }

  edge(id: string) {
    return this.edges[id]
  }

  get edgeIds() {
    return Object.keys(this.edges)
  }

  createEdgeId(fromId: T, toId: T) {
    return fromId + delimiter + toId
  }
}