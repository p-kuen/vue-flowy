import Graph from '../../Graph'

/*
 * Initializes ranks for the input graph using the longest path algorithm. This
 * algorithm scales well and is fast in practice, it yields rather poor
 * solutions. Nodes are pushed to the lowest layer possible, leaving the bottom
 * ranks wide and leaving edges longer than necessary. However, due to its
 * speed, this algorithm is good for getting an initial ranking that can be fed
 * into other algorithms.
 *
 * This algorithm does not normalize layers because it will be used by other
 * algorithms in most cases. If using this algorithm directly, be sure to
 * run normalize at the end.
 *
 * Pre-conditions:
 *
 *    1. Input graph is a DAG.
 *    2. Input graph node labels can be assigned properties.
 *
 * Post-conditions:
 *
 *    1. Each node will be assigned an (unnormalized) "rank" property.
 */
export function longestPath<T extends string>(graph: Graph<T>) {
  const visited = {} as Record<T, true>

  function dfs(id: T) {
    const node = graph.node(id)

    if (visited[id]) {
      return node.rank!;
    }

    visited[id] = true;

    let rank = Math.min(...graph.outEdgeObjects(id).map(edge => dfs(edge.toId) - edge.minlen))

    console.log('new rank for node', id, rank)

    if (rank === Number.POSITIVE_INFINITY || // return value of _.map([]) for Lodash 3
        rank === undefined || // return value of _.map([]) for Lodash 4
        rank === null) { // return value of _.map([null])
      rank = 0;
    }

    return (node.rank = rank);
  }

  console.log('root nodes', graph.rootNodeIds)

  for (const id of graph.rootNodeIds) {
    dfs(id)
  }
}