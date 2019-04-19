var async = require('async');
var fs = require('fs');
var im = require('imagemagick');
var mkdirp = require('mkdirp');
var pathModule = require('path');

var utils = require('./lib/utils');


/**
 * Generate a imagemagick's parameter of meaning conversion area
 *
 * @return {string} e.g. '32x32+96+16' = '{width}x{height}+{left}+{top}'
 */
function _generateConversionArea(pos, size) {
  return size.join('x') + '+' + pos.slice().reverse().join('+');
}

/**
 * Require conf file
 *
 * @param {string|undefined|null} path
 * @return {object}
 *   e.g.
 *     {
 *       images: [
 *         { src: '/path/to/src.png', pos: [16, 96], size: [32, 32], dest: '/path/to/dest.png' }, ..
 *       ]
 *     }
 */
var DEFAULT_CONF_FILE_NAME = 'image-divider.js';
function requireConfFile(path) {
  path = path || pathModule.resolve(pathModule.join('./', DEFAULT_CONF_FILE_NAME));
  return require(path);
}

/**
 * @param {string} srcImagePath
 * @param {Array<number>} pos [top, left]
 * @param {Array<number>} size [width, height]
 * @param {string} destImagePath
 * @param {Function} callback (err)
 */
var crop = function crop(srcImagePath, pos, size, destImagePath, callback) {
  var tasks = [];

  // create unexisted directories
  var destImageRoot = pathModule.dirname(pathModule.resolve(destImagePath));
  if (!fs.existsSync(destImageRoot)) {
    tasks.push(function(next) {
      mkdirp(destImageRoot, { mode: 0755 }, next);
    });
  }

  tasks.push(function(next) {
    im.convert([
      srcImagePath,
      '-crop',
      _generateConversionArea(pos, size),
      destImagePath
    ], next);
  });

  async.series(tasks, callback);
};

/**
 * Divide a source image to some small images
 * @param {array<object>} imageSettings  Pass confData.images
 * @param {Function} callback (err)
 */
var divide = function divide(imageSettings, callback) {
  var tasks = imageSettings.map(function(setting) {
    return function(next) {
      crop(setting.src, setting.pos, setting.size, setting.dest, next);
    };
  });
  async.series(tasks, callback);
};


module.exports = {
  crop: crop,
  divide: divide,
  requireConfFile: requireConfFile,
  utils: utils
};
