declare module 'graphlibrary' {

  export class Graph {
    constructor(options: any)

    setGraph(options: any): Graph
    setDefaultEdgeLabel(fn: () => any): Graph
    setNode(id: string, options: any): Graph
    nodes(): any[]
    node(node: any): any
    setEdge(id: string, otherId: string, edgeData: any): Graph
  }
}
