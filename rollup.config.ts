import camelCase from 'lodash.camelcase';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package.json');

export default {
  input: `src/index.ts`,
  output: [
    {file: pkg.main, name: camelCase(pkg.name), format: 'cjs', sourcemap: true},
    {file: pkg.browser, name: camelCase(pkg.name), format: 'umd', sourcemap: true},
    {file: pkg.module, name: camelCase(pkg.name), format: 'es', sourcemap: true}
  ],
  external: [],
  watch: {
    include: 'src/**'
  },
  plugins: [
    json(),
    typescript({useTsconfigDeclarationDir: true}),
    commonjs(),
    resolve(),
    sourceMaps()
  ]
};
