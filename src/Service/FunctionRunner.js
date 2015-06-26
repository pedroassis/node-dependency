
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

    this.run = function(funktion) {
        return this.shouldCache ? cache.push(funktion) : run(funktion);
    }

    function run(funktion) {
        return $injector ? $injector.invoke(funktion) : container.run(funktion);
    }

}

module.exports = FunctionRunner;