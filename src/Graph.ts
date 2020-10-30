import {BaseType} from 'd3-selection'

interface GraphOptions {
  directed?: boolean
  multigraph?: boolean
  compound?: boolean
}

export interface GraphObject {
  rankdir: 'LR' | 'TB' | 'BT' | 'RL'
  marginx?: number
  marginy?: number
  ranker?: 'network-simplex' | 'tight-tree' | 'longest-path'
}

export interface NodeOptions {
  label?: string
  shape?: 'rect' | 'circle'
  rx?: number
  ry?: number
  dummy?: string
}

export interface InternalNodeOptions {
  id: string
  width: number
  height: number
  x: number
  y: number
  padding: {
    left: number
    right: number
    top: number
    bottom: number
  }
  parent?: string
  children: Record<string, Node>
  inEdges: Record<string, Edge>
  outEdges: Record<string, Edge>
  predecessors: Record<string, Record<string, any>>
  successors: Record<string, Record<string, any>>
  labelType: 'svg' | 'html' | 'text'
  svg?: BaseType
  rank?: number
  order: number
  low?: number
  lim?: number
}

export type Node = NodeOptions & InternalNodeOptions

export interface EdgeOptions {
  label?: string
}

interface InternalEdgeOptions {
  fromId: string
  toId: string
  minlen: number
  weight: number
  cutvalue?: number
}

export type Edge = EdgeOptions & InternalEdgeOptions

const delimiter = '\x01'

function edgeArgsToId<T extends string>(directed: boolean, fromId: T, toId: T, name?: string) {
  if (!directed && fromId > toId) {
    fromId = toId
    toId = fromId
  }

  return fromId + delimiter + toId + delimiter + (name || '')
}

export default class Graph {
  public directed: boolean

  public graph?: GraphObject
  public nodes = {} as Record<string, Node>
  private edges: Record<string, Edge> = {}

  constructor(options?: GraphOptions) {
    this.directed = options?.directed ?? false
  }

  setGraph(graph: GraphObject) {
    this.graph = graph
    return this
  }

  setNode(id: string, options: NodeOptions) {
    const defaultOptions: InternalNodeOptions = {
      id,
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      },
      children: {},
      inEdges: {},
      outEdges: {},
      predecessors: {},
      successors: {},
      labelType: 'text',
      order: 0
    }

    console.log('add node', id, options)

    this.nodes[id] = Object.assign(defaultOptions, options)
    return this.nodes[id]
  }

  node(id: string) {
    if (!this.nodes[id]) {
      throw new Error(`Node with id ${id} does not exist!`)
    }

    return this.nodes[id]
  }

  hasNode(id: string) {
    return this.nodes[id] !== undefined
  }

  get nodeIds() {
    return Object.keys(this.nodes)
  }

  get nodeObjects() {
    return Object.values(this.nodes)
  }

  setEdge(fromId: string, toId: string, options: EdgeOptions) {
    const id = this.createEdgeId(fromId, toId)

    const fromNode = this.node(fromId)
    const toNode = this.node(toId)

    const defaultOptions: InternalEdgeOptions = {
      fromId,
      toId,
      minlen: 0,
      weight: 1
    }

    const edgeObject = Object.assign(defaultOptions, options)

    fromNode.outEdges[id] = edgeObject
    toNode.inEdges[id] = edgeObject

    this.edges[id] = edgeObject
  }

  edge(childId: string, parentId: string, name?: string) {
    const edgeId = edgeArgsToId(this.directed, childId, parentId, name)
    return this.edges[edgeId]
  }

  get edgeIds() {
    return Object.keys(this.edges)
  }

  get edgeObjects() {
    return Object.values(this.edges)
  }

  inEdgeObjects(id: string, fromId?: string) {
    const inEdges = this.nodes[id].inEdges

    if (!inEdges) {
      return []
    }

    const inEdgeObjects = Object.values(inEdges)

    if (!fromId) {
      return inEdgeObjects
    }

    return inEdgeObjects.filter(edge => edge.fromId === fromId)
  }

  outEdgeObjects(id: string, toId?: string) {
    const outEdges = this.nodes[id].outEdges

    if (!outEdges) {
      return []
    }

    const outEdgeObjects = Object.values(outEdges)

    if (!toId) {
      return outEdgeObjects
    }

    return outEdgeObjects.filter(edge => edge.toId === toId)
  }

  nodeEdgeObjects(fromId: string, toId?: string) {
    const inEdges = this.inEdgeObjects(fromId, toId)
    const outEdges = this.outEdgeObjects(fromId, toId)

    return inEdges.concat(outEdges)
  }

  hasEdge(fromId: string, toId: string, name?: string) {
    const edgeId = edgeArgsToId(this.directed, fromId, toId, name)
    return this.edges[edgeId] !== undefined
  }

  predecessors(id: string) {
    const nodes = this.node(id).predecessors
    return Object.keys(nodes)
  }

  successors(id: string) {
    const nodes = this.node(id).successors
    return Object.keys(nodes)
  }

  neighbors(id: string) {
    const predecessors = this.predecessors(id)
    const successors = this.successors(id)

    return predecessors.concat(successors)
  }

  get rootNodeIds() {
    return this.nodeIds.filter(id => Object.keys(this.node(id).inEdges).length === 0)
  }

  createEdgeId<F, To>(fromId: F, toId: To) {
    return fromId + delimiter + toId
  }
}
