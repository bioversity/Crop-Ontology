module.exports = function(grunt) {
	require("load-grunt-tasks")(grunt, {
	    pattern: "grunt-contrib-*",
	    config: "package.json",
	    scope: "devDependencies",
	    requireResolution: true
	});

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		sass: {
			dist: {
				files: {
					"dist/css/main.min.css": "src/scss/main.scss"
				},
				options: {
					// banner: "/*\n * <%= pkg.name %>\n *\n * @version\tv<%= pkg.version %>\n * @date\t<%= grunt.template.today("yyyy-mm-dd") %>\n * @author\t<%= pkg.author %>\n */\n",
					compass: true,
					noCache: true,
					sourcemap: "none",
					style: "compressed"
				},
			}
		},
		browserify: {
			dist: {
				options: {
					transform: [
						["babelify", {
							// loose: "all"
						}]
					]
				},
				files: {
					// if the source file has an extension of es6 then
					// we change the name of the source file accordingly.
					// The result file's extension is always .js
					"dist/js/main.js": ["dist/js/main-compiled.js"]
				}
			}
		},
		babel: {
			options: {
				"sourceMap": false,
				"presets": ["babel-preset-es2015"]
			},
			dist: {
				files: [{
					"expand": true,
					"cwd": "src/js",
					"src": ["**/*.es6"],
					"dest": "dist/js/",
					"ext": "-compiled.js"
				}]
			}
		},
		uglify: {
			// options: {
			//     banner: "/**\n * <%= pkg.name %>\n *\ * @version\tv<%= pkg.version %>\n * @date\t<%= grunt.template.today("yyyy-mm-dd") %>\n * @author\t<%= pkg.author %>\n */\n"
			// },
			minimize: {
				beautify: {
					width: 80,
					beautify: true
				},
				compress: true,
				drop_console: true,
				expand: true,
				files: {
					"dist/js/main.min.js": ["dist/js/main.js"]
				},
				mangle: true,
				sourceMap: false
			}
		},
		watch: {
			es6: {
				files: "src/js/*.es6",
				tasks: ["babel", "browserify", "uglify"]
			},
			sass: {
				files: "src/scss/*.scss",
				tasks: ["sass"]
			}
		}
	});

	// Load plugins
	grunt.loadNpmTasks("grunt-babel");
	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("load-grunt-tasks");
	// Register tasks
	// grunt.registerTask("default", ["sass", "es6"]);
	grunt.registerTask("default", ["sass", "browserify"]);
	// grunt.registerTask("dev", ["watch"]);
};
