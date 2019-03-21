module.exports = function(api) {
  const presets = [
    [
      '@babel/env',
      {
        targets: 'current node',
        useBuiltIns: 'usage',
        modules: 'commonjs',
        debug: true
      }
    ]
  ]

  const plugins = ['transform-es2015-modules-commonjs', 'babel-plugin-dynamic-import-node']

  return {
    presets,
    plugins
  }
}
