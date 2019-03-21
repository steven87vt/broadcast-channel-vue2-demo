const path = require('path')
const webpack = require('webpack')
const bundleOutputDir = './wwwroot/dist'
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env) => {
  const isDevBuild = !(process.env.NODE_ENV && process.env.NODE_ENV === 'production')
  console.log('Building app for development: ' + isDevBuild)
  
  return [
    {
      stats: { modules: false },
      entry: { main: './ClientApp/entry.js' },
      resolve: {
        extensions: ['.js', '.vue'],
        alias: 
          {
              vue$: 'vue/dist/vue',
              components: path.resolve(__dirname, './ClientApp/components'),
          } 
      },
      devServer: {
        hot: true,
        watchOptions: {
          poll: true
        }
      },
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      },
      output: {
        path: path.join(__dirname, bundleOutputDir),
        filename: '[name].js',
        publicPath: '/'
      },
      module: {
        rules: [
          { test: /\.vue$/, use: 'vue-loader' },
          { test: /\.js$/, include: /ClientApp/, use: 'babel-loader' },
          { test: /\.css$/, use: isDevBuild ? ['style-loader', 'css-loader'] : ExtractTextPlugin.extract({ use: 'css-loader' }) },
          { test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/, use: 'url-loader?limit=100000&name=[name].[ext]' },
          { test: /(pdfkit|linebreak|fontkit|unicode|brotli|png-js).*\.js$/, loader: 'transform-loader?brfs' }
        ]
      },
      plugins: [
        new CopyWebpackPlugin([{ from: './ClientApp/images' }]),
        new webpack.DllReferencePlugin({
          context: __dirname,
          manifest: require('./wwwroot/dist/vendor-manifest.json')
        }),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"',
        })
      ]
        .concat(
          isDevBuild
            ? [
                new webpack.SourceMapDevToolPlugin({
                  filename: '[file].map', // Remove this line if you prefer inline source maps
                  moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
                })
              ]
            : [new UglifyJsPlugin()]
        )
        .concat(
          [
            new HtmlWebpackPlugin({
              title: 'Testing Broadcast Channel',
              template: './ClientApp/templates/index.template.ejs'
            })
          ]
        )
    }
  ]
}
