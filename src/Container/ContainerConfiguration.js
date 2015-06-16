
var BeforeLoadContainer = require('../Annotation/BeforeLoadContainerAnnotation');

var InjectAnnotated = require('../Annotation/InjectAnnotated');

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
        var targetAnnotation = method.annotation.targets;
        var instances = AnnotationService.getInstances(targetAnnotation);
        method(instances);
    }

}
