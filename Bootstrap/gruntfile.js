'use strict';
var path = require('path');

// match one level down:
// e.g. 'bar/foo/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// e.g. 'bar/foo/**/*.js'

module.exports = function (grunt) {
	'use strict';

	// load all grunt tasks
	require('load-grunt-tasks')(grunt);

	// show elapsed time at the end
	require('time-grunt')(grunt);
	// Init
	grunt.initConfig({
		timestamp: '<%= new Date().getTime() %>',
		pkg: grunt.file.readJSON('package.json'),

		src: {
			path       : 'assets/src',
			sass       : '**/*.{scss,sass}'
		},

		dist: {
			path       : 'assets/dist'
		},

		// clean all generated files
		clean: {
			all: {
				files: [{
					src: [
						'<%= dist.path %>/**/*.css',
						'<%= dist.path %>/**/*.js',
						'<%= dist.path %>/**/*.{png,jpg,gif,jpeg}'
					]
				}]
			},
			css: {
				files: [{
					src: [
						'<%= dist.path %>/**/*.css',
					]
				}]
			},
			images: {
				files: [{
					src: [
						'<%= dist.path %>/**/*.{png,jpg,gif,jpeg}'
					]
				}]
			}
		},

		sass: {
			options: {
				outputStyle: 'nested'
			},
			sitefinityBootstrap: {
				files: {
					'<%= dist.path %>/css/sitefinity.bootstrap.css': '<%= src.path %>/sass/sitefinity.bootstrap.scss'
				}
			},
			sitefinity: {
				files: {
					'<%= dist.path %>/css/sitefinity.css': '<%= src.path %>/sass/sitefinity.scss'
				}
			}
		},

		// use always with target e.g. `csslint:doc` or `csslint:dev`
		// unfortunately there is no point to run csslint on compressed css so
		// csslint runs once, when you use `grunt` and it lints on documentation's css
		// csslint runs on every save when you use `grunt dev` and it lints the original file you are working on -> `style.css`
		csslint: {
			options: {
				csslintrc: 'csslint.json'
			},
			dev: {
				src: ['<%= src.sitefinity %>']
			}
		},

		webfont: {
			icons: {
				src: 'assets/src/icons/*.svg',
				dest: 'assets/dist/fonts/',
				destCss: 'assets/src/sass/icons/',
				options: {
					destHtml: '',
					engine: 'node',
					font: 'sf-icon-font',
					stylesheet: 'scss',
					partialPrefix: true,
					relativeFontPath: '../fonts/',
					template: 'feather-icons.css',
					types: 'eot,woff,ttf,svg',
					order: 'eot,woff,ttf,svg',
					startCodepoint: 0x00b1,
					normalize: true,
					fontHeight: 4096,
					ascent: 4096,
					descent: 0
				}
			}
		},

		cssmin: {
			minify: {
				expand: true,
				cwd: '<%= dist.path %>/css/',
				src: ['*.css','!*.min.css'],
				dest: '<%= dist.path %>/css/',
				ext: '.min.css',
				extDot: 'last'
			}
		},

		// Concat & minify
		// this processes only the files described in 'jsfiles.json'
		uglify: {
			options: {
				report: 'gzip',
				warnings: true
			},
			dist: {
				options: {
					mangle: true,
					compress: true
				},
				files: {
					'<%= dist.path %>/js/bootstrap.min.js':'node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'
				}
			}
		},

		// Image Optimization
		imagemin: {
			dist: {
				options: {
					optimizationLevel: 4,
					progressive: true
				},
				files: [
					{
						expand: true,
						cwd: 'assets/src/images',
						src: ['**/*.{png,jpg,gif,jpeg}'],
						dest: 'assets/dist/images'
					}
				]
			}
		},

		// Sprite generation
		sprite:{
			all: {
				src: 'assets/src/images/sprite/*.png',
				dest: 'assets/src/images/sprite.png',
				destCss: 'assets/src/sass/_sf-sprite.scss',
				cssTemplate: 'assets/src/sass/sf-sprite.mustache'
			}
		},

		watch: {
			options: {
				spawn: false
			},
			styles: {
				files: ['<%= src.path %>/**/*.{scss,sass}'],
				tasks: ['sass:sitefinityBootstrap', 'cssmin']
			},
			images: {
				files: ['<%= src.path %>/**/*.{png,jpg,gif,jpeg}'],
				tasks: ['clean:images', 'sprite', 'imagemin']
			},
			js: {
				files: ['<%= src.path %>/**/*.js'],
				tasks: ['uglify:dist']
			},
		},

		concurrent: {
			dev: {
				tasks: ['watch:styles', 'watch:js', 'watch:images'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	// Tasks
	grunt.registerTask('iconfont', [
		'webfont',
		'build'
	]);

	// Runs once
	grunt.registerTask('build', [
		'newer:sprite',
		'sass:sitefinityBootstrap',
		'cssmin',
		'uglify:dist',
		'newer:imagemin'
	]);

	// task that generates Sitefinity styles without bootstrap sources
	grunt.registerTask('sitefinity', [
		'clean:css',
		'newer:sprite',
		'sass:sitefinity',
		'cssmin',
		'uglify:dist',
		'newer:imagemin'
	]);

	// default task runs csslint once on startup on documentation's css
	grunt.registerTask('default', [
		'clean:css',
		'build',
		'concurrent:dev'
	]);
};
