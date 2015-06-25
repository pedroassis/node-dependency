var rootFolder = __dirname;
var path = require('path');

function PluginService() {

    var PACKAGE = '/package';
    var NODE_MODULES = './node_modules';
    
    /**
     *  Should filter out all dependencies that aren't a NDI plugin
     *  Returning all plugins in a new array.
     */
    this.filter = function(dependencies) {
        return dependencies.filter(function(dependency) {
            return require(dependency.require + PACKAGE).ndi;
        });
    };

    /**
     *  Get the plugin source folder
     */
    this.getFolder = function(dependency) {
        var ndi = require(dependency.require + PACKAGE).ndi;
        return path.join(NODE_MODULES, dependency.require, ndi.source);
    };


}

module.exports = PluginService;