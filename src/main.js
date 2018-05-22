import VueFlowy from './VueFlowy.vue'
import FlowChart from './FlowChart.js'

const plugin = {
  install: Vue => {
    Vue.component(VueFlowy.name, VueFlowy)
  }
}

VueFlowy.install = plugin.install

export default {VueFlowy, FlowChart}