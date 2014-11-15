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
					keepRunner: true,
					//helpers: 'test/spec/*.js'
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.registerTask('travis', ['jshint', 'jasmine']);

};