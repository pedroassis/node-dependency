
module.exports = function(projectRoot, projectSources) {

    var DependencyHelper    = require('./src/Service/DependencyHelper');

    var FileUtils           = require('./src/Service/FileUtils');

    var Container           = require("./src/Container/Container.js");

    var ngDI                = require("ng-di");

    var annotate            = require("ng-di/lib/injector.js").annotate; // work around #11 of ng-di

    var dependencies        = new DependencyHelper(projectRoot, require).getDependencies();

    var container           = ngDI.module("Application", []);

    var fs                  = require('fs');

    var variableRegex       = require('./src/VariableNameRegex');

    var fileUtils           = new FileUtils(projectRoot + projectSources, fs);

    var StringUtils         = require('./src/Service/StringUtils');

    new Container(container, dependencies, fileUtils, require, projectRoot, annotate, variableRegex, StringUtils);

    ngDI.injector(['Application']);

};