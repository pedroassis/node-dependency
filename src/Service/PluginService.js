
var path = require('path');

function PluginService(rootFolder) {

    var PACKAGE = '/package';
    var NODE_MODULES = './node_modules';
    
    /**
     *  Should filter out all dependencies that aren't a node-dependency plugin
     *  Returning all plugins in a new array.
     */
    this.filter = function(dependencies) {
        return dependencies.filter(function(dependency) {
            var packageJSON = require(dependency.require + PACKAGE);
            return packageJSON['node-dependency'] && packageJSON['node-dependency'].isPlugin;
        });
    };
    
    /**
     *  Returns true if there's at least one plugin which bootstraps the project
     */
    this.hasBootstrapper = function(dependencies) {
        return dependencies.some(function(dependency) {
            var packageJSON = require(dependency.require + PACKAGE);
            return packageJSON['node-dependency'] && packageJSON['node-dependency'].bootstraps;
        });
    };

    /**
     *  Get the plugin source folder
     */
    this.getFolder = function(dependency) {
        var ndi = require(dependency.require + PACKAGE)['node-dependency'];
        return path.join(NODE_MODULES, dependency.require, ndi.source);
    };

    this.getAll = function(dependencies, FileUtils) {
        var plugins = [];
        this.filter(dependencies).forEach(function(dependency) {
            var pluginFiles = FileUtils.getAllJS(this.getFolder(dependency));
            plugins.push.apply(plugins, pluginFiles);
        }.bind(this));
        return plugins.map(function(file) {
            return path.join(rootFolder, file);
        });
    };


}

module.exports = PluginService;