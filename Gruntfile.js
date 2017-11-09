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
                files: {
                    '_src/psdle.includes.js': '_src/psdle.base.js'
                },
                flatten: true,
                cwd: '.',
                options: {
                    silent: true,
                    includeRegexp: /{{{include\s+"(\S+)"}}}/,
                    banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= pkg.license %> - base - compiled <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                }
            }
        },
        uglify: {
            release: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= pkg.license %> - min - compiled <%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                files: {
                    'psdle.min.js': '_src/psdle.includes.js'
                }
            }
        },
        copy: {
            release: { files: {'psdle.js': '_src/psdle.includes.js'} },
            chrome: { files: { 'psdle.js': '_src/psdle.includes.js' } }
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= pkg.license %> - user+base - compiled <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            userscript: {
                src: ['_src/psdle.user.txt', '_src/psdle.includes.js'],
                dest: 'psdle.user.js',
            }
        },
        run_executables: {
            chrome: { cmd: '_src/chrome/7-Zip.bat' },
            chrome2: { cmd: '_src/chrome/deploy.bat' },
            deploy: { cmd: 'deploy-sync.bat' }
        },
        'string-replace': {
            release: {
                files: {
                    '_src/chrome/psdle/manifest.json': '_src/chrome/psdle/manifest.json',
                    '_src/psdle.user.txt': '_src/psdle.user.txt'
                },
                options: {
                    replacements: [{
                        pattern: /("version":\s*").*?(",)/ig,
                        replacement: '$1<%= pkg.version %>$2'
                    },{
                        pattern: /(\/\/ @version(\s*)).*/ig,
                        replacement: '$1<%= pkg.version %>'
                    }]
                }
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
    grunt.loadNpmTasks('grunt-string-replace');

    grunt.registerTask('compile', ['minjson','cssmin','includes:build']);
    grunt.registerTask('release', 'Generate PSDLE release, compiles first.', function() {
        grunt.task.run([
            'compile',
            'copy:release',     //Base
            'string-replace:release', //Set versions
            'uglify:release',   //Minified
            'concat:userscript', //Userscript
            'run_executables:chrome' //Chrome
       ]) 
    });
    grunt.registerTask('deploy', 'Run release then deploy script.', function() {
        grunt.task.run([
            'release',
            'run_executables:chrome2',
            'run_executables:deploy'
        ])
    });
    
    grunt.registerTask('default', 'Runs compile.', function() {
        grunt.task.run(['compile']);
    });
};