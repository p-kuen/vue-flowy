<template>
  <div :id='_uid' class='flowyChart'></div>
</template>

<script>
import FlowChart from './FlowChart'

export default {
  name: 'VueFlowy',
  props: {
    chart: {
      type: FlowChart,
      required: true
    }
  },
  data() {
    return {
      chartElement: null
    }
  },
  watch: {
    'chart.elements': function(newVal, oldVal) {
      this.chart.render(this.chartElement)
    }
  },
  mounted() {
    this.chartElement = document.getElementById(this._uid)
  }
}
</script>

<style lang="scss">
.flowyChart {
  svg {
    display: block;
    margin: 0 auto;
  }

  .node rect {
    stroke: #999;
    fill: #fff;
    stroke-width: 1.5px;
  }

  .edgePath path {
    stroke: #333;
    stroke-width: 1.5px;
  }
}
</style>

