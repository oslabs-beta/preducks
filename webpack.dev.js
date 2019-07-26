/* eslint-disable linebreak-style */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const argv = require('minimist')(process.argv.slice(2));

const common = require('./webpack.common.js');

const targetOption = argv.target;
const output = targetOption === 'web' ? 'build/web' : 'build/electron';
const BUILD_DIR = path.join(__dirname, output);

module.exports = merge(common, {
  devServer: {
    contentBase: BUILD_DIR,
    hot: true,
    compress: true,
  },
  mode: 'development',
  devtool: 'eval-source-map',
  plugins: [new webpack.HotModuleReplacementPlugin()],
  watch: true,
});
