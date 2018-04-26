// enable debug for gulp
process.env.DEBUG = process.env.DEBUG || 'fcc:*';
require('dotenv').load();

require('babel-core/register');

const gulp = require('gulp'),
  debug = require('debug')('fcc:gulp'),
  path = require('path'),
  nodemon = require('gulp-nodemon');

gulp.task('serve', function(cb) {
  let called = false;
  const monitor = nodemon({
    script: path.normalize('node_modules/serverless/bin/serverless'),
    args: ['offline', 'start', '--skipCacheInvalidation'],
    env: {
      NODE_ENV: process.env.NODE_ENV || 'development',
      DEBUG: process.env.DEBUG || 'fcc:*'
    }
  })
    .on('start', function() {
      if (!called) {
        called = true;
        cb();
      }
    })
    .on('restart', function(files) {
      if (files) {
        debug('Nodemon will restart due to changes in: ', files);
      }
    });

  process.once('SIGINT', () => {
    monitor.once('exit', () => {
      /* eslint-disable no-process-exit */
      process.exit(0);
      /* eslint-enable no-process-exit */
    });
  });
});

gulp.task('default', ['serve']);
