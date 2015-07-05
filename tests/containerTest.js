
var chai                    = require("chai");
var expect                  = chai.expect;
var fs                      = require('fs');
var path                    = require('path');

var packageJSON             = require('./project/package.json');

var jsonDeps                = Object.keys(packageJSON.dependencies);

var FileUtils               = require('../src/Service/FileUtils');
var AnnotationServiceClass  = require('../src/Service/AnnotationService.js');

var root                    = path.join(__dirname, 'project');

var fileUtils               = new FileUtils(path.join(root, 'src'), fs);

var container               = require('./getContainer')();

var AnnotationService;

container.run([
    'nd.FunctionRunner',
    function(runner) {

        AnnotationService = new AnnotationServiceClass(runner.run.bind(runner));
}]);

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

var JS_TYPES = [
    Function,
    Number,
    Date,
    String,
    Object,
    Boolean,
    Array
];

describe('Container Behavior', function() {
    var exposedClasses = ['nd.FunctionRunner', 'nd.NodeDependencyConfig', 'nd.Container', 'nd.AnnotationService'];

    describe("Should provide a " + exposedClasses.join(', '), function() {
        function getter () {
            var args = Array.prototype.slice.call(arguments);

            it('Should have injected all instances of the internal classes', function() {
                expect(args.length).to.be.equal(exposedClasses.length);
            });

            args.forEach(function(dependency, i) {

                it('Should have injected a instance of ' + exposedClasses[i], function() {

                    expect(dependency).to.be.ok;
                    var index = JS_TYPES.indexOf(dependency.constructor);
                    var constructor = index !== -1 ? JS_TYPES[index] : dependency.constructor;

                    expect(dependency.constructor).to.be.equal(constructor);

                })
            });
            
        }
        getter.$inject = exposedClasses;

        container.run(getter);
    });

    describe("Should have declared all dependencies from package.json: " + jsonDeps.join(', '), function() {
        function getter () {
            var args = Array.prototype.slice.call(arguments);

            it('Should have injected all the external dependencies', function() {
                expect(args.length).to.be.equal(jsonDeps.length);
            });

            args.forEach(function(dependency, i) {

                it('Should have injected the result of requiring ' + jsonDeps[i], function() {

                    expect(dependency).to.be.ok;

                    expect(dependency).to.be.equal(require(jsonDeps[i]));

                })
            });
            
        }
        getter.$inject = jsonDeps;

        container.run(getter);
    });

    describe("Should inject all dependencies", function() {
        getDependencies.$inject = names;
        container.run(getDependencies);

        function getDependencies() {
            var args = Array.prototype.slice.call(arguments);

            args.forEach(function(dependency, i) {
                !isJSON(dependency, i) || isFactory(i) ? verifyDependency(dependency, i) : verifyJSON(dependency, i);
            });
        }

        function verifyJSON (dependency, i) {
            var found = require(files[i]);

            var message = 'Should have injected the JSON named "{0}"" from file {1}';

            it(message.replace('{0}', names[i]).replace('{1}', files[i].replace(root, '')), function() {
                expect(found).to.be.equal(dependency);
            });
        }

        function verifyDependency (dependency, i, nested) {
            var found = require(files[i]);

            var message = 'Should have injected a instance of the class named "{0}" from file {1}';

            it(message.replace('{0}', names[i]).replace('{1}', files[i].replace(root, '')), function() {
                isFactory(i) ? testFactory() : testService();
                

                function testFactory() {
                    expect(found().toString()).to.be.equal(dependency.toString());
                }

                function testService() {
                    expect(found).to.be.equal(dependency.constructor);
                }

            });

            var params = dependency.constructor.$inject;

            if(params && params.length && !nested){
                var innerDescribe = 'Should have inject all "{0}" named dependencies: '.replace('{0}', names[i]) + params.join(', ');
                describe(innerDescribe, function() {
                    params.forEach(function(param, i) {
                        var index = names.indexOf(param);
                        var Class = requiredFiles[index];
                        !isJSON(dependency.arguments[i], index) ? verifyDependency(dependency.arguments[i], index, true) : verifyJSON(dependency.arguments[i], index);
                    });
                });
            }
        }

    });

    function isJSON (dependency, i) {
        return dependency !== null && JS_TYPES.indexOf(dependency.constructor) !== -1 && !isFactory(i);
    }

    function isFactory (i) {
        var factory = requiredFiles[i];
        return factory && factory.className && factory.constructor === Function;
    }

});



