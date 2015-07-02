
var InjectAnnotatedWith = 'InjectAnnotatedWith';

var Configurations = require('./Configuration');

function ContainerConfiguration (AnnotationService, FileUtils, runner) {
    
    this.configure = function configure (app) {
        app.config(
            function( $provide ) {

                // Let's keep the older references.
                app._service = app.service;
                app._factory = app.factory;
                app._value = app.value;
                app._run = app.run;

                // Provider-based service.
                app.service = function( name, constructor ) {
                    $provide.service( name, constructor );
                    return( this );
                };
                // Provider-based value.
                app.run = runner.run.bind(runner);
            }
        );
        Configurations(FileUtils, app, AnnotationService, runConfigMethods);
    }

    function runConfigMethods (instance) {
        var methods = AnnotationService.getAnnotatedMethods(instance, InjectAnnotatedWith);
        methods.forEach(function(method) {
            getTargetAnnotation(method);
        });
    }

    function getTargetAnnotation (method) {
        var injectAnnotatedWith = method.annotations.InjectAnnotatedWith || {};
        var instances = [];
        var annotations = injectAnnotatedWith.value;
        var callNumber = 0;
        var size = annotations ? annotations.length - 1 : 0;
        for (var i = size; i >= 0; i--) {
            AnnotationService.getInstances(annotations[i].name, function(received) {
                instances.unshift(received);
                callNumber = callNumber + 1;
                if(callNumber >= annotations.length){
                    method.apply(null, instances);
                }
            })
        }
        if(size === -1){
            method();
        }
    }

}

module.exports = ContainerConfiguration;