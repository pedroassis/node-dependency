
var BeforeLoadContainer = 'BeforeLoadContainer';

var InjectAnnotatedWith = 'InjectAnnotatedWith';

function ContainerConfiguration (AnnotationService) {
    
    this.configure = function configure (container) {
        AnnotationService.getInstances(BeforeLoadContainer, function(instances) {
            instances.forEach(function(instance) {
                runConfigMethods(instance);
            });
        });
    }

    function runConfigMethods (instance) {
        var methods = AnnotationService.getAnnotatedMethods(instance, InjectAnnotatedWith);
        var callNumber = 0;
        methods.forEach(function(method) {
            getTargetAnnotation(method);
        });
    }

    function getTargetAnnotation (method) {
        var injectAnnotatedWith;
        for (var i = method.annotations.length - 1; i >= 0; i--) {
            injectAnnotatedWith = method.annotations[i].name === InjectAnnotatedWith ? method.annotations[i] : injectAnnotatedWith;
        }
        var instances = [];
        var annotations = injectAnnotatedWith.value;
        var callNumber = 0;
        for (var i = annotations.length - 1; i >= 0; i--) {
            AnnotationService.getInstances(annotations[i].name, function(received) {
                instances.push.apply(instances, received);
                callNumber = callNumber + 1;
                if(callNumber >= annotations.length){
                    method(instances);
                }
            })
        }
    }

}

module.exports = ContainerConfiguration;