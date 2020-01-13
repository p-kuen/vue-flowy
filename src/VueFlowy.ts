import Vue, { PropType } from 'vue'
import {FlowChart} from './FlowChart'
export * from './FlowChart'

export const VueFlowy = Vue.component('VueFlowy', {
  props: {
    chart: {
      type: Object as PropType<FlowChart>,
      required: true
    }
  },
  watch: {
    'chart.elements': function() {
      this.renderChart()
    }
  },
  methods: {
    renderChart() {
      if (!this.$refs.chartElement) {
        return
      }
  
      this.chart.render(this.$refs.chartElement as HTMLElement)
    }
  },
  render(h) {
    return h('div', {class: 'flow-chart', ref: 'chartElement'}, [
      h('style', '.flow-chart > svg {display: block;} .flow-chart .node rect {stroke: #999; fill: #fff; stroke-width: 1.5px;} .flow-chart .edgePath path {stroke: #333; stroke-width: 1.5px;}')
    ])
  }
})
