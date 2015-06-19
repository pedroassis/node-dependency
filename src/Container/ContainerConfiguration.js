
var BeforeLoadContainer = 'BeforeLoadContainer';

var InjectAnnotated = 'InjectAnnotated';

function ContainerConfiguration (AnnotationService) {
    
    this.configure = function configure (container) {
        var instances = AnnotationService.getInstances(BeforeLoadContainer);
        instances.forEach(runConfigMethods);
    }

    function runConfigMethods (instance) {
        var methods = AnnotationService.getAnnotatedMethods(instance, InjectAnnotated);
        methods.forEach(getTargetAnnotation);
    }

    function getTargetAnnotation (method) {
        var targetAnnotation = method.annotation;
        var instances = AnnotationService.getInstances(targetAnnotation);
        method(instances);
    }

}

module.exports = ContainerConfiguration;