import Vue from 'vue';
import FlowChart from './FlowChart';
declare const VueFlowy: import("vue/types/vue").ExtendedVue<Vue, unknown, {
    renderChart(): void;
}, unknown, {
    chart: FlowChart;
}>;
export default VueFlowy;
