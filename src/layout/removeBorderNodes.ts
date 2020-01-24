import Graph from "@/Graph";


export default function removeBorderNodes<T extends string>(graph: Graph<T>) {
  for (const node of graph.nodeObjects) {

    if (Object.keys(node.children).length) {
      // unnecessary
      // const left = 
      // node.x = l.x
    }

  }
}
