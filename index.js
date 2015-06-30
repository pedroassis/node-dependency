
module.exports = function(projectRoot) {

    var DependencyHelper    = require('./src/Service/DependencyHelper');

    var FileUtils           = require('./src/Service/FileUtils');

    var Container           = require("./src/Container/Container.js");

    var ngDI                = require("ng-di");

    var dependencies        = new DependencyHelper(projectRoot, require).getDependencies();

    var container           = ngDI.module("Application", []);

    var fs                  = require('fs');

    var path                = require('path');

    var variableRegex       = require('./src/VariableNameRegex');

    var packageJson         = require(projectRoot + "/package.json");

    var projectSources      = packageJson['node-dependency'] && packageJson['node-dependency'].source ? packageJson['node-dependency'].source : '/src';

    var fileUtils           = new FileUtils(path.join(projectRoot, projectSources), fs);

    var StringUtils         = require('./src/Service/StringUtils');

    var FunctionRunner      = require('./src/Service/FunctionRunner');

    var runner              = new FunctionRunner(container);
    
    var PluginServiceClass  = require('./src/Service/PluginService.js');

    var PluginService       = new PluginServiceClass(projectRoot);

    new Container(container, dependencies, fileUtils, require, projectRoot, variableRegex, StringUtils, runner, PluginService, packageJson);

    runner.shouldCache = true;

    runner.setInjector(ngDI.injector(['Application']));

    return container;

};


