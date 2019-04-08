module.exports = {
  chainWebpack: config => {
    config.externals({
      'd3': 'd3',
      'graphlibrary': 'graphlibrary',
      'dagre-d3-renderer': 'dagre-d3-renderer'
    })
  }
}