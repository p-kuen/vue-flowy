// import * as d3Renderer from 'dagre-d3-renderer'
// import Graph from './Graph'
import {FlowElement, FlowElementEdgeOptions} from './FlowElement'
import {select} from 'd3-selection'
import Graph, { NodeOptions } from './Graph'
import { Renderer } from './Renderer'

export interface FlowChartOptions {
  direction: 'LR' | 'TB' | 'BT' | 'RL'
}

export default class FlowChart {
  options: FlowChartOptions = {
    direction: 'LR'
  }
  elements: FlowElement[] = []


  constructor(options?: FlowChartOptions) {
    this.options = Object.assign(this.options, options)
  }

  addElement(id: string, options?: NodeOptions) {
    console.log('add element')
    const el = new FlowElement(id, options)
    this.elements.push(el)
    return el
  }

  destroy() {
    this.elements.forEach((element) => { element.unregister() })
  }

  render(element: HTMLElement) {
    const svg = select(element)
      .append('svg')
      .attr('id', 'f' + element.id)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('width', 1000)
      .attr('height', 600)

    const svgGroup = svg.append('g')


    // Create the input graph
    const g = new Graph({
      multigraph: true,
      compound: true
    })
      .setGraph({
        rankdir: this.options.direction,
        marginx: 20,
        marginy: 20
      })
      // .setDefaultEdgeLabel(function () {
      //   return {}
      // })

    // first create all nodes
    for (const i in this.elements) {
      const el = this.elements[i]
      const elData: NodeOptions = {
        label: el.id,
        rx: 5,
        ry: 5
      }

      if (el.options?.label) {
        elData.label = el.options.label
      }
      g.setNode(el.id, elData)
    }

    for (const el of this.elements) {
      // now create all edges
      for (const k in el.edges) {
        const edge = el.edges[k]
        const edgeData: FlowElementEdgeOptions = {}
  
        if (edge.options && edge.options.label) {
          edgeData.label = edge.options.label
        }
  
        g.setEdge(el.id, edge.otherId, edgeData)
      }
    }

    const renderer = new Renderer(g)

    const e = select('#f' + element.id + ' g')
    renderer.render(e, g)
    const svgElement = document.getElementById('f' + element.id)

    // now add the listeners after render
    // e.selectAll('g.node')
    //   .each(function(v) {
    //     // get the flow element from the id
    //     const el = FlowElement.getById(v as string)

    //     if (!el) {
    //       throw new Error('Element with id ' + v + ' is not defined!')
    //     }

    //     const d3Node = select(this)

    //     // now loop all listeners
    //     for (const listener of el.listeners) {
    //       d3Node.on(listener.event, listener.callback)
    //     }
    //   })

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