// Gruntfile.js
module.exports = function(grunt) {

  // tells how much time each task takes
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt)({
    pluginsRoot: 'node_modules'
  });

  // Load Plugins
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Runs JS Hint on JavaScript files
    jshint: {
      options: {
        force: true,
        jshintrc: true,
        reporter: require('jshint-stylish')
      },
      src: [
        'app/*/*.js',
        '!app/bower_components/**/*.js',
        '!app/dist/',
        'server/**/*.js',
        'server/config/*.js',
        'Gruntfile.js',
        'chrome_ext/**/*.js',
        'test/**/*.js'
      ]
    },

    // Lints CSS files
    csslint: {
      options: {
        force: true
      },
      src: [
        'app/styles/*.css'
      ]
    },

    // this task deletes ‘stuff’ - use with caution!
    clean: {
      release: [
        'app/dist/**/',
        'tempImg/',
      ]
    },

    // Copy files into the dist folder
    copy: {
      main: {
        files: [{
          expand: true,
          flatten: true,
          src: [
            'app/categories/*.html',
            'app/Clips/*.html',
            'app/clipSelect/*.html',
            'app/header/*.html',
            'app/Landing/*.html',
            'app/Profile/*.html',
            'app/Services/*.html',
            'app/Suggestions/*.html',
          ],
          dest: 'app/dist/html',
          filter: 'isFile'
        }]
      },
      favicon: {
        src: 'app/apple-icon-144x144.png',
        dest: 'app/dist/'
      },
      fonts: {
        files: [{
          expand: true,
          flatten: true,
          src: [
            'app/bower_components/font-awesome/fonts/*.{eot,svg,ttf,woff,woff2,otf}'
          ],
          dest: 'app/dist/fonts/',
          filter: 'isFile'
        }]
      },
      movie:{
        files:[{
          expand: true,
          flatten: true,
          src:[
          'app/assets/images/clipVideo_compressed.mp4'
          ],
          dest:'app/dist/mov',
          filter:'isFile'
        }]
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      js: {
        src: [
          'app/bower_components/jquery/dist/jquery.js',
          "app/bower_components/jquery-ui/jquery-ui.js",
          'app/bower_components/angular/angular.js',
          'app/bower_components/bootstrap/dist/js/bootstrap.min.js',
          'app/bower_components/angular-dragdrop/src/angular-dragdrop.js',
          'app/bower_components/angular-animate/angular-animate.js',
          'app/bower_components/angular-cookies/angular-cookies.js',
          'app/bower_components/angular-resource/angular-resource.js',
          'app/bower_components/jasny-bootstrap/dist/js/jasny-bootstrap.js',
          'app/bower_components/angular-xeditable/dist/js/xeditable.js',
          'app/bower_components/angular-route/angular-route.js',
          'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
          'app/bower_components/ng-confirm/dist/ng-confirm.js',
          'app/bower_components/angular-ui-router/release/angular-ui-router.js',
          'app/bower_components/angular-aside/dist/js/angular-aside.js',
          'app/bower_components/angular-sanitize/angular-sanitize.js',
          'app/bower_components/angular-touch/angular-touch.js',
          "node_modules/moment/moment.js",
          "node_modules/angular-moment/angular-moment.js",
          'app/app.js',
          'app/Services/services.js',
          'app/categories/categoriesController.js',
          'app/Clips/clippedController.js',
          'app/Clips/sidebarController.js',
          'app/clipSelect/suggestedController.js',
          'app/Landing/LandingController.js'
        ],
        dest: 'app/dist/js/app.concat.js'
      }
    },

    // Takes JS files and minifies them
    uglify: {
      options: {
        mangle: false, // setting to false preserves var names
        preserveComments: false
      },
      build: {
        src: 'app/dist/js/app.concat.js',
        dest: 'app/dist/js/app.min.js'
      }
    },

    // Minify CSS
    cssmin: {
      build: {
        files: {
          // target file : src files
          'app/dist/css/stylesheet.min.css': [
          'app/bower_components/bootstrap/dist/css/bootstrap.min.css',
          'app/bower_components/bootstrap-social/bootstrap-social.css',
          'app/bower_components/font-awesome/css/font-awesome.min.css',
          'app/bower_components/angular-xeditable/css/xeditable.css',
          'app/bower_components/jasny-bootstrap/dist/css/jasny-bootstrap.min.css',
          'app/styles/stylesheet.css'
          ]
        }
      }
    },

    //Compress Images
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'app/assets/',
          src: 'images/*.{png,jpg,gif,jpeg}',
          dest: 'app/dist/'
        }]
      }
    },

    processhtml: {
      dist: {
        files: {
          'app/dist/index.html': ['app/index.html']
        }
      }
    },
    //Watches for changes in any javascript files, and builds
    watch: {
      scripts: {
        files: [
          'app/**/*.js',
          '!app/bower_components/**/*js',
          '!/app/dist/**/*js',
          'app/**/*.html',
          'app/*.js',
          'app/*.html'
        ],
        tasks: [
          'build'
        ]
      }
    },

    //Shell command to start the server and
    shell: {
      view: {
        command: 'open http://localhost:3000/',
        options: {
            execOptions: {
                maxBuffer: 500 * 1024 // or Infinity
            }
        }
      },
      server:{
        command: 'nodemon server/server.js'
      }
    },
  });

  // Default Tasks
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('dev', ['build']);
  grunt.registerTask('server', ['express', 'open', 'watch']);
  grunt.registerTask('build', ['clean', 'jshint', 'csslint', 'copy',
    'concat', 'uglify', 'cssmin', 'imagemin', 'processhtml', 'server']);
  // Open app in new browser window
  grunt.registerTask('view', function () {
    grunt.task.run([ 'shell:view' ]);
  });

  // Start local server
  grunt.registerTask('server', function () {
    grunt.task.run([ 'shell:server' ]);
  });
};