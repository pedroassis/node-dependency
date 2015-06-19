
'@BeforeLoadContainer'
function NodeDependencyPlugin(){

    var RequestHandler = 'RequestHandler';

    var Get = 'Get';

    "@ConfigurateContainer"
    this.configure = function(AnnotationService) {
        AnnotationService.getInstances(RequestHandler, function(instances) {
            instances.forEach(runConfigMethods);
        });
    };

    function runConfigMethods (instance) {
        var methods = AnnotationService.getAnnotatedMethods(instance, Get);

    }

}

module.exports = User;