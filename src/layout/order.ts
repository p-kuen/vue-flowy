import Graph from "@/Graph";
import { maxRank } from "./util";
import initOrder from "./order/initOrder";

function assignOrder<T extends string>(graph: Graph<T>, layering: T[][]) {
  for (const layer of layering) {
    for (const order in layer) {
      if (layer.hasOwnProperty(order)) {
        graph.node(layer[order]).order = Number(order)
      }
    }
  }
}

export default function order<T extends string>(graph: Graph<T>) {
  const rank = maxRank(graph)

  const layering = initOrder(graph)

  assignOrder(graph, layering)
}