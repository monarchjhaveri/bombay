#!/usr/bin/env node

const prog = require('caporal');
const async = require('async');
const crypto = require("crypto");
const fs = require('fs-extra');
const mustache = require('mustache');
mustache.tags = ['{@', '@}'];
const path = require('path');
const bombayScripts = require('../scripts/bombay-scripts.js');
const exec = require('child_process').exec;

const getTemplates = require('./util/getTemplates');
const writeFiles = require('./util/writeFiles');

const TEMPLATES_DIR = __dirname + '/templates'

prog
  .version('0.0.1')
  .command('new', 'Create a new Bombay application')
  .argument('<name>', 'Name of the new application. This will be the folder in which your application will be created.')
  .action(function(args, options, logger) {
    const id = crypto.randomBytes(16).toString("hex");
    const OUTPUT_DIR = path.join(process.cwd(), args.name)

    const mustacheParams = {
      app: {
        name: args.name
      }
    }
    
    return new Promise(function (resolve, reject) {
      async.waterfall([
        (callback) => getTemplates('new', callback),
        (files, callback) => {
          files.forEach(file => {
            file.output = mustache.render(file.templateContent, mustacheParams);
          });

          callback(null, files);
        },
        (files, callback) => writeFiles(OUTPUT_DIR, files, callback),
        (files, callback) => {
          exec(`cd ${OUTPUT_DIR} && yarn install`, (err, stdout, stderr) => {
            process.stdout.write(stdout);
            process.stderr.write(stderr);
            console.error(err);

            if (err) callback(err);
            else callback();
          })
        }
      ], function(err, data) {  
        console.log(data)
        if (err) return reject(err);
        else resolve(data);
      })
    })
  })
  .command('build', 'Start a Bombay application')
  .action(function(args, options, logger) {
    bombayScripts.build();
  })

prog.parse(process.argv)
