import {VueConstructor} from 'vue'
import VueFlowy from './VueFlowy'
import FlowChart from './FlowChart'
import Graph from './Graph'
export {FlowChart, VueFlowy, Graph}

export default {
  install(Vue: VueConstructor, options: any) {
    console.log('Installing the VueFlowy plugin!')
    Vue.component('VueFlowy', VueFlowy)
  }
}
