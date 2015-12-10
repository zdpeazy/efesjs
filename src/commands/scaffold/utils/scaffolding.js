"use strict";

(() => {

  const async = require('async');
  const chalk = require('chalk');
  const template = require('art-template');
  const fs = require('fs');

  const fsp = require('../../../utils/fs.js');
  const walk = require('../../../utils/walk.js');
  const path = require('../../../utils/path.js');


  module.exports = function(data, callback) {

    let dirname = path.join(__dirname, '..', 'template', data.scaffold);

    let regIncludes = [];

    let regExcludes = [/node_modules/, /\.git/, /\.tmp/, /.DS_Store/];

    if (!data.exCoffee) {
      regExcludes.push(/coffee/);
    }
    if (!data.exES6) {
      regExcludes.push(/es6/);
    }
    if (!data.exLess) {
      regExcludes.push(/less/);
    }
    if (!data.exJade) {
      regExcludes.push(/jade/);
    }

    walk(dirname, regIncludes, regExcludes, function(err, results) {

      async.each(results, function(repo, done) {

        let stat = fs.lstatSync(repo);
        let rdirname = repo.replace(dirname, '').replace(path.sep, '');
        let fall = [];

        if (stat.isDirectory()) {

          fall.push(fsp.pMkdir(rdirname));

        } else if (!/^\./.test(rdirname)) {

          fall.push(fsp.pWriteFile(rdirname.replace('_', '.'), repo, data));

        }
        async.waterfall(fall, done);
      }, function() {
        callback();
      });
    });
  };

})();
