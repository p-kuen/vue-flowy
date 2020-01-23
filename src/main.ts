import {VueConstructor} from 'vue'
import VueFlowy from './VueFlowy'
import FlowChart from './FlowChart'
export {FlowChart, VueFlowy}

export default {
  install(Vue: VueConstructor, options: any) {
    console.log('Installing the VueFlowy plugin!')
    Vue.component('VueFlowy', VueFlowy)
  }
}