module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
            chrome: { files: { '_src/chrome/psdle/js/psdle.js': 'psdle.js' } }
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
        exec: {
            chrome_zip: 'call _src/chrome/7-Zip.bat',
            chrome_deploy: {
                command: 'call _src/chrome/deploy.bat',
                exitCode: [0,1]
            },
            deploy: 'deploy-sync.bat'
        },
        'string-replace': {
            compile: {
                files: {
                    '_src/psdle.includes.js': '_src/psdle.includes.js'
                },
                options: {
                    replacements: [{
                        pattern: /(version\s*:\s*").*?(",)/ig,
                        replacement: '$1<%= pkg.version %>$2'
                    },{
                        pattern: /(versiondate\s*:\s*").*?(",)/ig,
                        replacement: '$1<%= grunt.template.today("yyyy-mm-dd") %>$2'
                    }]
                }
            },
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
        },
        'concat-json': {
            lang: {
                cwd: "_src/lang/all",
                src: [ "*.json" ],
                dest: "_src/lang/lang.min.json"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-concat-json');

    grunt.registerTask('minlang', 'Concat and minify language files. Never automate, shouldn\'t need often.', ['concat-json:lang']);
    grunt.registerTask('compile', 'Bake in language JSON and minified CSS, then bake in version.', function(){
        grunt.task.run([
            'cssmin',
            'includes:build',
            'string-replace:compile'
        ])
    });
    grunt.registerTask('chrome', ['exec:chrome_deploy']);
    grunt.registerTask('release', 'Generate PSDLE release, compiles first.', function() {
        grunt.task.run([
            'compile',
            'copy:release',     //Base
            'string-replace:release', //Set versions
            'uglify:release',   //Minified
            'copy:chrome',
            'concat:userscript', //Userscript
            'exec:chrome_zip' //Chrome + Firefox
       ]);
    });
    grunt.registerTask('deploy', 'Run release then deploy script.', function() {
        grunt.task.run([
            'chrome',
            'exec:deploy'
        ])
    });
    grunt.registerTask('default', 'Runs compile.', function() {
        grunt.task.run(['compile']);
    });
};