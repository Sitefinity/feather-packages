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
      styl   : '<%= pkg.name %>/styl/**/*.styl',
      css    : '<%= pkg.name %>/css/**/*.min.css',
      cssdev : '<%= pkg.name %>/css/**/*.css',
    },

    // clean all generated files
    clean: {
      all: {
        files: [{
          src: [
            '<%= src.css %>',
            '!<%= pkg.name %>/css/style.min.css',
            '<%= src.cssdev %>'
          ]
        }]
      },
      sprites: {
        files: [{
          src: [
            '<%= pkg.name %>/images/src/sprites/*.png',
            '<%= pkg.name %>/images/dist/sprites/*.png'
          ]
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
        src: ['<%= src.css %>']
      }
    },

    // many more options here https://github.com/Ensighten/grunt-spritesmith#usage
    sprite: {
      flags: {
        engine: 'pngsmith',
        src: '<%= pkg.name %>/images/src/flags/*.png',
        destImg: '<%= pkg.name %>/images/src/sprites/flags-<%= timestamp %>.png',
        imgPath: '/<%= pkg.name %>/images/src/sprites/flags-<%= timestamp %>.png',
        destCSS: '<%= pkg.name %>/styl/_sprite-flags.styl',
        cssFormat: 'css',
        cssTemplate: 'sprite-flags.styl.mustache'
      }
    },
    stylus: {
      options: {
        urlfunc: 'inline-image', // use inline-image('test.png') in our code to trigger Data URI embedding
        compress: false
      },
      dev: {
        files: {
          '<%= pkg.name %>/css/style.css': ['<%= pkg.name %>/styl/style.styl']
        }
      },
      dist: {
        options: {
          compress: true
        },
        files: {
          '<%= pkg.name %>/css/style.css': ['<%= pkg.name %>/styl/style.styl']
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
            cwd: '<%= pkg.name %>/images/src/',
            src: ['**/*.{png,jpg,gif,jpeg}'],
            dest: '<%= pkg.name %>/images/dist/'
          }
        ]
      }
    },

    watch: {
      options: {
        spawn: false
      },
      styles_dev: {
        files: ['<%= src.styl %>'],
        tasks: ['stylus:dev', 'newer:csslint:dev', 'newer:imagemin']
      },
      styles_dist: {
        files: ['<%= src.styl %>'],
        tasks: ['stylus:dist', 'newer:imagemin']
      }
    },

    concurrent: {
      dev: {
        tasks: ['watch:styles_dev', 'watch:scripts_dev'],
        options: {
          logConcurrentOutput: true
        }
      },
      dist: {
        tasks: ['watch:styles_dist', 'watch:scripts_dist'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  // Tasks
  // default task runs csslint once on startup on documentation's css
  grunt.registerTask('default', [
    'clean:all',
    'stylus:dev',
    'stylus:dist',
    'newer:csslint:dev',
    'newer:imagemin',
    'concurrent:dist'
  ]);

  grunt.registerTask('sprites', [
    'clean:sprites',
    'sprite',
    'newer:imagemin',
    'stylus:dev',
    'newer:csslint:dev'
  ]);
};