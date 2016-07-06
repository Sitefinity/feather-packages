'use strict';
var path = require('path');

// match one level down:
// e.g. 'bar/foo/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// e.g. 'bar/foo/**/*.js'

module.exports = function (grunt) {
    'use strict';

    //Package js files
    var sfjsfiles = grunt.file.readJSON('sf-jsfiles.json').concatJsFiles;

    // User assets
    // Load the order for minifying js files
    var jsfiles = grunt.file.readJSON('jsfiles.json').concatJsFiles;
    // Rename this with the name of your your user assets folder
    var userAssetsFolder = "oranges";

    //defining platforms
    var options,
        target = grunt.option("target");

    if (target) {
        options = target.split(",");
    } else {
        options = ["sitefinityBootstrap"];
    }

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // show elapsed time at the end

    require('time-grunt')(grunt);
    // Init
    grunt.initConfig({
        timestamp: '<%= new Date().getTime() %>',
        pkg: grunt.file.readJSON('package.json'),

        src: {
            path: 'assets/src',
            sass: '**/*.{scss,sass}'
        },

        dist: {
            path: 'assets/dist'
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
                    '<%= dist.path %>/css/sitefinity.bootstrap.css': '<%= src.path %>/sitefinity/sass/sitefinity.bootstrap.scss'
                }
            },
            sitefinity: {
                files: {
                    '<%= dist.path %>/css/sitefinity.css': '<%= src.path %>/sitefinity/sass/sitefinity.scss'
                }
            },
            // User assets 
            // Will look for any .scss files in userAssetsFolder sass directory
            userAssets: {
                files: [{
                    expand: true,
                    cwd: '<%= src.path %>/' + userAssetsFolder + '/sass',
                    src: ['*.scss'],
                    dest: '<%= dist.path %>/css/',
                    ext: '.css'
                }]
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
                src: 'assets/src/sitefinity/icons/*.svg',
                dest: 'assets/dist/fonts/',
                destCss: 'assets/src/sitefinity/sass/icons/',
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
                src: ['*.css', '!*.min.css'],
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
                warnings: true,
                mangle: true,
                compress: true
            },
            sitefinity: {
                files: {
                    '<%= dist.path %>/js/output.min.js': sfjsfiles

                }
            },
            sitefinityBootstrap: {
                files: {
                    '<%= dist.path %>/js/sitefinity.bootstrap.min.js': [ 'node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',  sfjsfiles] 

                }
            },
            userAssets: {
                files: {
                    // User assets
                    // Will uglify all files listed in files.json
                    '<%= dist.path %>/js/output.min.js': jsfiles
                }
            }
        },

        // Image Optimization
        imagemin: {
            sitefinity: {
                options: {
                    optimizationLevel: 4,
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: 'assets/src/sitefinity',
                    src: ['**/*.{png,jpg,gif,jpeg}'],
                    dest: 'assets/dist'
                }],
            },
            userAssets: {
                options: {
                    optimizationLevel: 4,
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: 'assets/src/' + userAssetsFolder,
                    src: ['**/*.{png,jpg,gif,jpeg}'],
                    dest: 'assets/dist'
                }]
            }
        },

        // Sprite generation
        sprite: {
            all: {
                src: 'assets/src/sitefinity/images/sprite/*.png',
                dest: 'assets/src/sitefinity/images/sprite.png',
                destCss: 'assets/src/sitefinity/sass/_sf-sprite.scss',
                cssTemplate: 'assets/src/sitefinity/sass/sf-sprite.mustache'
            }
        },

        watch: {
            options: {
                spawn: false
            },
            styles: {
                files: ['<%= src.path %>/**/*.{scss,sass}'],
                tasks: ['sass', 'cssmin']
            },
            images: {
                files: ['<%= src.path %>/**/*.{png,jpg,gif,jpeg}'],
                tasks: ['clean:images', 'sprite', 'imagemin']
            },
            js: {
                files: ['<%= src.path %>/**/*.js'],
                tasks: ['uglify']
            }
        },

        concurrent: {
            dist: {
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

    grunt.registerTask('default', ' ', function () {
        grunt.task.run('clean:css');
        grunt.task.run('newer:sprite');

        options.forEach(function (value) {
            if (exists('sass', value)) {
                grunt.task.run('sass:' + value);
            }
            if (exists('uglify', value)) {
                grunt.task.run('uglify:' + value);
            }
        });

        grunt.task.run('cssmin');
        grunt.task.run('newer:imagemin');
        grunt.task.run('concurrent');

    });

    grunt.event.on('watch', function (action, filepath) {
        var sassNames = [];
        options.forEach(function (value) {
            sassNames.push('sass:' + value);
        });

        var jsNames = [];
        options.forEach(function (value) {
            jsNames.push('uglify:' + value);
        });

        grunt.config('watch.js.tasks', jsNames);
        grunt.config('watch.styles.tasks', sassNames);



    });

    //support for subtasks
    var exists = function (task, target) {
        var path = [task];
        if (target && target.length > 0) {
            path.push(target);
        }
        return !!grunt.config.get(path);
    };

};
