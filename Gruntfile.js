module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          colors: true
        },
        src: ['test/*.js']
      }
    },

    jshint: {
      files: ['Gruntfile.js', 'app.js', 'public/js/map.js', 'public/models/*.*', 'routes/*.*', 'test/*.js'],
      options: {
        node: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        expr : true,
        //quotmark: "single", TODO: clean the messy quotmarks for single.
        globals: {
          // AMD

          module: true,
          require: true,
          requirejs: true,
          define: true,

          // Environments
          console: true,
          document: true,
          prompt: true, // TODO: I'd like to know of a way to avoid this (isn't prompt part of window?)

          // General Purpose Libraries
          $: true,
          jQuery: true,
          "L": true,

          // Testing
          sinon: true,
          describe: true,
          it: true,
          expect: true,
          before: true,
          afterEach: true
        }

      },

    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['jshint', 'mochaTest']);
  grunt.registerTask('test', ['mochaTest']);
};