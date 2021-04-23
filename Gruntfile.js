module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        includes: {
            build: {
                files: {
                    '_src/base/gotham/psdle.includes.js': '_src/base/gotham/psdle.base.js',
                    '_src/base/valkyrie/psdle.includes.js': '_src/base/valkyrie/psdle.base.js'
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
                files: [{
                    expand: true,
                    src: ['_src/base/**/psdle.includes.js'],
                    rename: function(dest, src) {
                        return src.split("/").slice(0,-1).join("/") + "/psdle.min.js"
                    }
                }]
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
                files: {
                    '_src/base/gotham/psdle.gotham.user.js': ['_src/psdle.user.txt', '_src/base/gotham/psdle.includes.js'],
                    '_src/base/valkyrie/psdle.valkyrie.user.js': ['_src/psdle.user.txt', '_src/base/valkyrie/psdle.includes.js']
                }
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
                files: [{
                    expand: true,
                    src: '_src/base/**/psdle.includes.js'
                }],
                options: {
                    replacements: [{
                        pattern: /(version\s*:\s*").*?(")/ig,
                        replacement: '$1<%= pkg.version %>$2'
                    },{
                        pattern: /(versiondate\s*:\s*").*?(")/ig,
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
                        pattern: /("version":\s*").*?(")/ig,
                        replacement: '$1<%= pkg.version %>$2'
                    },{
                        pattern: /(\/\/ @version(\s*)).*/ig,
                        replacement: '$1<%= pkg.version %>'
                    }]
                }
            },
            // Terrifying.
            userscriptGotham: {
                files: { '_src/base/gotham/psdle.gotham.user.js': '_src/base/gotham/psdle.gotham.user.js' },
                options: {
                    replacements: [{
                        pattern: /\{variant\}/ig,
                        replacement: 'gotham'
                    }]
                }
            },
            userscriptValkyrie: {
                files: { '_src/base/valkyrie/psdle.valkyrie.user.js': '_src/base/valkyrie/psdle.valkyrie.user.js' },
                options: {
                    replacements: [{
                        pattern: /\{variant\}/ig,
                        replacement: 'valkyrie'
                    }]
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    src: ['_src/base/**/css/*.css', '!_src/base/**/css/*.min.css'],
                    ext: '.min.css'
                }]
            }
        },
        'concat-json': {
            gotham: {
                cwd: '_src/base/gotham/lang/all',
                src: [ '*.json' ],
                dest: '_src/base/gotham/lang/lang.min.json'
            },
            valkyrie: {
                cwd: '_src/base/valkyrie/lang/all',
                src: [ '*.json' ],
                dest: '_src/base/valkyrie/lang/lang.min.json'
            },
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

    grunt.registerTask('minlang', 'Concat and minify language files. Never automate, shouldn\'t need often.', ['concat-json']);
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
            'string-replace:userscriptGotham', //Userscript smartness
            'string-replace:userscriptValkyrie', //And again. Filenames hard.
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