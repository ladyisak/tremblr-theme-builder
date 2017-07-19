// Gruntfile

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Configure watched files and tasks to fire
        watch: {
            // Watch for changes to the grunt configuration
            config: {
                files: ['Gruntfile.js']
            },

            // Check for changes in any files and run compile
            views: {
                files: ['src/views/**/*.pug'],
                tasks: ['views']
            },
            scripts: {
                files: ['src/scripts/**/*.js'],
                tasks: ['scripts']
            },
            styles: {
                files: ['src/styles/**/*.scss'],
                tasks: ['styles']
            }
        },
        
        // Compile pug to html
        pug: {
            views: {
                src: 'src/views/theme.pug',
                dest: '.grunt/temp.html'
            }
        },

        // Concatenates and minifies the Javascript
        uglify: {
            scripts: {
                files: {
                    '.grunt/theme.min.js': ['src/scripts/**/*.js']
                }
            }
        },

        // Compile sass to css
        sass: {
            options: {
                quiet: false,
                outputStyle: 'compressed'
            },
            styles: {
                files: {
                    '.grunt/theme.css': 'src/styles/theme.scss'
                }
            }
        },

        // Create the distibutable copies
        copy: {
            compiled: {
                src: '.grunt/temp.html',
                dest: '.grunt/theme.html'
            }
        },

        // Insert all the JS and CSS into the single html file
        insert: {
            scripts: {
                src: '.grunt/theme.min.js',
                dest: '.grunt/theme.html',
                match: '<!-- !import scripts-->'
            },
            styles: {
                src: '.grunt/theme.css',
                dest: '.grunt/theme.html',
                match: '<!-- !import styles-->'
            }
        },

        // Replace all the tags
        // sample replaces comment tags with sample content
        // tumblr removes the comment wrapping from tags
        // This is the last operation, so it puts the file in the final location
        replace: {
            sample: {
                options: {
                    usePrefix: false,
                    patterns: [
                        {
                            match: '<!-- {CustomCSS}-->',
                            replacement: ''
                        },
                        {
                            match: '{Title}',
                            replacement: (function () {
                                // Create an anonymous function with closured values

                                var i = 0;
                                var strings = ['Blog Title', 'Blog Title', 'This is a text post', 'This is a chat post'];

                                return function () {
                                    return strings[i++];
                                };
                            })()
                        },
                        {
                            match: '{Description}',
                            replacement: 'This is a sample blog'
                        },
                        {
                            match: '{Favicon}',
                            replacement: 'https://assets.tumblr.com/images/default_avatar/cube_closed_128.png'
                        },
                        {
                            match: '{Body}',
                            replacement: 'Lorem ipsum, dolor sit amet'
                        },
                        {
                            match: '{Caption}',
                            replacement: 'This image has this caption'
                        },
                        {
                            match: '{PhotoURL-500}',
                            replacement: 'https://68.media.tumblr.com/71faf3456411d636c82f8b0b51b87f6e/tumblr_ot4msyMgBA1wum1vko1_500.jpg'
                        },
                        {
                            match: '{PhotoURL-Panorama}',
                            replacement: 'https://68.media.tumblr.com/27417bb967101c7a1a06eb3834a220d5/tumblr_ot4mwisRYW1wum1vko1_500.jpg'
                        },
                        {
                            match: '{Photoset}',
                            replacement: '<div id="photoset_163011928188" class="html_photoset"><iframe id="photoset_iframe_163011928188" name="photoset_iframe_163011928188" class="photoset" scrolling="no" frameborder="0" height="511" width="100%" style="border:0px; background-color:transparent; overflow:hidden;" src="https://www.tumblr.com/post/163011928188/photoset_iframe/tremblrtheme/tumblr_ot4mv2tChL1wum1vk/0/false"></iframe></div>'
                        },
                        {
                            match: '{Quote}',
                            replacement: 'It does not matter how slow you go so long as you do not stop.'
                        },
                        {
                            match: '{Source}',
                            replacement: 'Confucious'
                        },
                        {
                            match: '{Name}',
                            replacement: 'Link post'
                        }
                    ]
                },
                src: '.grunt/theme.html',
                dest: 'dist/sample.html'
            },
            tumblr: {
                options: {
                    usePrefix: false,
                    patterns: [
                        {
                            match: '<!-- ',
                            replacement: ''
                        },
                        {
                            match: '-->',
                            replacement: ''
                        }
                    ]
                },
                src: '.grunt/theme.html',
                dest: 'dist/theme.html'
            }
        }
    });

    grunt.registerTask('default', ['watch']);

    grunt.registerTask('views', ['pug', 'prepare-sample']);
    grunt.registerTask('scripts', ['uglify', 'prepare-sample']);
    grunt.registerTask('styles', ['sass', 'prepare-sample']);

    grunt.registerTask('prepare-sample', ['copy', 'insert', 'replace:sample']);
    grunt.registerTask('prepare-tumblr', ['copy', 'insert', 'replace:tumblr']);
    
    // Compile to create a locally viewable version
    // Tumblr to create a a tumblr-ready version
    grunt.registerTask('compile', ['pug', 'uglify', 'sass', 'prepare-sample']);
    grunt.registerTask('tumblr', ['pug', 'uglify', 'sass', 'prepare-tumblr']);
};