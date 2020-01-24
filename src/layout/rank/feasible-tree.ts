import Graph from "@/Graph";

export function feasibleTree<T extends string>(graph: Graph<T>) {
  const t = new Graph({directed: false})

  const start = graph.nodeIds[0]
  const size = graph.nodeIds.length
  t.setNode(start, {})

  // TODO!

  return t
}