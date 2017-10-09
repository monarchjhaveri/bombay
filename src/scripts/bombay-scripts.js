#!/usr/bin/env node
const fs = require('fs-extra');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const PROJECT_DIRECTORY = process.cwd();
const SCRIPTS_DIRECTORY = __dirname;

console.log(fs.readdirSync(PROJECT_DIRECTORY))

const compiler = webpack({
  entry: path.join(PROJECT_DIRECTORY, "app/bin/app.js"),
  output: {
    path: path.join(PROJECT_DIRECTORY, "/target"),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css" }
    ],
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ],
  },
  plugins: [new HtmlWebpackPlugin({
    template: path.join(PROJECT_DIRECTORY, 'app/bin/index.html')
  })]
});

const handler = (err, stats) => {
  process.stdout.write(stats.toString() + "\n");
}

module.exports = {
  build: () => compiler.run(handler)
}
