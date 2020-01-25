import Vue from 'vue';

var VueFlowy = Vue.component('VueFlowy', {
    props: {
        chart: {
            type: Object,
            required: true
        }
    },
    watch: {
        'chart.elements': function () {
            console.log('render chart');
            this.renderChart();
        }
    },
    methods: {
        renderChart: function () {
            if (!this.$refs.chartElement) {
                return;
            }
            this.chart.render(this.$refs.chartElement);
        }
    },
    render: function (h) {
        return h('div', { class: 'flow-chart', ref: 'chartElement' }, [
            h('style', '.flow-chart > svg {display: block;} .flow-chart .node rect {stroke: #999; fill: #fff; stroke-width: 1.5px;} .flow-chart .edgePath path {stroke: #333; stroke-width: 1.5px;}')
        ]);
    }
});

export default VueFlowy;
//# sourceMappingURL=VueFlowy.js.map
