import babel from 'rollup-plugin-babel';
// import json from 'rollup-plugin-json';

export default {
  input: 'src/index.js',
  output: {
    file: 'index.js',
    format: 'cjs'
  },
  // Transpile any ES2015 in the output file.
  plugins: [
    // json(),
    babel()
  ],
};