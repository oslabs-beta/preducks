/* eslint-disable linebreak-style */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const BUILD_DIR = path.join(__dirname, 'build');
const SRC_DIR = path.join(__dirname, 'src');

module.exports = {
  devServer: {
    contentBase: BUILD_DIR,
    hot: true,
    compress: true,
  },
  entry: ['babel-polyfill', './index.js'],
  mode: 'development',
  node: {
    fs: 'empty',
  },
  output: {
    path: BUILD_DIR,
    filename: 'js/bundle.js',
    pathinfo: false,
  },
  context: SRC_DIR,
  devtool: 'eval-source-map',
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
        test: /\.(s?css)$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                camelCase: true,
                sourceMap: true,
              },
            },
          ],
        }),
      },
    ],
  },

  plugins: [
    // new CleanWebpackPlugin([BUILD_DIR]),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
    new ExtractTextPlugin({
      filename: 'styles/style.css',
      allChunks: true,
    }),
  ],
  watch: true,
};
