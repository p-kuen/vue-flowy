import Graph from '../Graph'

function doDfs<T extends string>(graph: Graph<T>, id: T, postorder: boolean, visited: Record<T, true>, navigation: Function, acc: T[]) {
  if (visited[id]) {
    return
  }

  visited[id] = true

  if (!postorder) {
    acc.push(id)
  }

  for (const i of navigation(id)) {
    doDfs(graph, i, postorder, visited, navigation, acc)
  }

  if (postorder) {
    acc.push(id)
  }
}

/*
 * A helper that preforms a pre- or post-order traversal on the input graph
 * and returns the nodes in the order they were visited. If the graph is
 * undirected then this algorithm will navigate using neighbors. If the graph
 * is directed then this algorithm will navigate using successors.
 *
 * Order must be one of "pre" or "post".
 */
export default function dfs<T extends string>(graph: Graph<T>, ids: T[] | T, order: 'pre' | 'post') {
  if (!Array.isArray(ids)) {
    ids = []
  }

  var navigation = (graph.directed ? graph.successors : graph.neighbors).bind(graph);

  var acc = [];
  var visited = {} as Record<T, true>

  for (const id of ids) {
    if (!graph.hasNode(id)) {
      throw new Error(`Graph does not have node with id ${id}`)
    }

    doDfs(graph, id, order === 'post', visited, navigation, acc)
  }

  return acc;
}