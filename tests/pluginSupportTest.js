
var chai                    = require("chai");
var sinon                   = require("sinon");
var expect                  = chai.expect;
var fs                      = require('fs');
var path                    = require('path');

var FileUtils               = require('../src/Service/FileUtils');

var root                    = path.join(__dirname, 'project');

var fileUtils               = new FileUtils(path.join(root, 'src'), fs);

var files                   = fileUtils.getAllJS();

var requiredFiles           = files.map(function(file) {
    return require(file);
});

var names = requiredFiles.map(function(funktion, i) {
    return funktion.constructor !== Function ? getJSON(i) : getClass(funktion);
});

function getJSON(i) {
    return fileUtils.getFileName(files[i]);
}

function getClass(funktion) {
    return funktion.packaged ? (funktion.packaged + '.' + funktion.name) : funktion.name ? funktion.name : funktion.className;
}

var container               = require('./getContainer')();

describe('The container should honor the plugins annotations', function() {
    var plugin;

    container.run(function(Plugin) {
        plugin = Plugin;
    });

    it('The plugin should have its arguments prop assinged', function() {
        expect(plugin.arguments).to.be.ok;
        expect(plugin.arguments.length).to.be.equal(3);
        for(var i in plugin.arguments){
            expect(plugin.arguments[i].length).not.to.be.equal(0);
        }
    });

    describe('Should have provided all the parameters', function() {
        for(var i in plugin.arguments){

            var handlers = plugin.arguments[i];

            var allHandlers = handlers.every(function(handler) {
                return requiredFiles.indexOf(handler.constructor) !== -1;
            });

            var annotation = Object.keys(handlers[0].constructor.annotations)[0];

            describe("Should provide the instances annotated by " + annotation, function() {
                var annotatedFiles = requiredFiles.filter(function(file) {
                    return file.annotations && !!file.annotations[annotation];
                });

                var allFiles = annotatedFiles.forEach(function(annotated) {
                    var some = handlers.some(function(handler) {
                        return handler.constructor === annotated;
                    });
                    it("Must have injected the type " + names[requiredFiles.indexOf(annotated)], function() {

                        expect(some).to.be.ok;

                    });
                });
            });

        }
        
    });

});


