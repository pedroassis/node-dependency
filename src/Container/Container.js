

function Container(container, dependencies, FileUtils, require, projectRoot, annotate){

    var LOOKUP = {};

    LOOKUP['object']    = addJSON;
    LOOKUP['function']  = addClass;
    LOOKUP['anonymous'] = addFunction;

    var files = FileUtils.getAllJS();

    var locals = ['rootFolder'];

    container.constant('rootFolder', projectRoot);

    dependencies.forEach(function(dependency){

        var Class;

        try{
            Class = require(dependency.require);
        } catch(error){
            console.log('You have declared "' + dependency.require + '", with name "' + dependency.name + '"');
            console.log("And we couldn't find with require. Are you sure?");
            console.log(error.message);
        }

        var type = typeof(Class) === 'function' ? 'factory' : 'service';

        locals.push(dependency.name);

        container[type](dependency.name, function(){
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
        annotate(klass);
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
    });

    container.run(function(ProjectBootstrap){
    });

    function addClass(Class){
        container.service(Class.name, Class);
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