const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const SRC_DIR = path.join(__dirname, 'src');

const indexCss = new ExtractTextPlugin('index.css');

const argv = require('minimist')(process.argv.slice(2));

const targetOption = argv.target;
// const output = targetOption === 'web' ? 'build/web' : 'build/electron';
const BUILD_DIR = path.join(__dirname, 'build');

const options = {
  entry: { index: ['babel-polyfill', './index.js'] },
  target: targetOption,
  output: {
    path: BUILD_DIR,
    filename: 'js/[name].js',
    pathinfo: false,
  },
  node: {
    fs: 'empty',
    __dirname: false,
    __filename: false,
  },
  context: SRC_DIR,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  plugins: [
    indexCss,
    new HtmlWebpackPlugin({
      title: 'app',
      filename: 'index.html',
      template: 'public/index.html',
      chunks: ['index'],
    }),
    new CopyWebpackPlugin([{ from: './public/', to: '' }]),
  ],
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
module.exports = options;
