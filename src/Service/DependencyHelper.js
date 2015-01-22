

function DependencyHelper (root, require) {
    
    var Dependency = require(root + "/Dependency.json");

    var deps       = require(root + "/package.json").dependencies;

    var dependencies = Object.keys(deps).map(function (dep) {
        var name = Dependency[dep] ? Dependency[dep] : dep;
        return {

            name : name,
            require : dep
        }
    });

    this.getDependencies = function projectDependencies () {
        return dependencies;
    }
}

module.exports = DependencyHelper;