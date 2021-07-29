import merge from 'lodash.merge'

import { defineConfig } from 'rollup'
import postcss from 'rollup-plugin-postcss'

import c from '../../rollup.config'
import pkg from './package.json'

c.output.paths = {
  'hybrids': 'https://unpkg.com/hybrids@^6',
  'marked': 'https://unpkg.com/marked@2.1.3/lib/marked.esm.js'
}

/** @type {import('rollup').RollupOptions} */
const config = {
  external: [
    ...Object.keys(pkg.dependencies || {})
  ],
  plugins: [
    postcss({
      inject: false,
      minimize: true
    })
  ]
}
export default defineConfig(merge(c, config))
