/*  eslint-env node */
import autoExternal from "rollup-plugin-auto-external";
import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "rollup-plugin-terser";

// import argh from "argh";
// const { argv } = argh;
// argv["config-*"]
// example "rollup:dev": "rollup --config rollup.config.mjs --config-some value",

/**
 * @param {string=} outputName
 * @param {string=} umdName
 * @returns {{output: [{file: string, sourcemap: boolean, format: string}, {file: string, sourcemap: boolean, format: string}, {file: string, sourcemap: boolean, globals: {moment: string}, format: string, name: *}], input: string, external: [], plugins: ({transform: transform, load: (function(*): *), name: string, resolveId: resolveId}|{name: string, options(*=): {external: []}}|Plugin|boolean)[]}}
 */
export default function rollupConfigPkg(outputName = "index", umdName) {
  if (!outputName || typeof outputName !== "string") {
    throw new Error("`outputName` must be defined");
  }
  const OUTPUT_NAME = outputName;
  const UMD_NAME = umdName;
  const INPUT_NAME = "index.mjs";
  const IS_DEV = process.env.ROLLUP_WATCH;
  const config = {
    external: [],
    input: `./src/${INPUT_NAME}`,
    output: [
      {
        exports: "named",
        file: `./dist/${OUTPUT_NAME}.cjs`,
        format: "cjs",
        globals: {},
        sourcemap: true,
      },
      {
        exports: "named",
        file: `./dist/${OUTPUT_NAME}.mjs`,
        format: "es",
        globals: {},
        sourcemap: true,
      },
      {
        exports: "named",
        file: `./dist/${OUTPUT_NAME}.js`,
        format: "umd",
        globals: {},
        name: UMD_NAME,
        sourcemap: true,
      },
    ],
    plugins: [
      babel({
        babelrc: false,
        exclude: "node_modules/**",
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                node: true,
              },
            },
          ],
        ],
        plugins: ["@babel/plugin-proposal-class-properties", "@babel/plugin-proposal-private-methods"],
      }),
      autoExternal(),
      resolve({
        preferBuiltins: true,
      }),
      commonjs(),
      !IS_DEV &&
        terser.terser({
          keep_classnames: true,
          keep_fnames: true,
          output: {
            comments: false,
          },
          sourcemap: true,
          warnings: true,
        }),
    ],
  };
  if (!umdName) {
    delete config.output[2];
  }
  return config;
}
