
module.exports = function(projectRoot, projectSources) {

    var DependencyHelper    = require('./src/Service/DependencyHelper');

    var FileUtils           = require('./src/Service/FileUtils');

    var Container           = require("./src/Container/Container.js");

    var ngDI                = require("ng-di");

    var dependencies        = new DependencyHelper(projectRoot, require).getDependencies();

    var container           = ngDI.module("Application", []);

    var fs                  = require('fs');

    var fileUtils = new FileUtils(projectRoot + projectSources, fs);

    new Container(container, dependencies, fileUtils, require, projectRoot);

    ngDI.injector(['Application']);

};