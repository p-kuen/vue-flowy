# vue-flowy

[![npm](https://img.shields.io/npm/v/vue-flowy.svg?style=flat-square)](https://www.npmjs.com/package/vue-flowy)
[![npm](https://img.shields.io/npm/dt/vue-flowy.svg?style=flat-square)](https://www.npmjs.com/package/vue-flowy)
[![npm](https://img.shields.io/npm/dm/vue-flowy.svg?style=flat-square)](https://www.npmjs.com/package/vue-flowy)
[![Build Status](https://img.shields.io/travis/kevinongko/vue-flowy.svg?style=flat-square)](https://travis-ci.org/kevinongko/vue-flowy)
[![Codecov](https://img.shields.io/codecov/c/github/kevinongko/vue-flowy.svg?style=flat-square)](https://codecov.io/gh/kevinongko/vue-flowy)
[![npm](https://img.shields.io/npm/l/vue-flowy.svg?style=flat-square)](http://opensource.org/licenses/MIT)

Smart flowchart creation based on [Vue](https://vuejs.org/).

**Works with Vue 2.***

## Installation

### Install via NPM
```sh
$ npm install vue-flowy --save
```

#### Register as Component
```js
import Vue from 'vue'
import VueFlowy from 'vue-flowy'

export default {
  name: 'App',

  components: {
    VueFlowy
  }
}
```

## Usage

<!-- screenshot here -->

### Quick example

```vue
<template>
  <VueFlowy :chart='chart'></VueFlowy>
</template>

<script>
import {VueFlowy, FlowChart} from 'vue-flowy'

export default {
  name: 'App',

  components: {
    VueFlowy
  },

  data: () => ({
    chart: new FlowChart()
  }),
  mounted() {
    const A = this.chart.addElement('A')
    const B = this.chart.addElement('B')
    const C = this.chart.addElement('C')
    A.leadsTo(B).leadsTo(C)
    A.leadsTo(C)
  },
}
</script>
```

## Props
|Props|Description|Required|Type|Default|
|-----|-----------|--------|----|-------|
|chart|The Chart data (type of FlowChart)|true|FlowChart|-|

## License

Vue-Numeric is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)

## Support
Hello, I'm Patrick the maintainer of this project in my free time (which is getting lessen these days), if this project does help you in any way please consider to support me. Thanks :smiley:
