import 'vue';
import VueFlowy from './VueFlowy.js';
export { default as VueFlowy } from './VueFlowy.js';
export { default as FlowChart } from './FlowChart.js';
import 'd3-selection';

var main = {
    install: function (Vue, options) {
        console.log('Installing the VueFlowy plugin!');
        Vue.component('VueFlowy', VueFlowy);
    }
};
//# sourceMappingURL=main.js.map

export default main;
