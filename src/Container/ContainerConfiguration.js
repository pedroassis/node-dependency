
var BeforeLoadContainer = 'BeforeLoadContainer';

var ConfigurateContainer = 'ConfigurateContainer';

function ContainerConfiguration (AnnotationService) {
    
    this.configure = function configure (container) {
        AnnotationService.getInstances(BeforeLoadContainer, function(instances) {
            instances.forEach(runConfigMethods);
        });
    }

    function runConfigMethods (instance) {
        var methods = AnnotationService.getAnnotatedMethods(instance, ConfigurateContainer);
        methods.forEach(getTargetAnnotation);
    }

    function getTargetAnnotation (method) {
        method(AnnotationService);
    }

}

module.exports = ContainerConfiguration;