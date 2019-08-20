<template>
  <div id="app">
    <h2>Without direction</h2>
    <vue-flowy :chart="chart"></vue-flowy>
  </div>
</template>

<script>
import {VueFlowy, FlowChart} from 'vue-flowy'

export default {
  name: "App",
  components: {
    VueFlowy
  },
  data: function() {
    return {
      chart: new FlowChart({
        direction: "LR",
        wordWrap: {
          indent: '',
          width: 9
        }
      })
    };
  },
  mounted() {
    // first flowChart
    const idea = this.chart.addElement("idea");
    const A = this.chart.addElement("A", { label: "vscode" });
    const B = this.chart.addElement("B", { label: "github" });
    const C = this.chart.addElement("C", { label: "npm" });
    const D = this.chart.addElement("D", {
      label: "not sure what else",
      rectStyle: { fill: "#444" },
      textStyle: { fill: "white" }
    });
    idea.leadsTo(A).leadsTo(B);
    A.leadsTo(C);
    A.leadsTo(D);

    A.on("click", function() {
      console.log("click!");
    });
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
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
