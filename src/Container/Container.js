
var AnnotationServiceClass      = require('../Service/AnnotationService.js');
var ContainerConfigurationClass = require('./ContainerConfiguration.js');


function Container(container, dependencies, FileUtils, require, projectRoot, variableRegex, StringUtils, runner, PluginService, packageJson){

    var LOOKUP = {};

    LOOKUP['object']    = addJSON;
    LOOKUP['function']  = addClass;
    LOOKUP['anonymous'] = addFunction;

    var files = FileUtils.getAllJS();

    var locals = ['rootFolder'];

    var hasError;

    container.constant('rootFolder', projectRoot);
    
    container.service('nd.FunctionRunner', function() {
        return runner;
    });
    
    container.service('nd.NodeDependencyConfig', function() {
        return packageJson['node-dependency'];
    });
    
    container.service('nd.Container', function() {
        return container;
    });

    var AnnotationService = new AnnotationServiceClass(runner.run.bind(runner));

    var ContainerConfiguration = new ContainerConfigurationClass(AnnotationService, FileUtils, runner);

    container.service('nd.AnnotationService', function() {
        return AnnotationService;
    });

    dependencies.forEach(function(dependency){

        var Class;

        var name = variableRegex.test(dependency.name) ? dependency.name : StringUtils.removeDashes(dependency.name);

        if(!variableRegex.test(name)){
            console.log();
            console.log("You have '" + dependency.name + "' on your package.json or in your Dependency.json. And we can't declare a variable with this name.");
            console.log();
            console.log("You'll need to use our Dependency.json file to create an alias for this dependency. Sorry.");
            console.log("You can see how it works on https://github.com/pedroassis/node-dependency/");
            console.log();
        }

        try{
            Class = require(dependency.require);
        } catch(error){
            console.log('You have declared "' + dependency.require + '", with name "' + name + '"');
            console.log("And we couldn't find with require. Did you run 'npm install'?");
            console.log(error.message);
            hasError = true;
        }

        var type = typeof(Class) === 'function' ? 'factory' : 'service';

        locals.push(name);

        container[type](name, function(){
            return Class;
        });
    });

    var plugins = PluginService.getAll(dependencies, FileUtils);

    var allFiles = files.concat(plugins);

    var classes = allFiles.sort(function(a, b){
        a.length > b.length;
    }).map(function(file){

        var Class = require(file);

        var type = typeof(Class) === 'object' ? 'object' : Class.name ? 'function' : 'anonymous';

        var dependency = LOOKUP[type](Class, file);

        return dependency;
    });

    classes.filter(function(klass) {
        locals.push(klass.name || klass.className);
        return typeof(klass) === 'function';
    }).map(function(klass) {

        var invalidDeps = klass.$inject.filter(function(inject) {
            return locals.indexOf(inject) === -1;
        });

        return {
            klass : klass,
            invalidDeps : invalidDeps
        };
    }).filter(function(klass){
        return klass.invalidDeps.length;
    }).forEach(function(klass){
        var name = klass.klass.name || klass.klass.className;
        console.log();
        console.log("Could not declare " + name + " because of missing dependencies.");
        console.log("Missing dependencies: " + klass.invalidDeps.join(', '));
        console.log("---------------------------------------------------------------");
        hasError = true;
    });

    var bootstrapped = PluginService.hasBootstrapper(dependencies);

    if(locals.indexOf('ProjectBootstrap') === -1 && !bootstrapped){
        console.log("We couldn't find a ProjectBootstrap class inside your source folder.");
        console.log("Please create your ProjectBootstrap as described on https://github.com/pedroassis/node-dependency/");
        throw new Error("We couldn't find a ProjectBootstrap class inside your source folder.");
    }

    if(hasError){
        console.log()
        console.log("Please fix the errors to continue.");
        return;
    }

    ContainerConfiguration.configure(container);

    if(locals.indexOf('ProjectBootstrap') !== -1){
        container.run(function(ProjectBootstrap){
        });
    }

    function addClass(Class, filename){
        var name = Class.name;
        var decoratedClass = AnnotationService.decorate(Class, FileUtils.readSync(filename));
        var isPlugin = plugins.indexOf(filename) !== -1;
        // Only use top level name for user defined classes
        if(!isPlugin && !decoratedClass.packaged){
            container.service(name, decoratedClass);
        }
        if(decoratedClass.packaged){
            name = decoratedClass.packaged + '.' + name;
            container.service(name, decoratedClass);
        } else if (isPlugin){
            throw new Error("Package not provided a in plugin file: " + filename);
        }
        return {
            name : name
        };
    }

    function addFunction(funktion, fileName){
        var name = FileUtils.getFileName(fileName);
        funktion.className = funktion.className || name;
        container.factory(funktion.className, funktion);
        return {
            name : funktion.className
        };
    }

    function addJSON(jsonObject, fileName){
        var name = FileUtils.getFileName(fileName);
        container.factory(name, function(){
            return jsonObject;
        });
        return {
            name : name
        };
    }
}

module.exports = Container;