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
                    includeRegexp: /{{{include\s+"(\S+)"}}}/,
                    banner: '/*! <%= pkg.name %> <%= pkg.license %> - base - compiled <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                }
            }
        },
        uglify: {
            release: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= pkg.license %> - min - compiled <%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                files: {
                    '_dist/psdle.min.js': ['_src/psdle.includes.js']
                }
            }
        },
        copy: {
            release: {
                files: [{expand: false, src: ['_src/psdle.includes.js'], dest: '_dist/psdle.js', filter: 'isFile'}],
            }
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> <%= pkg.license %> - base+user - compiled <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            release: {
                src: ['_src/psdle.user.txt', '_src/psdle.includes.js'],
                dest: '_dist/psdle.user.js',
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-minjson');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('compile', ['minjson','cssmin','includes:build']);
    grunt.registerTask('test', ['concat:release']);
    grunt.registerTask('release', 'Generate PSDLE release', function() {
       grunt.task.run(['compile']) 
       grunt.task.run(['copy:release'])   
       grunt.task.run(['uglify'])         //Minified
       grunt.task.run(['concat:release']) //Userscript
    });
    
    grunt.registerTask('default', '', function() {
        grunt.task.run(['compile']);
    });
};