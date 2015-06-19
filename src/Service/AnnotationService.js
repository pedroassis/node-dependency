
var getMetadata = require('js-annotation-reader').getMetadata;

require("ng-di"); // work around #11 of ng-di

var annotate = require("ng-di/lib/injector.js").annotate; // work around #11 of ng-di

var Hashmap = require('hashmap');


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
        var classMetadata = getMetadata(file);

        var constructorAnnotations = classMetadata.annotations;
        for (var i = constructorAnnotations.length - 1; i >= 0; i--) {
            var name = constructorAnnotations[i].name;
            annotatedClasses[name] = annotatedClasses[name] || [];
            annotatedClasses[name].push(klass);
            classesReaders.set(klass, classMetadata);
        };

        /**
         * Decorating your class
         */
        // var newClass = function() {
        //     var newThis = klass.apply(this, arguments);
        //     var instances = instancesOfAnnotatedClasses.has(klass) ? instancesOfAnnotatedClasses.get(klass) : [];
        //     instances.push(this);
        //     instancesOfAnnotatedClasses.set(klass, instances);
        //     this.prototype = newThis.prototype;
        // }

        annotate(klass);

        // newClass.$inject = klass.$inject;

        // newClass.name = klass.name;

        return klass;
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
            return klass.name;
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
        var methodsMetadata = classesReaders.has(type) ? classesReaders.get(type).methods : [];

        var methods = methodsMetadata.filter(function(methodMetadata) {
            return methodMetadata.annotations.some(function(methodAnnotation) {
                return methodAnnotation.name === annotation;
            });
        });

        return methods.map(function(method) {
            var method = instance[method.name].bind(instance);
            method.annotations = method.annotations;
            return method;
        });
    };

}

module.exports = AnnotationService;
