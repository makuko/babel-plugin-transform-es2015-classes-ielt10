const fs = require('fs');

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        babel: {
            build: {
                files: {
                    'index.js': 'index.ts',
                    'set-prototype-of.js': 'set-prototype-of.ts'
                }
            }
        }
    });
    
    grunt.registerTask('postprocess', postprocess);
    grunt.registerTask('default', ['babel', 'postprocess']);


    //////////


    function postprocess() {
        fs.writeFileSync(
            'index.js',
            fs.readFileSync('index.js') + '\nmodule.exports = exports.default;\n'
        );

        fs.writeFileSync(
            'set-prototype-of.js',
            fs.readFileSync('set-prototype-of.js').toString().replace(
                'exports.__esModule = true;',
                'Object.defineProperty(exports, "__esModule", {\n    value: true\n});'
            )
        );
    }
};