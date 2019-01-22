const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const __DEV__ = process.env.NODE_ENV !== 'production'
console.log(__DEV__)

module.exports = {
  entry: path.resolve(__dirname, 'src/main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[hash].app.js'
  },
  mode: __DEV__ ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'src'),
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.module\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]--[hash:base64:5]'
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html')
    })
  ]
}