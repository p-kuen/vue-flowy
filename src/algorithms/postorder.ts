import Graph from '@/Graph'
import dfs from './dfs'

export default function postorder(graph: Graph, ids: string[]) {
  return dfs(graph, ids, 'post')
}
