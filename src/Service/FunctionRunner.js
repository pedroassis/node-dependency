
function FunctionRunner(container) {
    
    var $injector;
    var cache = [];

    this.setInjector = function(injector) {
        $injector = injector;
        cache.forEach(function(funktion) {
            run(funktion);
        });
    };

    this.run = function(funktion) {
        this.shouldCache ? cache.push(funktion) : run(funktion);
    }

    function run(funktion) {
        $injector ? $injector.invoke(funktion) : container.run(funktion);
    }

}

module.exports = FunctionRunner;