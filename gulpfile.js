var gulp = require('gulp');
var webpack = require('webpack');
var del = require('del');
var assign = require('object-assign');

var webpackConfig = require('./webpack.config.js');

gulp.task('clean', function(done) {
    del('browser/', done);
});

gulp.task('song-flux-o-action', ['clean'], function(done) {
    var customConfig = assign({}, webpackConfig);
    customConfig.entry = {'o-action': './decorators/o-action.js'};
    customConfig.output.path = 'browser/decorators/';
    webpack(customConfig, done);
});

gulp.task('song-flux', ['clean'], function(done) {
    webpack(webpackConfig, done);
});

gulp.task('default', ['clean', 'song-flux', 'song-flux-o-action']);

