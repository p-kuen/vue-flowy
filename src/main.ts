import {VueFlowy} from './VueFlowy'
import {VueConstructor} from 'vue'
export * from './VueFlowy'
export * from './FlowChart'

export default {
  install(Vue: VueConstructor, options: any) {
    console.log('Installing the VueFlowy plugin!')
    Vue.component('VueFlowy', VueFlowy)
  }
}