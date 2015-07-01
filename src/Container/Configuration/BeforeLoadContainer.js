
function BeforeLoadContainer(container, AnnotationService) {
    
    this.configure = function(runConfigMethods) {
        AnnotationService.getInstances(BeforeLoadContainer.name, function(instances) {
            instances.forEach(function(instance) {
                runConfigMethods(instance);
            });
        });
    };

}

module.exports = BeforeLoadContainer;