'use strict';
// /////////////////////////////////////////////////////////////////
// requires
// /////////////////////////////////////////////////////////////////
var gulp = require('gulp');
var browserSync = require('browser-sync');
var copy = require('gulp-copy');
var nodemon = require('gulp-nodemon');
var refresh = browserSync.reload;
var path = require('path');
var gulpBowerFiles = require('gulp-bower-files');

var config = {
    bootstrapDir: './bower_components/bootstrap',
    fontawesomeDir: './bower_components/font-awesome',
    publicDir: './public',
    bowerDir: './bower_components'
};
// /////////////////////////////////////////////////////////////////
// Tasks
// /////////////////////////////////////////////////////////////////



// Task nodemon starts app with nodemon
gulp.task('nodemon', function (cb) {

	var started = false;

	return nodemon({
		script: 'index.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true;
		}
	});
});

// browser-sync requires task nodemon to complete first.
gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:3000",
        //files: ["public/**/*.*"],
        files: ['*'],
        port: 7000,
	});
});


gulp.task('browserrefresh', function() {
	gulp.watch([path.join(__dirname, '/views/**/*.*')])
  	.on('change',function(cb){
    	refresh();  	
	})
});

gulp.task('publicfolder', function() {
	gulp.watch([path.join(__dirname, '/public/**/*.*')])
	.on('change', function() {
	  refresh();
	})
});




// /////////////////////////////////////////////////////////////////
// Default task
// /////////////////////////////////////////////////////////////////

gulp.task('default', ['browser-sync', 'browserrefresh','publicfolder']);