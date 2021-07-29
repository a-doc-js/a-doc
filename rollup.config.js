import merge from 'lodash.merge'

import { defineConfig } from 'rollup'
import { terser } from 'rollup-plugin-terser'
import json from 'rollup-plugin-json'
import { eslint } from 'rollup-plugin-eslint'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import babel from 'rollup-plugin-babel'

import pkg from './package.json'
import path from 'path'

const extensions = [ '.js', '.jsx', '.ts', '.tsx' ]

/** @type {Record<string, import('rollup').RollupOptions>} */
export const jobs = {
  esm: {
    output: {
      format: 'esm',
      dir: path.resolve(pkg.module, '../'),
      entryFileNames: 'index.esm.js',
      chunkFileNames: '[name].[hash].js'
    },
    manualChunks: {
      'highlight.js': ['highlight.js']
    },
  },
  umd: {
    output: {
      format: 'umd',
      file: pkg.main
    }
  },
  min: {
    output: {
      format: 'umd',
      file: pkg.main.replace(/(.\w+)$/, '.min$1')
    },
    plugins: [ terser() ]
  }
}

/** @type {import('rollup').RollupOptions} */
const defaultConfig = {
  input: './src/index.ts',
  output: { name: pkg.name },
  plugins: [
    json(),
    eslint({
      throwOnError: true,
      throwOnWarning: true,
      include: [ 'src/**/*.ts' ],
      exclude: [ 'node_modules/**', 'dist/**', '*.js' ]
    }),
    commonjs(),
    nodeResolve({
      extensions,
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    typescript({
      check: false,
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {
        compilerOptions : { module: "esnext" }
      }
    }),
    babel({
      extensions,
      exclude: 'node_modules/**'
    })
  ],
  watch: { exclude: 'src' }
}

export default defineConfig(merge(defaultConfig, jobs[process.env.FORMAT || 'esm']))
