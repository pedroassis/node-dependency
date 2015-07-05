function ErrorHandler() {
    
    this.missingDependencies = function(dependencies) {
        dependencies = Array.isArray(dependencies) ? dependencies : [dependencies];

        console.log('There are missing dependencies on your project: ');
        console.log("---------------------------------------------------------------");

        dependencies.forEach(function(dependency) {
            var name = dependency.klass.name || dependency.klass.className;
            console.log("Could not declare " + name + " because of missing dependencies.");
            console.log("Missing dependencies: " + dependency.invalidDeps.join(', '));
            console.log("---------------------------------------------------------------");
        });
    };
}