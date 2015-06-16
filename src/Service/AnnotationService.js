
var congaAnnotations = require('conga-annotations');

var Annotation = congaAnnotations.Annotation;

var annotate = require("ng-di/lib/injector.js").annotate; // work around #11 of ng-di

var Hashmap = require('hashmap');


function AnnotationService () {

    var annotations = [];
    var annotatedClasses = {};

    var instancesOfAnnotatedClasses = new Hashmap();

    var classesReaders = new Hashmap();
    
    this.isAnnotation = function isAnnotation (klass) {
        return klass.prototype instanceof Annotation;
    }

    this.addAnnotation = function addAnnotation (annotation) {
        annotations.push(annotation);
    }

    /**
     * Annotates the parameters names on $inject property of the klass
     * Same as AngularJS $inject
     * @param {Function} klass
     * @returns {Function}
     */ 
    this.decorate = function decorate (klass) {
        var reader = new annotations.Reader(registry);
        reader.parse(klass);
        var constructorAnnotations = reader.getConstructorAnnotations();
        for (var i = constructorAnnotations.length - 1; i >= 0; i--) {
            var name = constructorAnnotations[i].annotation;
            annotatedClasses[name] = annotatedClasses[name] || [];
            annotatedClasses[name].push(klass);
            classesReaders.set(klass, reader);
        };

        /**
         * Decorating your class
         */
        function newClass () {
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
     * Same signature as Registry.getAnnotations from conga
     */
    this.getAnnotations = function getAnnotations(){
        return annotations;
    };

    /**
     * Same signature as Registry.getAnnotationConstructor from conga
     */
    this.getAnnotationConstructor = function getAnnotationConstructor(name){
        return annotations[name];
    }; 

    /**
     * Returns all classes annotated by that annotationName
     * 
     * @param {String} annotationName
     * @returns {Array<Function>}
     */ 
    this.getClasses = function getClasses(annotationName){
        return annotatedClasses[annotationName];
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
        var allAnnotations = classesReaders.has(type) ? classesReaders.get(type).getMethodAnnotations() : [];

        var annotations = allAnnotations.filter(function(methodAnnotation) {
            return methodAnnotation.annotation === annotation.annotation;
        });

        return annotations.map(function(annotation) {
            var method = instance[annotation.target].bind(instance);
            method.annotation = annotation;
            return method;
        });
    };

}

module.exports = AnnotationService;
