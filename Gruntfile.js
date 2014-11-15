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
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.registerTask('travis', ['jshint']);

};