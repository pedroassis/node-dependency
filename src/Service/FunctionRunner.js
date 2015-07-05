
function FunctionRunner(container) {
    
    var $injector;
    var cache = [];

    this.setInjector = function(injector) {
        $injector = injector;
        this.shouldCache = false;
        cache.forEach(function(funktion) {
            run(funktion);
        });
    };

    this.run = function(funktion, locals) {
        return this.shouldCache ? cache.push(funktion) : run(funktion, locals);
    }

    function run(funktion, locals) {
        return $injector ? $injector.invoke(funktion, null, locals) : container.run(funktion, locals);
    }

}

module.exports = FunctionRunner;