const async = require('async')
const path = require('path');
const fs = require('fs-extra');
const tmp = require('tmp');

module.exports = function writeFiles(outputPath, files, callback) {
  const tmpDir = tmp.dirSync({unsafeCleanup: true});
  const tmpPath = tmpDir.name;

  const tasks = files.map(f => fileCb => {
    const destFilePath = path.join(outputPath, f.path)
    const tmpFilePath = path.join(tmpPath, f.path)

    fs.ensureFileSync(tmpFilePath);
    fs.writeFileSync(tmpFilePath, f.output);
    
    f.dest = destFilePath;
    f.tmp = tmpFilePath;

    fileCb(null, f);
  });

  async.waterfall([
    innerCb => async.parallel(tasks, innerCb),
    (ignored, innerCb) => {
      fs.copy(tmpPath, outputPath, {
        overwrite: false,
        errorOnExist: true
      }, innerCb)
    }
  ], (err, data) => {
    tmpDir.removeCallback();
    callback(err, data);
  })
}