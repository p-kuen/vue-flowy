import {Selection} from 'd3-selection'
import Graph from './Graph'
import {createNodes, positionNodes} from './render/nodes'
import layout from './layout'

export class Renderer<T extends string> {
  graph: Graph<T>

  constructor(graph: Graph<T>) {
    this.graph = graph
  }

  preprocess() {
    for (const id of this.graph.nodeIds) {
      const node = this.graph.node(id)
      console.log('TODO: do pre-processing.')
    }
  }

  render(element: Selection<any, any, any, any>, graph: Graph<T>) {
    // delete everything from element
    element.selectAll().remove()

    const nodes = createNodes(element.append('g').attr('class', 'nodes'), graph)
    layout(graph)
    positionNodes(nodes, graph)
  }

  // createOrSelectGroup(root, name) {
  //   let selection = root.select('g.' + name)
  //   if (selection.empty()) {
  //     selection = root.append('g').attr('class', name)
  //   }
  //   return selection
  // }
}
