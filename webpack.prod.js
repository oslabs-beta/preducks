/* eslint-disable linebreak-style */
// const path = require('path');
const merge = require('webpack-merge');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');
const common = require('./webpack.common.js');

// const BUILD_DIR = path.join(__dirname, 'build');
// const SRC_DIR = path.join(__dirname, 'src');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    usedExports: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [new CompressionPlugin()],
});
