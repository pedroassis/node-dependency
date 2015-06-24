

function DependencyHelper (root, require) {
    
    var Dependency = require(root + "/Dependency.json");

    var deps       = require(root + "/package.json").dependencies;

    var keys = Object.keys(deps);

    var dependencies = keys.filter(function(dep) {
        return dep !== 'node-dependency';
    }).map(function (dep) {
        var name = Dependency[dep] ? Dependency[dep] : dep;
        return {

            name : name,
            require : dep
        }
    });
    
    var nodeDependencies = Object.keys(Dependency).filter(function (dependency) {
        return keys.indexOf(dependency) === -1;
    }).map(function(dependency) {
        return {
            name : dependency,
            require : dependency
        };
    });

    var allDependencies = dependencies.concat(nodeDependencies);

    this.getDependencies = function projectDependencies () {
        return allDependencies;
    }

    this.requireDependency = function() {
        return this.getDependencies().map(function(dependency){

            var Class;

            var name = variableRegex.test(dependency.name) ? dependency.name : StringUtils.removeDashes(dependency.name);

            if(!variableRegex.test(name)){
                var message = "You have '" + dependency.name + "' on your package.json or in your Dependency.json. And we can't declare a variable with this name.";
                console.log();
                console.log(message);
                console.log();
                console.log("You'll need to use our Dependency.json file to create an alias for this dependency. Sorry.");
                console.log("You can see how it works on https://github.com/pedroassis/node-dependency/");
                console.log();
                throw new Error(message);
            }

            try{
                Class = require(dependency.require);
            } catch(error){
                console.log('You have declared "' + dependency.require + '", with name "' + name + '"');
                console.log("And we couldn't find with require. Did you run 'npm install'?");
                throw error;
            }
            return Class;
        });

    };
}

module.exports = DependencyHelper;