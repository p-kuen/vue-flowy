import Graph from "@/Graph";

export function maxRank<T extends string>(graph: Graph<T>) {
  return Math.max(...graph.nodeObjects.map(n => n.rank ?? 0))
}

export function buildLayerMatrix<T extends string>(graph: Graph<T>) {
  const layering: T[][] = []
  
  for (let i = 0; i < maxRank(graph) + 1; i++) {
    layering.push([])
  }

  for (const id of graph.nodeIds) {
    const node = graph.node(id)
    const rank = node.rank

    if (rank !== undefined) {
      layering[rank][node.order] = id
    }
  }

  return layering
}