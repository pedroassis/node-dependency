

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
}

module.exports = DependencyHelper;