import Graph from "./Graph"
import rank from "./layout/rank"
import order from "./layout/order"
import position from "./layout/position"

export default function layout<T extends string>(graph: Graph<T>) {
  // const layoutGraph = buildLayoutGraph(graph)
  _layout(graph)
  // updateInputGraph(graph, layoutGraph)
}

function _layout<T extends string>(graph: Graph<T>) {
  rank(graph)
  order(graph)
  position(graph)
  // translateGraph(graph)

}

/*
 * This idea comes from the Gansner paper: to account for edge labels in our
 * layout we split each rank in half by doubling minlen and halving ranksep.
 * Then we can place labels at these mid-points between nodes.
 *
 * We also add some minimal padding to the width to push the label for the edge
 * away from the edge itself a bit.
 */
// function makeSpaceForEdgeLabels<T extends string>(g: Graph<T>) {
//   const graph = g.graph
//   graph.ranksep /= 2

//   for (const e of g.edgeIds) {
//     const edge = g.edge(e)
//   }

//   _.forEach(g.edges(), function (e) {
//     const edge = g.edge(e)
//     edge.minlen *= 2
//     if (edge.labelpos.toLowerCase() !== 'c') {
//       if (graph.rankdir === 'TB' || graph.rankdir === 'BT') {
//         edge.width += edge.labeloffset
//       } else {
//         edge.height += edge.labeloffset
//       }
//     }
//   })
// }