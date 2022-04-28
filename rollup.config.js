import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import analyze from "rollup-plugin-analyzer";
import pkg from "./package.json";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import autoExternal from "rollup-plugin-auto-external";
import dts from "rollup-plugin-dts";
import replace from "@rollup/plugin-replace";

const config = [
  {
    input: "build/index.js",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        exports: "named",
        // sourcemap: true,
      },
      {
        file: pkg.module,
        format: "es",
        exports: "named",
        // sourcemap: true,
      },
    ],
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      json(),
      resolve(),
      commonjs({
        exclude: ["src/**"],
        include: ["node_modules/**"],
      }),
      analyze({ summaryOnly: true, limit: 10 }),
      sizeSnapshot(),
      terser(),
      autoExternal(),
    ],
    external: [/lodash/],
  },
  {
    input: "build/dts/index.d.ts",
    output: [{ file: "dist/index.d.ts" }],
    plugins: [dts()],
  },
];

export default config;
