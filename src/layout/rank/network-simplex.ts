import Graph from '@/Graph'
import {longestPath} from './util'
import {feasibleTree} from './feasible-tree'
import postorder from '@/algorithms/postorder'

/*
 * Returns true if the edge is in the tree.
 */
function isTreeEdge<T extends string>(tree: Graph, preId: T, id: T) {
  return tree.hasEdge(preId, id)
}

function dfsAssignLowLim(tree: Graph, visited: Record<string, boolean>, nextLim: number, id: string, parent?: string) {
  const low = nextLim
  const node = tree.node(id)

  visited[id] = true
  for (const i of tree.neighbors(id)) {
    if (!visited[i]) {
      nextLim = dfsAssignLowLim(tree, visited, nextLim, i, id)
    }
  }

  node.low = low
  node.lim = nextLim++
  if (parent) {
    node.parent = parent
  } else {
    // TODO should be able to remove this when we incrementally update low lim
    delete node.parent
  }

  return nextLim
}

function initLowLimValues(tree: Graph, root?: string) {
  if (root === undefined) {
    root = tree.nodeIds[0]
  }
  dfsAssignLowLim(tree, {} as Record<string, boolean>, 1, root)
}

/*
 * Given the tight tree, its graph, and a child in the graph calculate and
 * return the cut value for the edge between the child and its parent.
 */
function calcCutValue(tree: Graph, graph: Graph, child: string) {
  var childLab = tree.node(child)
  var parent = childLab.parent
  // True if the child is on the tail end of the edge in the directed graph
  var childIsTail = true
  // The graph's view of the tree edge we're inspecting
  var graphEdge = graph.edge(child, parent!)
  // The accumulated cut value for the edge between this node and its parent
  var cutValue = 0

  if (!graphEdge) {
    childIsTail = false
    graphEdge = graph.edge(parent!, child)
  }

  cutValue = graphEdge.weight

  for (const edge of graph.nodeEdgeObjects(child)) {
    const isOutEdge = edge.fromId === child
    const other = isOutEdge ? edge.toId : edge.fromId

    if (other !== parent) {
      const pointsToHead = isOutEdge === childIsTail
      const otherWeight = edge.weight

      cutValue += pointsToHead ? otherWeight : -otherWeight
      if (isTreeEdge(tree, child, other)) {
        const otherCutValue = tree.edge(child, other).cutvalue!
        cutValue += pointsToHead ? -otherCutValue : otherCutValue
      }
    }
  }

  return cutValue
}

function assignCutValue(tree: Graph, graph: Graph, child: string) {
  const childLab = tree.node(child)
  const parent = childLab.parent
  tree.edge(child, parent!).cutvalue = calcCutValue(tree, graph, child)
}

/*
 * Initializes cut values for all edges in the tree.
 */
function initCutValues(tree: Graph, graph: Graph) {
  var ids = postorder(tree, tree.nodeIds)
  ids = ids.slice(0, ids.length - 1)

  for (const id of ids) {
    assignCutValue(tree, graph, id)
  }
}

function leaveEdge(tree: Graph) {
  for (const edge of tree.edgeObjects) {
    if (edge.cutvalue !== undefined && edge.cutvalue < 0) {
      return edge
    }
  }
}

// function isDescendant(tree: Graph, node: ReturnType<typeof Graph.prototype.node>, rootNode: ReturnType<typeof Graph.prototype.node>) {
//   return rootNode.low <= node.lim && node.lim <= rootNode.lim
// }

function enterEdge(tree: Graph, graph: Graph, edge: ReturnType<typeof leaveEdge>) {
  const fromNode = graph.node(edge?.fromId!)
  const toNode = graph.node(edge?.toId!)

  // const candidates = graph.edgeObjects.filter(edge => )
}

function exchangeEdges(tree: Graph, graph: Graph, edge: ReturnType<typeof leaveEdge>) {}

export default function networkSimplex(graph: Graph) {
  // g = simplify(g);
  longestPath(graph)
  const tree = feasibleTree(graph)
  initLowLimValues(tree)
  initCutValues(tree, graph)

  let e: ReturnType<typeof leaveEdge>, f
  // while ((e = leaveEdge(tree))) {
  //   f = enterEdge(tree, g, e)
  //   exchangeEdges(tree, g, e, f)
  // }
}
