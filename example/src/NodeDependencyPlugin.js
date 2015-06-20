
'@BeforeLoadContainer'
function NodeDependencyPlugin(HTTPConfig){

    var annotationMethods = [
        "Get",
        "Post",
        "Put",
        "Delete",
        "Options",
        "Patch",
        "Head"
    ]

    "@InjectAnnotatedWith([@RequestHandler])"
    this.configure = function(instances) {
        for (var i = instances.length - 1; i >= 0; i--) {
            var instance = instances[i];
            var keys = Object.keys(instance);
            for (var i = keys.length - 1; i >= 0; i--) {
                bindListeners(instance, keys[i]);
            };
        }
    };

    function bindListeners (instance, key) {
        var binder = {
            url : getUrl(instance)
        };
        var method = instance[key];
        for (var i = method.annotations.length - 1; i >= 0; i--) {
            var annotation = method.annotations[i];
            if(annotationMethods.indexOf(annotation.name) !== -1){
                binder[annotation.name.toLowerCase()] = instance[key].bind(instance);
            }
        }
        HTTPConfig.bind(binder);
    }

    function getUrl (instance) {
        var annotations = instance.constructor.annotations;
        var handler;
        for (var i = annotations.length - 1; i >= 0; i--) {
            handler = annotations[i].name = 'RequestHandler' ? annotations[i] : handler;
        }
        return handler.value;
    }

}

module.exports = NodeDependencyPlugin;