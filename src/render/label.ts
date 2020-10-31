import {Node} from '@/Graph'
import {SVGGElementSelection} from '@/types/d3-extra'

export function addLabel(labelGroup: SVGGElementSelection, node: Node) {
  const labelText = node.label
  const svg = labelGroup.append('g')

  switch (node.labelType) {
    case 'text':
      addTextLabel(svg, node)
      break
    default:
      throw new Error(`Node label type ${node.labelType} is not implemented!`)
  }

  const labelBBox = svg.node()!.getBoundingClientRect()
  const y = -labelBBox.height / 2

  svg.attr('transform', `translate(${-labelBBox.width / 2},${y})`)

  return svg
}

function addSvgLabel(svg: SVGGElementSelection, node: Node) {
  // svg.node()?.appendChild(node.label!)
}

function addTextLabel(svg: SVGGElementSelection, node: Node) {
  if (!node.label) {
    throw new Error(`No label set for node '${node.id}'`)
  }

  const textSvg = svg.append('text')

  const lines = processEscapeSequences(node.label).split('\n')
  for (const line of lines) {
    textSvg.append('tspan').attr('xml:space', 'preserve').attr('dy', '1em').attr('x', '1').text(line)
  }

  return textSvg
}

function processEscapeSequences(text: string) {
  var newText = ''
  var escaped = false
  var ch
  for (var i = 0; i < text.length; ++i) {
    ch = text[i]
    if (escaped) {
      switch (ch) {
        case 'n':
          newText += '\n'
          break
        default:
          newText += ch
      }
      escaped = false
    } else if (ch === '\\') {
      escaped = true
    } else {
      newText += ch
    }
  }
  return newText
}
