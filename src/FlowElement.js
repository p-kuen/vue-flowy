export default class FlowElement {
  constructor(id, options) {
    this.id = id
    this.options = options
    this.edges = []
  }

  leadsTo(destinationElement, options) {
    this.edges.push({otherId: destinationElement.id, options})
    return destinationElement
  }
}