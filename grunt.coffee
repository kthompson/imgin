module.exports = (grunt) ->
  
  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    coffeelint:
      app: ["src/*.coffee"]

    watch:
      scripts:
        files: ["**/*.coffee"]
        tasks: ["build"]
        options:
          spawn: false

    uglify:
      options:
        banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"

      build:
        src: "src/<%= pkg.name %>.js"
        dest: "dist/<%= pkg.name %>.min.js"

    coffee:
      compile:
        options:
          sourceMap: true
          join: true
          dest: 'src'

        files:
          "src/<%= pkg.name %>.js": ["src/imgin.coffee"]

    compress:
      main:
        options:
          archive: "imgin.zip"

        files: [
          expand: true
          src: ["**"] # includes files in path                    
          cwd: "./dist"
        ]

  
  # Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-coffeelint"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks 'grunt-contrib-compress'

  
  # Default task(s).
  grunt.registerTask "build", ["coffeelint", "coffee", "uglify"]
  grunt.registerTask "default", ["build", "watch"]
  grunt.registerTask "release", ["build", "compress"]

  grunt.registerTask "prep", () ->
