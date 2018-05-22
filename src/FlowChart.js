import * as d3 from 'd3'
import graphlib from 'graphlibrary'
import dagreD3 from 'dagre-d3-renderer'
import FlowElement from './FlowElement'

export default class FlowChart {
  constructor(options) {
    this.elements = []
  }

  addElement(id, options) {
    const el = new FlowElement(id, options)
    this.elements.push(el)
    return el
  }

  render(element) {
    const svg = d3.select(element)
      .append('svg')
      .attr('id', 'f' + element.id)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
    const svgGroup = svg.append('g')

    // Create the input mermaid.graph
    const g = new graphlib.Graph({
      multigraph: true,
      compound: true
    })
      .setGraph({
        rankdir: 'LR',
        marginx: 20,
        marginy: 20
      })
      .setDefaultEdgeLabel(function () {
        return {}
      })

    console.log(this.elements)

    // first create all nodes
    for (const i in this.elements) {
      const el = this.elements[i]
      console.log('creating node no', i)
      g.setNode(el.id, {label: 'node'})
    }

    // now apply some styles to all nodes
    g.nodes().forEach(function(v) {
      var node = g.node(v)
      // Round the corners of the node
      node.rx = node.ry = 5
    });

    // now create all edges
    for (const i in this.elements) {
      const el = this.elements[i]
      for (const k in el.edges) {
        const edge = el.edges[k]
        console.log('connecting', el.id, 'with', edge)
        const edgeData = {}

        if (edge.options.label) {
          edgeData.label = edge.options.label
        }

        g.setEdge(el.id, edge.otherId, edgeData)
      }
    }

    const render = new dagreD3.render()

    const e = d3.select('#f' + element.id + ' g')
    render(e, g)
    const svgElement = document.getElementById('f' + element.id)
    const groupElement = svgElement.querySelector('g')
    svgElement.style.width = groupElement.getBoundingClientRect().width + 40
  }
}