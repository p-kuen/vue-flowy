import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import {FlowChart} from './FlowChart'
import {FlowElement} from './FlowElement'
import { CreateElement } from 'vue';
export * from './FlowChart'

@Component
export class VueFlowy extends Vue {

  @Prop(FlowChart)
  public chart!: FlowChart;

  private chartElement: HTMLElement | null = null;

  public render(h: CreateElement) {
    return h('div', {class: "flow-chart", ref: 'flowyChart'}, [
      h('style', '.flow-chart > svg {display: block;} .flow-chart .node rect {stroke: #999; fill: #fff; stroke-width: 1.5px;} .flow-chart .edgePath path {stroke: #333; stroke-width: 1.5px;}')
    ])
  }

  @Watch('chart.elements')
  onElementsChanged(val: FlowElement[], oldVal: FlowElement[]) {
    if (!this.chartElement) {
      return
    }

    this.chart.render(this.chartElement)
  }

  mounted() {
    if (!this.$refs.flowyChart) {
      throw new Error('No flowyChart rendered!')
    }

    this.chartElement = this.$refs.flowyChart as HTMLElement
  }
}
