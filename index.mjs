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

export default function rollupConfigPkg(outputName, umdName) {
  if (!outputName) {
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
        file: `./dist/${OUTPUT_NAME}.cjs`,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: `./dist/${OUTPUT_NAME}.mjs`,
        format: "es",
        sourcemap: true,
      },
      {
        file: `./dist/${OUTPUT_NAME}.js`,
        format: "umd",
        globals: { moment: "moment" },
        name: UMD_NAME,
        sourcemap: true,
      },
    ],
    plugins: [
      babel({
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
      resolve(),
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