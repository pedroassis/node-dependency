---
tags: ['JavaScript', 'DI', 'node-dependency', 'NodeJS', 'Patterns']
comments : true
date: 2015-07-07T20:20:09-03:00
title: Getting Started
---

## Installing

I suppose you have a NodeJs project and you know what's `npm`  

```bash
    npm install node-dependency --save
```

##### The source folder
Your source files must be in your root folder inside another folder, the default name is `src` but you can changed that. If you do change it you need to add it to your **package.json**.  

###### package.json
```js
{
    ... /// npm stuff, like dependencies, name, version...
    "node-dependency" : {
        "source" : "newName" // defaults to "src"
    }
    ...
}
```

Now you should create a **index.js** file in your root folder, and `require` node-dependency module.

###### index.js
```js
    
// You should require node-dependency
var statupMethod = require('node-dependency');

/* 
 *  The returned value is a function which take 1 parameters: rootFolder
 *  After that node-dependency will read your source folder and load all your classes
 *  and instantiate the class named ProjectBootstrap, this file can be anywhere inside
 *  your source folder
 */
statupMethod(__dirname);
```


###### File Structure:
```
root_folder/
|-- index.js
|-- package.json
|-- src/                            # Your Source Folder
|   |-- ProjectBootstrap.js         # Startup class
|   ...                             # Your other files
```

Now you add the Startup class: **`ProjectBootsrap.js**
`ProjectBootsrap` can be placed anywhere in your source folder. And you should start your app in there.  


###### ProjectBootsrap.js
```js
function ProjectBootstrap (MyDependency, AnotherOne) {
    myDependency.start(); // You sould keep this file as simple as you can, don't abuse it

    anotherOne.configure(); // configure and start are just madeup names
}

module.exports = ProjectBootstrap;
```


Your `ProjectBootstrap` depends on `MyDependency, AnotherOne`. Now you should create then as well.  

They can be anywhere inside your source folder, for instance, inside another folders.

###### MyDependency.js
```js
function MyDependency () {

    this.start = function(){
        // Do your stuff here
        console.log("I have been started!")
    };
}

module.exports = MyDependency;
```

###### AnotherOne.js
```js
function AnotherOne () {

    this.configure = function(){
        // Do your stuff here
        console.log("I have been configured!")
    };
}

module.exports = AnotherOne;
```


That's it, you already have a app up and running.  

You probably want to use your dependencies modules from `npm`. That's ok, node-dependency inject them too. 

Let's install `expressjs`

```bash
npm install express --save
```

> Attention: You must have your module dependencies written on your **package.json**'s `dependencies` field

Let's rewrite `MyDependency` to use `express`.  

###### MyDependency.js
```js
function MyDependency (express) { // You just need to do this

    var app = express();

    this.start = function(){

        app.get('/', function (req, res) {
            res.send('Hello World!');
        });

        var server = app.listen(3000, function () {
            var host = server.address().address;
            var port = server.address().port;

            console.log('Example app listening at http://%s:%s', host, port);
        });
    };
}

module.exports = MyDependency;
```

Now you will have a HTTP Server when you run your app.  

