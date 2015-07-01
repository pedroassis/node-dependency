node-dependency - Node Dependency Injection (Beta)
===============

Autowiring dependencies to you JS files. Without hard-to-write configuration files.  
You can cnfigure your files using annotations, yes annotatons. See [JS Annotations](https://github.com/pedroassis/js-annotation-reader).  
You can also 'import' and declare 'package' inside your files to handle naming collisions.

node-dependency has support for plugins too, for instance [node-dependency ExpressJS](https://github.com/pedroassis/nd-express-plugin), this plugin allows you to write RESTFul services inspired by JAX-RS from Java.

[Click here](https://github.com/pedroassis/node-dependency/tree/v2/examples) and browse our example folder to see how an app using node-dependency looks like.

## Installation

```bash
$ npm install node-dependency
```

**Never call 'require' again**.
Well, you still have to call it once:

## Setup

**index.js**

    var statupMethod = require('node-dependency');
    
    // You have to specify where your source folder is.
    statupMethod(__dirname);

This should be your index.js, and yes no other calls needed.

## Startup class

You also need a file called **ProjectBootstrap.js** inside your source folder.

Note that if you have a plugin that bootstraps the project, like [node-dependency ExpressJS](https://github.com/pedroassis/nd-express-plugin), you won't need this file.

This file is where you should start your application, and it should look like this:

```js    
    // Note that you can get express from the contructor of your class,
    // no need to 'require' it, but you need to declare it in your package.json
    function ProjectBootstrap(express){
        var app = express()

        app.get('/', function (req, res) {
            res.send('Hello World!')
        })

        var server = app.listen(3000, function () {

        })
    }
    // Is required to export the function
    module.exports = ProjectBootstrap;
```

Note that you have to inject your own dependencies on ProjectBootstrap in order to start you app, node-dependency instantiates in lazy mode always.


That means if you don't inject anything on ProjectBootstrap node-dependency won't instantiate any other class.

## Package Scan

node-dependency will read your package.json and make every dependency declared in there available to inject, and it will read your source folder and declare all the JS and JSON files it can find too.

## Configuration

There's a configuration file, we need it because most libraries, like this one, have invalid names to declare as a variable name.

The container will try to **rename** your dependencies as it can.

e.g: 'request-promise' will be available as requestPromise.

We remove the dash '-' and declare the dependency with a camel-case name.

But in your **package.json** you can have this configuration:

**package.json**

    {
        ...
        "node-dependency" : {
            "names" : {
                "request-promise"  : "request",
                "ng-di"            : "ngDI",
                "cheerio"          : "$",
                "q"                : "Q",
                "sails-mongo"      : "sailsMongo",
                "waterline"        : "Waterline",
                "fs"               : "fileSystem"
            }
        }
        ...
    }

This will assign a different name for your dependencies, not only to make them valid, but also to make them better.

You see that I depend upon the module 'q' but I want to inject it as 'Q'.

Note that we added 'request-promise' and rename it to 'request', therefore it won't need to be renamed by the container.

You also have to declare node internal dependencies like fs.

Aside from this file you don't need to explicitly declare or inject anything, every JS file will be loaded and also have its dependencies autowired for you.

see
```js
    "package sidewalk" // The package is only a declaration, does not have to be inside a folder named sidewalk
    // Named function means it is a Class
    function SideWalk(Q, request, WaterLine){
        Person.walk();
    }
    module.exports = SideWalk;
```  

This module is a dependency manager for NodeJS based on https://github.com/jmenode-dependencyara/ng-di, which is based on AngularJS's dependency injector.

ng-di is great, but it doesn't work as it does in AngularJS because it lacks the environment.

Adding node-dependency you'll have a environment to handle your dependencies, but as AngularJS you'll have to code for it, but it is worth it.

## Dependency Types

In node-dependency we have 3 types of dependencies:

>  1. Class like function
>  2. Object Dependency
>  3. Function as Object

1. Class like function
-------
That's the approach I like best when working with JS. You can write Class functions in JS, and node-dependency will create one instance of it and make it available for injection.

See for yourself:

**Person.js**

```js
    // Named function means it is a Class
    function Person(){
        var place = 0;
        this.walk = function(){
            return place++;
        }
    }
    module.exports = Person;
```  

Now if you need a Person somewhere you can just receive as a dependency.

**SideWalk.js**

```js
    "package sidewalk" // Package isn't required, just if you need to avoid naming collisions

    // Named function means it is a Class
    function SideWalk(Person){
        Person.walk();
    }
    module.exports = SideWalk;
```  

2. Object Dependency
-------

Sometimes we need to depend upon an Object, in JS most likely a JSON

ConfigFile.json
```js
    {
        "some_key" : "some_value"
    }
```  
You can inject this object as you did with a Class like object.
```js
    // Named function means it is a Class
    function SideWalk(Person, ConfigFile){
        Person.walk(ConfigFile.some_key);
    }
    module.exports = SideWalk;
```

3. Function Object
-------
We also have a third type, mostly for compatibility sake.

A function object works like most libraries for node, when you require something and it is a function and also have properties.
```js
    // 'request' is a node library   
    var request = require('request');
    // It works as a function
    request(someUrl).then(callback);
    // And as a object
    request.get(someUrl).then(callback);
```  

There is nothing wrong with this approach, and it is widely used, but it does create a problem when declaring it as a dependency.

Angular module thinks it's a Class function and tries to instantiate a object.

If you create a function that works like that one you'll have to declare it a little different:
```js

    function SomeFunction(){
        // do something
    }
    SomeFunction.doSomethingElse = function(){};
    
    // Note that you can inject dependencies in the anonymous function.
    module.exports = function(Dependency){
        return SomeFunction;
    };
```

When you declare a anonymous function we assume that this isn't a Class like function, and make it available as is.

To use that function:
```js

    // Named function means it is a Class
    function SideWalk(Person, ConfigFile, SomeFunction){
        Person.walk(ConfigFile.some_key);
    
        // Use it as you will
        SomeFunction.doSomethingElse()
        SomeFunction({});
    }
    module.exports = SideWalk;
```

## Error Handling  
If you declare a class or function with an dependency that does not exists in the container, node-dependency will display a message on your console warning you what class has missing dependencies and which are its names.  

Example:  
    Could not declare BuildingsHandler because of missing dependencies.  
    Invalid dependencies: MissingDep  


> Written with [StackEdit](https://stackedit.io/).
