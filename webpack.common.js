const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const BUILD_DIR = path.join(__dirname, 'build');
const SRC_DIR = path.join(__dirname, 'src');

const indexCss = new ExtractTextPlugin('index.css');

module.exports = {
  entry: { index: ['babel-polyfill', './index.js'] },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'app',
      filename: 'index.html',
      template: 'public/index.html',
      chunks: ['index'],
    }),
    indexCss,
  ],
  output: {
    path: BUILD_DIR,
    filename: 'js/[name].js',
    pathinfo: false,
  },
  node: {
    fs: 'empty',
  },
  context: SRC_DIR,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      { test: /\.ts$/, exclude: /node-modules/, loader: 'babel-loader' },
      { test: /\.tsx$/, exclude: /node-modules/, loader: 'babel-loader' },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /index.css$/,
        use: indexCss.extract({
          use: 'css-loader',
        }),
      },
    ],
  },
};
