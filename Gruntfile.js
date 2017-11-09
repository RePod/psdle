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
            },
            chrome: {
                files: [{expand: false, src: ['_src/psdle.includes.js'], dest: '_dist/psdle.js', filter: 'isFile'}],
            }
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> <%= pkg.license %> - base+user - compiled <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            userscript: {
                src: ['_src/psdle.user.txt', '_src/psdle.includes.js'],
                dest: '_dist/psdle.user.js',
            }
        },
        run_executables: {
            chrome: {
                cmd: '_src/chrome/7-Zip.bat'
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-minjson');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-run-executables');

    grunt.registerTask('compile', ['minjson','cssmin','includes:build']);
    grunt.registerTask('release', 'Generate PSDLE release, compiles first.', function() {
        grunt.task.run([
            'compile',
            'copy:release',     //Base
            'uglify:release',   //Minified
            'concat:userscript', //Userscript
            'run_executables:chrome' //Chrome
       ]) 
    });
    
    grunt.registerTask('default', 'Runs compile.', function() {
        grunt.task.run(['compile']);
    });
};