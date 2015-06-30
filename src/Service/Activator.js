var fs = require('fs');

var vm = require('vm');

// var FileUtils = require('./FileUtils');

function Activator () {

    this.activate = function(file, name) {
        var script = vm.createScript(file);

        var context = {};

        returnedVal = script.runInNewContext(context);

        return returnedVal || context[name];
    };

}

module.exports = Activator;