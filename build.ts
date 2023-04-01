import esbuild from "esbuild";

main();

async function main() {
  const result = await esbuild.build({
    entryPoints: ["./+config.ts"],
    platform: "node",
    sourcemap: false,
    write: false,
    target: ["node14.18", "node16"],
    outfile: "NEVER_EMITTED.js",
    logLevel: "silent",
    format: "esm",
    bundle: false,
    minify: false,
  });

  console.log(result);
  console.log(result.outputFiles[0].text);
}
