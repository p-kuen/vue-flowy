import Graph from "@/Graph";
import { buildLayerMatrix } from "./util";

// function balance(xss, align) {

// }

function positionX<T extends string>(graph: Graph<T>) {
  const layering = buildLayerMatrix(graph)

  const xss = {}

  for (const vertical of ['u', 'd']) {
    for (const horizontal of ['l', 'r']) {
      // const xs = 
      // xss[vertical + horizontal] = xs
    }
  }

  return
}

function positionY<T extends string>(graph: Graph<T>) {
  var layers = buildLayerMatrix(graph);
  var rankSep = /*graph.graph?.ranksep*/ 0;
  var prevY = 0;

  console.log('vertical layer matrix', layers)

  for (const layer of layers) {
    const maxHeight = Math.max(...layer.map(id => graph.node(id).height))
    for (const id of layer) {
      graph.node(id).y = prevY + maxHeight / 2
    }
    prevY += maxHeight + rankSep
  }
}

export default function position<T extends string>(graph: Graph<T>) {

  positionY(graph)
  // for (const iterator of positionX(graph)) {
    
  // }
}