import Graph from "@/Graph";

function maxRank<T extends string>(graph: Graph<T>) {
 return Math.max(...graph.nodeObjects.map(n => n.rank || 0))
}

export function buildLayerMatrix<T extends string>(graph: Graph<T>) {
  const layering = new Array(maxRank(graph) + 1).map(() => [] as Array<T>)

  for (const id of graph.nodeIds) {
    const node = graph.node(id)
    const rank = node.rank

    if (rank !== undefined) {
      layering[rank][node.order] = id
    }
  }

  return layering
}