
var ActivatorClass              = require('../Service/Activator');
var AnnotationServiceClass      = require('../Service/AnnotationService');
var ContainerConfigurationClass = require('./ContainerConfiguration');

var AnnotationService           = new AnnotationServiceClass();

function Container(container, dependencies, FileUtils, require, projectRoot, variableRegex, StringUtils, runner){

    var LOOKUP = {};

    LOOKUP['object']    = addJSON;
    LOOKUP['function']  = addClass;
    LOOKUP['anonymous'] = addFunction;

    var files = FileUtils.getAllJS();

    var locals = ['rootFolder'];

    var hasError;

    container.constant('rootFolder', projectRoot);

    var AnnotationService = new AnnotationServiceClass(runner.run.bind(runner));

    var ContainerConfiguration = new ContainerConfigurationClass(AnnotationService);

    container.service('AnnotationService', function() {
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

    var classes = files.sort(function(a, b){
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

    if(locals.indexOf('ProjectBootstrap') === -1){
        console.log("We couldn't find a ProjectBootstrap class inside your source folder.");
        console.log("Please create your ProjectBootstrap as described on https://github.com/pedroassis/node-dependency/");
        return;
    }

    if(hasError){
        console.log()
        console.log("Please fix the errors to continue.");
        return;
    }

    ContainerConfiguration.configure(container);

    container.run(function(ProjectBootstrap){
    });

    function addClass(Class, filename){
        var decoratedClass = AnnotationService.decorate(Class, FileUtils.readSync(filename));
        container.service(Class.name, decoratedClass);
        return Class;
    }

    function addFunction(funktion){
        if(!funktion.className){
            var functionText = funktion.toString ? funktion.toString() : funktion;
            throw new Error("Anonymous function without a className property, you should define a className to register your function.\n" + functionText);
        }
        container.factory(funktion.className, funktion);
        return funktion;
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