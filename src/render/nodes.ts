import {AnySelection} from '@/types/d3-extra'
import Graph from '@/Graph'
import {select} from 'd3-selection'
import {addLabel} from './label'
import * as shapes from './shapes'

export function createNodes(selection: AnySelection, graph: Graph) {
  let nodeGroups = selection.selectAll('g.node').data(graph.nodeIds, (k: any) => k)
  nodeGroups.enter().append('g').attr('class', 'node')

  // I do not exactly know why we have to select them again now.
  nodeGroups = selection.selectAll('g.node')

  nodeGroups.each(function (id) {
    const node = graph.node(id)
    const group = select(this)

    const labelGroup = group.append('g').attr('class', 'label')
    const labelSvg = addLabel(labelGroup, node)
    const bbox = labelSvg.node()!.getBoundingClientRect()
    const shape = shapes[node.shape || 'rect']

    node.svg = this

    bbox.width += node.padding.left + node.padding.right
    bbox.height += node.padding.top + node.padding.bottom
    labelGroup.attr(
      'transform',
      `translate(${(node.padding.left - node.padding.right) / 2},${(node.padding.top - node.padding.bottom) / 2})`
    )

    const shapeSvg = shape(group, bbox, node)

    const shapeBBox = shapeSvg.node()?.getBoundingClientRect()
    node.width = shapeBBox!.width
    node.height = shapeBBox!.height
  })

  return nodeGroups
}

export function positionNodes<T extends string>(selection: AnySelection, graph: Graph) {
  function translate(id: T) {
    const node = graph.node(id)
    return `translate(${node.x},${node.y})`
  }

  selection.attr('transform', translate)
}
