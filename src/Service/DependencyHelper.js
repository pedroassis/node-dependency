

function DependencyHelper (root, require) {

    var packageJson         = require(root + "/package.json");
    
    var packageDependencies = packageJson.dependencies;    

    var renaming            = Object.create(null);

    var ndiNames            = packageJson['node-dependency'] && packageJson['node-dependency'].names ? packageJson['node-dependency'].names : {};

    for(var i in ndiNames){
        renaming[i] = ndiNames[i];
    }

    var keys = Object.keys(packageDependencies);

    var dependencies = keys.filter(function(dep) {
        return dep !== 'node-dependency';
    }).map(function (dep) {
        var name = renaming[dep] ? renaming[dep] : dep;
        return {

            name : name,
            require : dep
        }
    });
    
    var nodeDependencies = Object.keys(renaming).filter(function (dependency) {
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

    this.getExternals = function getExternals () {
        return dependencies;
    }

}

module.exports = DependencyHelper;