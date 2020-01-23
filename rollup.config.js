import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import vue from 'rollup-plugin-vue'

/** @type {import('rollup').RollupOptions} */
const options = {
  input: ['src/main.ts', 'src/VueFlowy.ts', 'src/FlowChart.ts'],
  output: {
    dir: 'build'
  },
  plugins: [commonjs(), typescript(), vue()]
}

export default options