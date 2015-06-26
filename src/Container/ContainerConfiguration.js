
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
        var injectAnnotatedWith = method.annotations.InjectAnnotatedWith || {};
        var instances = [];
        var annotations = injectAnnotatedWith.value;
        var callNumber = 0;
        var size = annotations ? annotations.length - 1 : 0;
        for (var i = size; i >= 0; i--) {
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