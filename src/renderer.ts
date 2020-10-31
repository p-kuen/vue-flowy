import {select} from 'd3-selection'
import Graph from './Graph'
import {createNodes, positionNodes} from './render/nodes'
import layout from './layout'

export class Renderer {
  graph: Graph

  constructor(graph: Graph) {
    this.graph = graph
  }

  preprocess() {
    for (const id of this.graph.nodeIds) {
      const node = this.graph.node(id)
      console.log('TODO: do pre-processing.')
    }
  }

  render(element: Element) {
    const d3Element = select(element)

    // delete everything from element
    d3Element.selectAll().remove()

    const nodes = createNodes(d3Element.append('g').attr('class', 'nodes'), this.graph)
    layout(this.graph)
    positionNodes(nodes, this.graph)
  }

  // createOrSelectGroup(root, name) {
  //   let selection = root.select('g.' + name)
  //   if (selection.empty()) {
  //     selection = root.append('g').attr('class', name)
  //   }
  //   return selection
  // }
}
