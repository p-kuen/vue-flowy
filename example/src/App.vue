<template>
  <div id="app">
    <h2>Without direction</h2>
    <vue-flowy :chart="chart"></vue-flowy>
    <vue-flowy-legacy class="legacy" :chart="legacyChart"></vue-flowy-legacy>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VueFlowy from '../../build/VueFlowy'
import FlowChart from '../../build/FlowChart'
import {VueFlowy as VueFlowyLegacy, FlowChart as FlowChartLegacy} from 'vue-flowy'
import Graph from '../../build/Graph'
import {Renderer} from '../../build/renderer'
// import {VueFlowy, FlowChart} from '../../build/main'

export default Vue.extend({
  name: 'App',
  components: {
    VueFlowy,
    VueFlowyLegacy
  },
  data() {
    return {
      chart: new FlowChart({ direction: "LR" }),
      legacyChart: new FlowChartLegacy({direction: 'LR'})
    };
  },
  mounted() {
    const g = new Graph()
    const r = new Renderer(g)

    const idea = g.setNode('idea', {label: 'idea'})
    const A = g.setNode('A', {label: 'vscode'})
    const B = g.setNode('B', {label: 'github'})
    const C = g.setNode('C', {label: 'npm'})
    g.setEdge('idea', 'A', {})
    g.setEdge('A', 'B', {})
    g.setEdge('A', 'C', {})

    const ref = this.$refs.test as HTMLElement

    r.render(ref)

    // const renderer = new Renderer(g);

    // first flowChart
    // const idea = this.chart.addElement("idea");
    // const A = this.chart.addElement("A", { label: "vscode" });
    // const B = this.chart.addElement("B", { label: "github" });
    // const C = this.chart.addElement("C", { label: "npm" });
    // idea.leadsTo(A).leadsTo(B);
    // A.leadsTo(C);

    // A.on("click", function() {
    //   console.log("click!");
    // });
  }
})
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.flow-chart > svg {
  margin: 0 auto;
}
</style>
