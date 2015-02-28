

var gulp = require('gulp');
var del = require('del');
var externs = require('gulp-externs');
var gjslint = require('gulp-gjslint');
var include = require('gulp-file-include');
var compiler = require('gulp-closure-compiler');


/**
 * List os sources.
 */
var src = [
  'lib/md/md.js',
  'lib/md/cursor.js',
  'lib/md/packet-handler.js',
  'lib/md/connection.js'
];


/**
 * Checks codestyle with Closule Linter
 */
gulp.task('lint', function() {
  gulp.src(src)
      .pipe(gjslint({
        flags: ['--strict', '--custom_jsdoc_tags namespace, event']
      }))
      .pipe(gjslint.reporter('console'))
      .pipe(gjslint.reporter('fail'));
});


/**
 * Checks code with Closure Compiler
 */
gulp.task('check', function() {
  gulp.src(src)
      .pipe(compiler({
        compilerPath: '/usr/lib/node_modules/compiler.jar',
        fileName: 'index.js',
        compilerFlags: {
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          warning_level: 'VERBOSE',
          externs: [
            'node_modules/gulp-externs/externs/node/v0.12.0/module.js',
            'node_modules/gulp-externs/externs/node/v0.12.0/buffer.js',
            'node_modules/gulp-externs/externs/node/v0.12.0/events.js',
            'node_modules/gulp-externs/externs/node/v0.12.0/stream.js',
            'node_modules/gulp-externs/externs/node/v0.12.0/process.js',
            'node_modules/gulp-externs/externs/node/v0.12.0/net.js'
          ]
        }
      }));
});


/**
 * Removes all built data.
 */
gulp.task('clean', function() {
  del('bin');
  del('externs');
});


/**
 * Inserts files into lib/index.js
 */
gulp.task('build', ['clean'], function() {
  gulp.src('lib/index.js')
      .pipe(include({
        prefix: '//',
        basepath: 'lib'
      }))
      .pipe(gulp.dest('bin'));
});


/**
 * Extracts externs for bin/index.js.
 * Can be used in --externs flag for Closure Compiler in modules using this one.
 * Executes only after `build`.
 */
gulp.task('externs', ['build'], function() {
  gulp.src('bin/index.js')
      .pipe(externs.extract())
      .pipe(gulp.dest('externs'));
});


/**
 * Executes default tasks: lint, check, clean->build->externs.
 *    > gulp
 */
gulp.task('default', function() {
  gulp.start('lint', 'check', 'externs');
});
