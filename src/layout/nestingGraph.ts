import {addDummyNode} from './util'
import {Graph} from '@/main'

function treeDepths(graph: Graph) {
  const depths: Record<string, number> = {}

  function dfs(id: string, depth: number) {
    const children = Object.values(graph.node(id).children)
    for (const child of children) {
      dfs(child.id, depth + 1)
    }
    depths[id] = depth
  }

  for (const id of graph.rootNodeIds) {
    dfs(id, 1)
  }

  return depths
}

export function buildNestedGraph(graph: Graph) {
  const root = addDummyNode(graph, 'root', {}, 'root')
  const depths = treeDepths(graph)
  const height = Math.max(...Object.values(depths)) - 1
  const nodeSep = 2 * height - 1

  for (const edge of graph.edgeObjects) {
    edge.minlen *= nodeSep
  }
}
