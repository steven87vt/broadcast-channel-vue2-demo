const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = env => {
  const isDevBuild = !(process.env.NODE_ENV && process.env.NODE_ENV === 'production')
  const extractCSS = new ExtractTextPlugin('vendor.css')
  return [
    {
      stats: { modules: false },
      resolve: {
        extensions: ['.js']
      },
      module: {
        rules: [
          { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' },
          { test: /\.css(\?|$)/, use: extractCSS.extract(['css-loader']) },
          { test: /\.(scss)$/, use: extractCSS.extract(['css-loader', 'sass-loader']) }
        ]
      },
      entry: {
        vendor: ['bootstrap', './ClientApp/scss/custom.scss', 'vue', 'vuex', 'vue-router']
      },
      output: {
        path: path.join(__dirname, 'wwwroot', 'dist'),
        publicPath: '/',
        filename: '[name].js',
        library: '[name]_[hash]'
      },
      plugins: [
        extractCSS,
        new OptimizeCSSPlugin({
          cssProcessorOptions: {
            safe: true
          }
        }),
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery',
          Popper: ['popper.js', 'default']
        }),
        new webpack.DllPlugin({
          path: path.join(__dirname, 'wwwroot', 'dist', '[name]-manifest.json'),
          name: '[name]_[hash]'
        }),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
        })
      ].concat(isDevBuild ? [] : [new UglifyJsPlugin()])
    }
  ]
}
