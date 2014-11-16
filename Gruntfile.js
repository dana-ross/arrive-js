module.exports = function (grunt) {

	grunt.initConfig({

		jshint: {
			files  : 'src/*.js',
			options: {
				// options here to override JSHint defaults
				globals: {
					jQuery  : true,
					console : true,
					module  : true,
					document: true
				}
			}
		},

		jasmine: {
			components: {
				src    : [
					'src/*js'
				],
				options: {
					specs     : 'tests/spec/*Spec.js',
					template: "_SpecRunner.html",
					keepRunner: true
					//helpers: 'test/spec/*.js'
				}
			}
		},

		jsdoc: {
			dist: {
				src    : ['src/*.js'],
				options: {
					destination: 'doc'
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.registerTask('travis', ['jshint', 'jasmine']);
	grunt.registerTask('docs', ['jsdoc']);
	grunt.registerTask('default', ['jshint', 'jasmine', 'jsdoc']);

};