import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import vue from 'rollup-plugin-vue'

/** @type {import('rollup').RollupOptions} */
const options = {
  input: ['src/main.ts', 'src/Graph.ts', 'src/renderer.ts', 'src/VueFlowy.ts', 'src/FlowChart.ts'],
  output: {
    dir: 'build',
    sourcemap: true
  },
  plugins: [commonjs(), typescript(), vue()]
}

export default options
