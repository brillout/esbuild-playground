import esbuild from "esbuild";

const options = {
  platform: "node",
  sourcemap: false,
  write: false,
  target: ["node14.18", "node16"],
  outfile: "NEVER_EMITTED.js",
  logLevel: "silent",
  format: "esm",
  bundle: false,
  minify: false,
};

const result = await esbuild.build({
  entryPoints: ["./+config.ts"],
  ...options,
  /*
  write: false,
  bundle: false,
  format: "esm",
  splitting: false,
  treeShaking: false,
  minify: false,
  keepNames: false,
  sourcesContent: false,
  ignoreAnnotations: false,
  charset: "utf8",
  sourcemap: false,
  platform: "node",
  */
});

console.log(result);
console.log(result.outputFiles[0].text);
