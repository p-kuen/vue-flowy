import {Graph} from '@/main'
import {NodeOptions} from '@/Graph'
import {v1} from 'uuid'

export function addDummyNode(graph: Graph<string>, type: string, attrs: NodeOptions, name: string) {
  const id = v1()

  attrs.dummy = type
  graph.setNode(id, attrs)
  return id
}
