
var getMetadata = require('js-annotation-reader').getMetadata;

var annotate = require("ng-di/lib/injector.js").annotate; // work around #11 of ng-di

var Hashmap = require('hashmap');


function AnnotationService () {

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
        var newClass = function() {
            var newThis = klass.apply(this, arguments);
            var instances = instancesOfAnnotatedClasses.has(klass) ? instancesOfAnnotatedClasses.get(klass) : [];
            instances.push(this);
            instancesOfAnnotatedClasses.set(klass, instances);
            this.prototype = newThis.prototype;
        }

        annotate(klass);

        newClass.$inject = klass.$inject;

        newClass.name = klass.name;

        return constructorAnnotations.length ? newClass : klass;
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
    this.getInstances = function getInstances(annotationName){
        var instances = [];
        var classes = this.getClasses(annotationName);
        for (var i = classes.length - 1; i >= 0; i--) {
            instances.push.apply(instancesOfAnnotatedClasses.get(classes[i]));
        };
        return instances;
    };

    /**
     * Returns all the methods from the provided object which are annotated by the provided annotation
     * 
     * @param {Object} instance
     * @param {Object} annotation
     * @returns {Array<Function>}
     */ 
    this.getAnnotatedMethods = function getAnnotatedMethods(instance, annotation){
        var type = instance.prototype;
        var methodsMetadata = classesReaders.has(type) ? classesReaders.get(type).methods : [];

        var annotations = methodsMetadata.filter(function(methodMetadata) {
            return methodMetadata.name === annotation;
        });

        return annotations.map(function(annotation) {
            var method = instance[annotation.target].bind(instance);
            method.annotation = annotation;
            return method;
        });
    };

}

module.exports = AnnotationService;
