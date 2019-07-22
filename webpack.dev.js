/* eslint-disable linebreak-style */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const BUILD_DIR = path.join(__dirname, 'build');
// const SRC_DIR = path.join(__dirname, 'src');

module.exports = merge(common, {
  devServer: {
    contentBase: BUILD_DIR,
    hot: true,
    compress: true,
  },
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [new webpack.HotModuleReplacementPlugin()],
  watch: true,
});
