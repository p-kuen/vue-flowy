import Graph from '@/Graph'

export function feasibleTree(graph: Graph) {
  const t = new Graph({directed: false})

  const start = graph.nodeIds[0]
  const size = graph.nodeIds.length
  t.setNode(start, {})

  // TODO!

  return t
}
