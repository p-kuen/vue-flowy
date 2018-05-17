import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import VuePlugin from 'rollup-plugin-vue'

const is_production = process.env.NODE_ENV === 'production'

export default {
  input: 'src/main.js',
  output: {
    name: 'VueFlowy',
    format: 'umd',
    file: 'dist/vue-flowy.js',
    exports: 'default'
  },
  plugins: [
    commonjs(),
    resolve(),
    VuePlugin(),
    babel({
      presets: [
        [
          'es2015',
          {
            modules: false
          }
        ]
      ],
      plugins: [
        'external-helpers'
      ],
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
}