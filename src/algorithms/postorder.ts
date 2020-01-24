import Graph from "@/Graph"
import dfs from './dfs'

export default function postorder<T extends string>(graph: Graph<T>, ids: T[]) {
  return dfs(graph, ids, 'post')
}
