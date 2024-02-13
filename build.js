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
        build.onResolve({filter: /.*/}, async (args, ...rest) => {
          if (args.kind !== 'import-statement') return
          if (args.pluginData?.useEsbuildResolve) return
          console.log();
          console.log('== onResolve()');
          console.log('rest', rest);
          console.log('args', args);
          const {path, ...opts} = args
          opts.pluginData = {
            useEsbuildResolve: true,
          }
          const resolved = await build.resolve(path, opts)
          console.log('path', resolved.path)
          if (resolved.path.endsWith('.jsx')) {
            resolved.external = true
          }
          return resolved
        })
      }
    }]
  });

  //console.log(result);
  const {text} = result.outputFiles[0]
  console.log();
  console.log('== text');
  console.log(text);
}
