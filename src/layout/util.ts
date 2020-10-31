import {Graph} from '@/main'
import {NodeOptions} from '@/Graph'
import {v1} from 'uuid'

export function maxRank(graph: Graph) {
  return Math.max(...graph.nodeObjects.map(n => n.rank ?? 0))
}

export function buildLayerMatrix(graph: Graph) {
  const layering = new Array(maxRank(graph) + 1).map(() => [] as Array<string>)
  console.log(layering)

  for (const node of graph.nodeObjects) {
    const rank = node.rank

    if (rank !== undefined) {
      layering[rank][node.order] = node.id
    }
  }

  return layering
}

export function addDummyNode(graph: Graph, type: string, attrs: NodeOptions, name: string) {
  const id = v1()

  attrs.dummy = type
  graph.setNode(id, attrs)
  return id
}
