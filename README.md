node-dependency
===============

[Click here](https://github.com/pedroassis/node-dependency/tree/master/example) and browse our example folder to see how an app using node-dependency looks like.


**Never call 'require' again**
Well, you still have to call it once:

**index.js**

    var statupMethod = require('node-dependency');
    
    // You have to specify where your source folder is.
    statupMethod(__dirname, '/src');

This should be your index.js, and yes no other calls needed.

You also need a file called **ProjectBootstrap.js** inside your source folder.
This file is where you should start your application.

    
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

node-dependency will read your package.json and make every dependency declared in there available to inject, and it will read your source folder and declare all the JS and JSON files it can find too.

There's a configuration file, we need it because most libraries, like this one, have invalid names to declare a variable, as node-dependency is not valid.
So in your root folder you'll have this file:

**Dependency.json**

    {
	    "request-promise": "request",
	    "ng-di": "ngDI",
	    "cheerio" : "$",
	    "q" : "Q",
	    "sails-mongo" : "sailsMongo",
	    "waterline" : "Waterline",
	    "fs"	: "fileSystem"
	}
This will assign a different name for your dependencies, not only to make them valid, but also to make them better.
You see that I depend upon the module 'q' but I want to inject it as 'Q'.
You also have to declare node internal dependencies like fs.

see

    // Named function means it is a Class
    function SideWalk(Q, request, WaterLine){
	    Person.walk();
	}
	module.exports = SideWalk;

This module is a dependency manager for NodeJS based on https://github.com/jmendiara/ng-di, which is based on AngularJS's dependency injector.

ng-di is great, but it doesn't work as it does in AngularJS because it lacks the environment.

Adding node-dependency you'll have a environment to handle your dependencies, but as AngularJS you'll have to code for it, but it is worth it.

In node-dependency we have 3 types of dependencies:

>  1. Class like function
>  2. Object Dependency
>  3. Function as Object

1. Class like function
-------
That's what I like best when working with JS. You can write Class functions in JS, and node-dependency will create one instance of it and make it available for injection.
See for yourself:

**Person.js**

    // Named function means it is a Class
    function Person(){
	    var place = 0;
		this.walk = function(){
			return place++;
		}
	}
	module.exports = Person;

Now if you need a Person somewhere you can just receive as a dependency.

**SideWalk.js**

    // Named function means it is a Class
    function SideWalk(Person){
	    Person.walk();
	}
	module.exports = SideWalk;


2. Object Dependency
-------

Sometimes we need to depend upon an Object, in JS most likely a JSON

ConfigFile.json

    {
		"some_key" : "some_value"
	}

You can inject this object as you did with a Class like object.

    // Named function means it is a Class
    function SideWalk(Person, ConfigFile){
	    Person.walk(ConfigFile.some_key);
	}
	module.exports = SideWalk;


3. Function Object
-------
We also have a third type, mostly for compatibility sake.
A function object works like most libraries for node, when you require something and it is a function and also have properties.

	// 'request' is a node library   
	var request = require('request');
	// It works as a function
	request(someUrl).then(callback);
	// And as a object
	request.get(someUrl).then(callback);

There is nothing wrong with this approach, and it is widely used, but it does create a problem when declaring it as a dependency.
Angular module thinks it's a Class function and tries to instantiate a object.
If you create a function that works like that one you'll have to declare it a little different:

    function SomeFunction(){
		// do something
	}
	SomeFunction.doSomethingElse = function(){};
	
	// Note that you can inject dependencies in the anonymous function.
	module.exports = function(Dependency){
		return SomeFunction;
	};
	
When you declare a anonymous function we assume that this isn't a Class like function, and make it available as is.
To use that function:

    // Named function means it is a Class
    function SideWalk(Person, ConfigFile, SomeFunction){
	    Person.walk(ConfigFile.some_key);
	
		// Use it as you will
		SomeFunction.doSomethingElse()
		SomeFunction({});
	}
	module.exports = SideWalk;


> Written with [StackEdit](https://stackedit.io/).
