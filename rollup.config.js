import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import analyze from "rollup-plugin-analyzer";
import pkg from "./package.json";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import autoExternal from "rollup-plugin-auto-external";

const config = {
  input: "src/index.js",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "es",
      exports: "named",
      sourcemap: true,
    },
  ],
  plugins: [
    json(),
    resolve(),
    commonjs({
      exclude: ["src/**"],
      include: ["node_modules/**"],
    }),
    babel({
      babelHelpers: "runtime",
      exclude: "node_modules/**",
      plugins: [
        [
          "@babel/plugin-proposal-decorators",
          {
            legacy: true,
          },
        ],
        "@babel/plugin-proposal-function-sent",
        "@babel/plugin-proposal-export-namespace-from",
        "@babel/plugin-proposal-numeric-separator",
        "@babel/plugin-proposal-throw-expressions",
        "@babel/plugin-transform-runtime",
        [
          "transform-react-remove-prop-types",
          {
            removeImport: true,
          },
        ],
      ],
      presets: ["@babel/react", "@babel/env"],
      comments: false,
    }),
    analyze({ summaryOnly: true, limit: 10 }),
    sizeSnapshot(),
    terser(),
    autoExternal(),
  ],
  external: [/lodash\//, /@babel\/runtime/],
};

export default config;
