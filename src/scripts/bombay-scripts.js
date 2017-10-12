#!/usr/bin/env node
const fs = require('fs-extra');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const WebpackDevServer = require('webpack-dev-server');

const PROJECT_DIRECTORY = process.cwd();
const SCRIPTS_DIRECTORY = __dirname;

const compiler = Webpack({
  entry: [
    'webpack-dev-server/client?http://localhost:1337',
    path.join(PROJECT_DIRECTORY, "/app/bin/app.js")
  ],
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
  build: () => compiler.run(handler),
  serve: () => {
    const s = new WebpackDevServer(compiler, {
      stats: {
        colors: true
      },
      inline: true,
      watchOptions: {
        poll: true
      }
    });

    s.listen(1337, '127.0.0.1', () => {
      console.log("Bombay is listening on http://localhost:1337!");
    })
  }
}
