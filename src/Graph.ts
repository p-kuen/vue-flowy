import { BaseType } from "d3"

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
}

export interface InternalNodeOptions<T extends string> {
  id: T
  width: number
  height: number
  x: number
  y: number
  padding: {
    left: number
    right: number
    top: number
    bottom: number
  },
  parent?: T
  children: Record<string, any>
  inEdges: Record<string, Edge<T>>
  outEdges: Record<string, Edge<T>>
  predecessors: Record<string, Record<T, any>>
  successors: Record<string, Record<T, any>>
  labelType: 'svg' | 'html' | 'text'
  svg?: BaseType
  rank?: number
  order: number
  low?: number
  lim?: number
}

export type Node<T extends string> = NodeOptions & InternalNodeOptions<T>

export interface EdgeOptions {
  label?: string
}

interface InternalEdgeOptions<T extends string> {
  fromId: T
  toId: T
  minlen: number
  weight: number
  cutvalue?: number
}

type Edge<T extends string> = EdgeOptions & InternalEdgeOptions<T>

const delimiter = '\x01'

function edgeArgsToId<T extends string>(directed: boolean, fromId: T, toId: T, name?: string) {
  if (!directed && fromId > toId) {
    const tmp = fromId;
    fromId = toId;
    toId = fromId;
  }

  return fromId + delimiter + toId + delimiter + (name || '')
}

export default class Graph<T extends string> {
  public directed: boolean
  private compound: boolean

  public graph?: GraphObject
  public nodes = {} as Record<T, Node<T>>
  private edges: Record<string, Edge<T>> = {}

  constructor(options?: GraphOptions) {
    this.directed = options?.directed ?? false
    this.compound = options?.compound ?? false
  }

  setGraph(graph: GraphObject) {
    this.graph = graph
    return this
  }

  setNode(id: T, options: NodeOptions) {
    const defaultOptions: InternalNodeOptions<T> = {
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

    this.nodes[id] = Object.assign(defaultOptions, options)
    return this
  }

  node(id: T) {
    return this.nodes[id]
  }

  hasNode(id: T) {
    return this.nodes[id] !== undefined
  }

  get nodeIds() {
    return Object.keys(this.nodes) as Array<T>
  }

  get nodeObjects() {
    return Object.values<Node<T>>(this.nodes)
  }

  setEdge(fromId: T, toId: T, options: EdgeOptions) {
    const id = this.createEdgeId(fromId, toId)

    const fromNode = this.node(fromId)
    const toNode = this.node(toId)

    const defaultOptions: InternalEdgeOptions<T> = {
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

  edge(childId: T, parentId: T, name?: string) {
    const edgeId = edgeArgsToId(this.directed, childId, parentId, name)
    return this.edges[edgeId]
  }

  get edgeIds() {
    return Object.keys(this.edges)
  }

  get edgeObjects() {
    return Object.values(this.edges)
  }

  inEdgeObjects(id: T, fromId?: T) {
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

  outEdgeObjects(id: T, toId?: T) {
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

  nodeEdgeObjects(fromId: T, toId?: T) {
    const inEdges = this.inEdgeObjects(fromId, toId)
    const outEdges = this.outEdgeObjects(fromId, toId)

    return inEdges.concat(outEdges)
  }

  hasEdge(fromId: T, toId: T, name?: string) {
    const edgeId = edgeArgsToId(this.directed, fromId, toId, name)
    return this.edges[edgeId] !== undefined
  };

  predecessors(id: T) {
    const nodes = this.node(id).predecessors
    return Object.keys(nodes) as T[]
  }

  successors(id: T) {
    const nodes = this.node(id).successors
    return Object.keys(nodes) as T[]
  }

  neighbors(id: T) {
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