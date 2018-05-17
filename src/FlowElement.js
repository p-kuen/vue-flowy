export default class FlowElement {
  constructor(id, options) {
    this.id = id
    this.options = options
    this.edges = []
  }

  leadsTo(destinationElement) {
    this.edges.push(destinationElement.id)
    return destinationElement
  }
}