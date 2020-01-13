module.exports = {
  parallel: false,
  chainWebpack: config => {
    if(process.env.NODE_ENV === 'production') {
      // disable cache (not sure if this is actually useful...)
      config.module.rule("ts").uses.delete("cache-loader");

      config.module
        .rule('ts')
        .use('ts-loader')
        .loader('ts-loader')
        .tap(opts => {
          opts.transpileOnly = false;
          opts.happyPackMode = false;
          return opts;
        });
    }
  }
}