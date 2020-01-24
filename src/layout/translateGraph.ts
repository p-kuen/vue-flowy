import Graph from "@/Graph";

export default function translateGraph<T extends string>(graph: Graph<T>) {
  const minX = Number.POSITIVE_INFINITY
  const maxX = 0
  const minY = Number.POSITIVE_INFINITY
  const maxY = 0
  const graphOptions = graph.graph
  const marginX = graphOptions?.marginx || 0
  const marginY = graphOptions?.marginy || 0

  for (const node of graph.nodeObjects) {
    node.x -= minX
    node.y -= minY
  }
}