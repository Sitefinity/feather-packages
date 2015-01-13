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
    jsFiles: grunt.file.readJSON('assets/src/js/imported-js.json'),

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
      images: {
        files: [{
          src: [
            '<%= dist.path %>/**/*.{png,jpg,gif,jpeg}'
          ]
        }]
      }
    },

    sass: {
      dist: {
        files: {
          '<%= dist.path %>/css/styles.css': '<%= src.path %>/sass/styles.sass'
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

    cssmin: {
      minify: {
        expand: true,
        cwd: '<%= dist.path %>/css/',
        src: ['*.css', '!*.min.css'],
        dest: '<%= dist.path %>/css/',
        ext: '.min.css'
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
        files: ['<%= jsFiles  %>']
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
        src: 'assets/src/images/social-share/*.png',
        dest: 'assets/src/images/social-share-sprite.png',
        destCss: 'assets/src/sass/_social-share-sprite.sass',
        cssTemplate: 'assets/src/sass/sitefinity/social-share-sprite.mustache'
      }
    },

    watch: {
      options: {
        spawn: false
      },
      styles: {
        files: ['<%= src.path %>/**/*.{scss,sass}'],
        tasks: ['sass:dist', 'cssmin']
      },
      images: {
        files: ['<%= src.path %>/**/*.{png,jpg,gif,jpeg}'],
        tasks: ['clean:images', 'imagemin']
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
  // default task runs csslint once on startup on documentation's css
  grunt.registerTask('default', [
    'clean:all',
    'sass:dist',
    'cssmin',
    'uglify:dist',
    'newer:imagemin',
    'concurrent:dev'
  ]);
};
