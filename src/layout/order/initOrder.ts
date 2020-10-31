import Graph, {Node} from '@/Graph'

/*
 * Assigns an initial order value for each node by performing a DFS search
 * starting from nodes in the first rank. Nodes are assigned an order in their
 * rank as they are first visited.
 *
 * This approach comes from Gansner, et al., "A Technique for Drawing Directed
 * Graphs."
 *
 * Returns a layering matrix with an array per layer and each layer sorted by
 * the order of its nodes.
 */
export default function initOrder(graph: Graph) {
  const visited = {} as Record<string, true>

  const nodesWithoutChildren = graph.nodeObjects.filter(node => !Object.keys(node.children).length)
  const maxRank = Math.max(...nodesWithoutChildren.map(node => node.rank ?? 0))
  const layers: string[][] = []

  for (let i = 0; i < maxRank + 1; i++) {
    layers.push([])
  }

  function dfs(node: Node) {
    if (visited[node.id]) {
      return
    }

    visited[node.id] = true
    layers[node.rank ?? 0].push(node.id)

    for (const successor of graph.successors(node.id)) {
      dfs(graph.node(successor))
    }
  }

  const orderedNodes = nodesWithoutChildren.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))

  for (const node of orderedNodes) {
    dfs(node)
  }

  return layers
}
