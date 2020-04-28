<template>
  <div id="app">
    <h2>Without direction</h2>
    <div ref="test"></div>
    <!-- <vue-flowy :chart="chart"></vue-flowy> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VueFlowy from '../../build/VueFlowy'
import Graph from '../../build/Graph'
// import {VueFlowy, FlowChart} from '../../build/main'

export default Vue.extend({
  name: 'App',
  components: {
    VueFlowy
  },
  data() {
    return {
      // chart: new FlowChart({ direction: "LR" })
    }
  },
  mounted() {
    const g = new Graph()

    const idea = g.setNode('idea', {label: 'idea'})
    const A = g.setNode('A', {label: 'vscode'})
    g.setEdge('idea', 'A', {})

    const ref = this.$refs.test as HTMLElement

    g.render(ref)

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
