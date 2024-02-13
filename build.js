import esbuild from "esbuild";

main();

async function main() {
  const result = await esbuild.build({
    entryPoints: ["./src/+config.ts"],
    platform: "node",
    sourcemap: false,
    write: false,
    target: ["node14.18", "node16"],
    outfile: "NEVER_EMITTED.js",
    logLevel: "silent",
    format: "esm",
    /*/
    bundle: false,
    /*/
    bundle: true,
    //*/
    minify: false,
    plugins: [{
      name: 'vike-url-resolver',
      setup(build) {
        build.onLoad({filter: /\.jsx/}, async (args, ...rest) => {
          console.log('rest', rest);
          console.log('args', args);
          return {
            contents: args.path,
            loader: 'text',
          }
        })
      }
    }]
  });

  //console.log(result);
  console.log(result.outputFiles[0].text);
}
