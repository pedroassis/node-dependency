

function Container(container, dependencies, FileUtils, require, projectRoot){

    var LOOKUP = {};

    LOOKUP['object']    = addJSON;
    LOOKUP['function']  = addClass;
    LOOKUP['anonymous'] = addFunction;

    var files = FileUtils.getAllJS();

    container.constant('rootFolder', projectRoot);

    dependencies.forEach(function(dependency){

        var Class = require(dependency.require);

        var type = typeof(Class) === 'function' ? 'factory' : 'service'

        container[type](dependency.name, function(){
            return Class;
        });
    });

    files.sort(function(a, b){
        a.length > b.length;
    }).forEach(function(file){

        var Class = require(file);

        var type = typeof(Class) === 'object' ? 'object' : Class.name ? 'function' : 'anonymous';

        LOOKUP[type](Class, file);
    });

    container.run(function(ProjectBootstrap){
    });

    function addClass(Class){
        container.service(Class.name, Class);
    }

    function addFunction(funktion){
        if(!funktion.className){
            var functionText = funktion.toString ? funktion.toString() : funktion;
            throw new Error("Anonymous function without a className property, you should define a className to register your function.\n" + functionText);
        }
        container.factory(funktion.className, funktion);
    }

    function addJSON(jsonObject, fileName){
        var name = FileUtils.getFileName(fileName);
        container.factory(name, function(){
            return jsonObject;
        });
    }
}

module.exports = Container;