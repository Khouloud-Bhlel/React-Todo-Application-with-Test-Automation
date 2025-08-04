const babel = require('@rollup/plugin-babel');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const terser = require('@rollup/plugin-terser');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const postcss = require('rollup-plugin-postcss');
const packageJson = require('./package.json');

const config = {
  input: 'src/lib/index.js',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      presets: [
        ['@babel/preset-env', { 
          targets: { node: 'current' },
          modules: false 
        }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }),
    postcss({
      extract: true,
      minimize: true
    }),
    commonjs(),
    terser()
  ],
  external: ['react', 'react-dom', 'react-icons/ci', 'react-icons/fa']
};

module.exports = config;
