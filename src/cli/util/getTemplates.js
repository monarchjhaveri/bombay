const path = require('path');
const glob = require('glob');
const async = require('async');
const fs = require('fs-extra');

const TEMPLATES_DIR = path.resolve(__dirname + '/../templates');

module.exports = function getTemplates(templateName, callback) {
  // get all files in templates dir recursively
  const templatesDir = path.join(TEMPLATES_DIR, templateName);

  const options = {
    root: templatesDir,
    nodir: true,
    dot: true,
    nomount: true
  };

  async.waterfall([
    function(cb) {
      glob('/**/*', options, cb);
    },
    function(files, cb) {
      cb(null, files.map(f => {
        const src = path.join(TEMPLATES_DIR, templateName, f);
        return {
          path: f,
          src,
          templateContent: fs.readFileSync(src, 'utf-8'),
          output: '' // gets written elsewhere
        }
      }))
    }
  ], callback)
}