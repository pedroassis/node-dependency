"use strict";

var getMetadata = require('js-annotation-reader').getMetadata;

require("ng-di"); // work around #11 of ng-di

var annotate = require("ng-di/lib/injector.js").annotate; // work around #11 of ng-di

var Hashmap = require('hashmap');

var ArrayUtilsClass = require('./ArrayUtils.js');

var ArrayUtils = new ArrayUtilsClass();


function AnnotationService(configurate) {

    var annotations = [];
    var annotatedClasses = {};

    var instancesOfAnnotatedClasses = new Hashmap();

    var classesReaders = new Hashmap();

    /**
     * Annotates the parameters names on $inject property of the klass
     * Same as AngularJS $inject
     * @param {Function} klass Class to be decorated
     * @param {String} file File source of the Class
     * @returns {Function}
     */ 
    this.decorate = function decorate (klass, file) {
        var classMetadata = readMetadata(klass, file);

        var constructorAnnotations = classMetadata.annotations;
        classesReaders.set(klass.prototype, classMetadata);
        for (var i = constructorAnnotations.length - 1; i >= 0; i--) {
            var name = constructorAnnotations[i].name;
            annotatedClasses[name] = annotatedClasses[name] || [];
            annotatedClasses[name].push(klass);
        }

        /**
         * Decorating the class, making it look as close as we can
         * As we still don't have control over the instantiation, we 
         * need to intercept the new instance
         * TODO - Remove angular module
         */
        var newClass = function() {
            var returned = klass.apply(this, arguments);
            var instances = instancesOfAnnotatedClasses.has(klass) ? instancesOfAnnotatedClasses.get(klass) : [];
            var instance = returned || this;
            instances.push(instance);
            instancesOfAnnotatedClasses.set(klass, instances);

            for (var i = classMetadata.methods.length - 1; i >= 0; i--) {
                var method = classMetadata.methods[i];
                method.annotations = ArrayUtils.toMap(method.annotations, "name");
                instance[method.name].annotations = method.annotations;  
                instance[method.name].$inject     = method.parameters;
            }
            return instance;
        }

        populateMetadata(klass, classMetadata);
        populateMetadata(newClass, classMetadata);

        newClass.prototype = klass.prototype;

        return newClass;
    }

    function populateMetadata (klass, metadata) {        
        klass.annotations = ArrayUtils.toMap(metadata.annotations, "name");
        klass.imports     = metadata.imports;
        klass.packaged    = metadata.packaged;
        klass.methods     = metadata.methods;
        klass.$inject     = metadata.parameters;
    }

    function readMetadata (klass, file) {
        if(klass.annotations){
            return klass;
        }
        try{
            return getMetadata(file);
        } catch(e){
            var name = klass.name || klass.className;
            console.error('Error while reading annotations from class ' + name);
            throw e;
        }
    }

    /**
     * Returns all classes annotated by that annotationName
     * 
     * @param {String} annotationName
     * @returns {Array<Function>}
     */ 
    this.getClasses = function getClasses(annotationName){
        return annotatedClasses[annotationName] || [];
    }; 

    /**
     * Returns all the instances from this Container annotated by that annotationName
     * 
     * @param {String} annotationName
     * @returns {Array<Object>}
     */ 
    this.getInstances = function getInstances(annotationName, callback){

        var classes = this.getClasses(annotationName);

        var toInject = function() {
            callback(Array.prototype.slice.call(arguments));
        };
        
        toInject.$inject = classes.map(function(klass) {
            var packaged = klass.packaged ? (klass.packaged + '.') : '';
            return packaged + klass.name;
        });

        configurate(toInject);
    };

    /**
     * Returns all the methods from the provided object which are annotated by the provided annotation
     * 
     * @param {Object} instance
     * @param {Object} annotation
     * @returns {Array<Function>}
     */ 
    this.getAnnotatedMethods = function getAnnotatedMethods(instance, annotation){
        var type = instance.constructor;
        var methodsMetadata = type.methods || {};

        var methods = methodsMetadata.filter(function(methodMetadata) {
            return methodMetadata.annotations[annotation];
        });

        return methods.map(function(method) {
            var bindedMethod = instance[method.name].bind(instance);
            bindedMethod.annotations = method.annotations;
            return bindedMethod;
        });
    };

}

module.exports = AnnotationService;
