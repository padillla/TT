

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['Gruntfile.js', 'app.js', 'public/js/map.js', 'public/models/*.json'],
      options: {
        node : true,
       globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true,
          browser: true,
          "L" : true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }


// Git tasks I dont want to do by hand
/*
    gitpush: {
      your_target: {
        options: {
          
      }
    },

    gitcommit: {
      task: {
        options: {
          message: 'Automated'
        },
        files: {
          src: ['test.txt']
        }
      }
    },

    gitstash: {
      your_target: {
        options: {
          // Target-specific options go here.
        }
      }
    },

    gitcheckout: {
      task: {
        options: {
          branch: 'testing',
          create: true
        }
      }
    },
*/
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.loadNpmTasks('grunt-contrib-watch');

  /*grunt.loadNpmTasks('grunt-git');*/


  grunt.registerTask('watch', ['watch']);

  grunt.registerTask('default', ['jshint']);

 // grunt.registerTask('deploy', ['TEST', 'GIT ADD ', ' GIT COMMIT', 'GIT PUSH ORIGIN MASTER', 'GIT PUSH HEROKU MASTER']);

  //grunt.registerTask('test', ['THIS WILL RUN TESTS, soon])
};