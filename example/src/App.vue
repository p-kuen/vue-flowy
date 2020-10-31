<template>
  <div id="app">
    <h2>Without direction</h2>
    <div class="test" ref="test"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {render as Renderer} from 'dagre-d3'
import {Graph} from 'graphlib'
import { select } from 'd3-selection';

export default Vue.extend({
  name: 'App',
  data() {
    return {
      dagreChart: new Graph()
    };
  },
  created() {
    this.dagreChart.setGraph({})

    // dagre flow chart
    this.dagreChart.setNode('idea', {label: 'idea'})
    this.dagreChart.setNode('A', {label: 'vscode'})
    this.dagreChart.setNode('B', {label: 'github'})
    this.dagreChart.setNode('C', {label: 'npm'})

    this.dagreChart.setEdge('idea', 'A', {label: 'test'}).setEdge('idea', 'B', {label: 'test'})
    this.dagreChart.setEdge('A', 'C', {label: 'test'})
  },
  mounted() {
    const ref = this.$refs.test as HTMLElement
    this.render(ref)

  },
  methods: {
    render(root: HTMLElement) {
      const svg = select(root)
        .append('svg')
        .attr('id', 'f' + root.id)
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('width', 1000)
        .attr('height', 600)

      const svgGroup = svg.append('g')

      const renderer = new Renderer()

      renderer(svgGroup, this.dagreChart)
    }
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

.test .node rect,
.test .node circle,
.test .node ellipse,
.test .node polygon {
  stroke: #333;
  fill: #fff;
  stroke-width: 1.5px;
}

.test .edgePath path {
  stroke: #333;
  fill: #333;
  stroke-width: 1.5px;
}
</style>
