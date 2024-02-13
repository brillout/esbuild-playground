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
    bundle: true,
    minify: false,
    plugins: [
      {
        // https://github.com/evanw/esbuild/issues/3646
        name: 'vike:import-externalizer',
        async setup(build) {
          build.onResolve({filter: /.*/, namespace: 'file'}, async (args, ...rest) => {
            console.log()
            console.log('== onResolve()')
            console.log('rest', rest);
            console.log('args', args);
            if (args.kind !== 'import-statement') return undefined
            if (args.pluginData) {
              if (!args.pluginData.useEsbuildResolve) {
                console.log('args.pluginData', args.pluginData)
                assert(false)
              }
              return
            }
            const {path, ...opts} = args
            opts.pluginData = {
              dataType: 1,
              useEsbuildResolve: true,
            }
            console.log('build.resolve() before')
            const resolved = await build.resolve(path, opts)
            console.log('build.resolve() after')
            console.log('resolved', resolved);
            resolved.pluginData = {
              dataType: 2,
              argsResolve: args
            }
            //resolved.external = true
            resolved.namespace = 'import-proxy'
            // return {path: path.join(args.resolveDir, args.path)}
            return resolved
          })
          build.onResolve({filter: /.*/, namespace: 'import-proxy'}, async (args, ...rest) => {
            console.log()
            console.log('== onResolve() [import-proxy]')
            console.log('rest', rest);
            console.log('args', args);

            const {path, ...opts} = args
            opts.pluginData = {
              dataType: 4,
              useEsbuildResolve: true,
            }
            opts.namespace = 'file'
            console.log('build.resolve() before [import-proxy]')
            console.log('opts', opts)
            const resolved = await build.resolve(path, opts);
            console.log('build.resolve() after [import-proxy]')

            assert(args.pluginData?.withValue?.type)
            if (args.pluginData.withValue.type === 'real') {
              console.log('real [import-proxy]')
            }
            if (args.pluginData.withValue.type === 'fake') {
              resolved.external = true
              console.log('fake [import-proxy]')
            }
            return resolved
          })
          build.onLoad({filter: /.*/, namespace: 'import-proxy'}, async (args, ...rest) => {
            console.log()
            console.log('== onLoad()')
            console.log('rest', rest);
            console.log('args', args);
            const importPath = args.pluginData.argsResolve.path
            const resolveDir = args.pluginData.argsResolve.resolveDir
            console.log('importPath', importPath);
            console.log('resolveDir', resolveDir);
            const contents = `export * from '${importPath}'`
            const pluginData = {
              dataType: 3,
              withValue: args.with
            }
            return {
              resolveDir,
              pluginData,
              contents,
              /*
              namespace: 'ping-ping'
              */
            }
          })
        }
      }
    ]
  });

  //console.log(result);
  console.log();
  console.log('== text');
  console.log(result.outputFiles[0].text);
}

function assert(condition, msg) {
  if (condition) {
    return
  }
  console.log('========================')
  console.log('========= bug ==========')
  console.log('========================')
  const err = new Error(msg || 'BUG')
  console.log('err', err)
  throw err
}
