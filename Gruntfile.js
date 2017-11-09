module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        minjson: {
            compile: {
                files: {
                    '_src/lang/lang.min.json': '_src/lang/lang.json'
                }
            }
        },
        cssmin: {
            target: {
            files: [{
                expand: true,
                cwd: '_src/css',
                src: ['*.css', '!*.min.css'],
                dest: '_src/css',
                ext: '.min.css'
                }]
            }
        },
        includes: {
            build: {
                files: [
                    {src: ['_src/psdle.base.js'], dest: '_src/psdle.includes.js'},// Source files
                ],
                flatten: true,
                cwd: '.',
                options: {
                    silent: true,
                    includeRegexp: /{{{include\s+"(\S+)"}}}/
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-minjson');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-includes');

    grunt.registerTask('compile', ['minjson','cssmin','includes:build']);
    grunt.registerTask('default', ['includes:build']);
};