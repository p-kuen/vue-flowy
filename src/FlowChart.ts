import {Graph} from 'graphlibrary'
import d3Renderer from 'dagre-d3-renderer'
import {FlowElement, FlowElementEdgeOptions} from './FlowElement'
import {select} from 'd3'

export interface FlowChartElementOptions {
  label?: string
}

export class FlowChart {
  options = {
    direction: 'LR'
  }
  elements: FlowElement[] = []

  constructor(options = {}) {
    this.options = Object.assign(this.options, options)
  }

  addElement(id: string, options?: FlowChartElementOptions) {
    const el = new FlowElement(id, options)
    this.elements.push(el)
    return el
  }

  render(element: HTMLElement) {
    const svg = select(element)
      .append('svg')
      .attr('id', 'f' + element.id)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
    const svgGroup = svg.append('g')

    // Create the input mermaid.graph
    const g = new Graph({
      multigraph: true,
      compound: true
    })
      .setGraph({
        rankdir: this.options.direction,
        marginx: 20,
        marginy: 20
      })
      .setDefaultEdgeLabel(function () {
        return {}
      })

    // first create all nodes
    for (const i in this.elements) {
      const el = this.elements[i]
      const elData: FlowChartElementOptions = {
        label: el.id
      }

      if (el.options && el.options.label) {
        elData.label = el.options.label
      }
      g.setNode(el.id, elData)
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
        const edgeData: FlowElementEdgeOptions = {}

        if (edge.options && edge.options.label) {
          edgeData.label = edge.options.label
        }

        g.setEdge(el.id, edge.otherId, edgeData)
      }
    }

    const render = new d3Renderer.render()

    const e = select('#f' + element.id + ' g')
    render(e, g)
    const svgElement = document.getElementById('f' + element.id)

    if (!svgElement) {
      throw new Error('svgElement is null!')
    }

    const groupElement = svgElement.querySelector('g')

    if (!groupElement) {
      throw new Error('groupElement is null!')
    }

    svgElement.setAttribute('width', (groupElement.getBoundingClientRect().width + 40).toString())
    svgElement.setAttribute('height', (groupElement.getBoundingClientRect().height + 40).toString())
  }
}