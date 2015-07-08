---
tags: ['JavaScript', 'DI', 'node-dependency', 'NodeJS', 'Patterns', 'annotations', '@Named']
comments : true
date: 2015-07-08T14:43:07-03:00
title: Deeper Dive into Node-Dependency
---

After [Getting Started](http://node-dependency.pedroassis.com.br/post/getting-started/) you might what to go deeper into the framework, we'll give you a hand.  

You may find yourself with naming collisions, because node-dependency registers your classes based on the Function's name. If you have more than one class with the same name, you'll have some problems.  

There are two ways of fixing this:

#### Package and Import

You can define packages and import them, similar to Java's package management, but not quite as complex.  

To define the class's package name, you'll have to use some [annotations](http://node-dependency.pedroassis.com.br/post/JS-Annotations/).  
###### User.js
```js
'package br.com.pedroassis';

function User(){
    // some code
}

module.exports = User;
```

The `User` class will be defined with name `br.com.pedroassis.User`, thus avoid naming collision.  

To inject this class you now must first import it:
###### UserHolder.js
```js
'import br.com.pedroassis.User';  // No wildcards, import the fullname
'import br.com.pedroassis.Model'; // Another import, even inside the same package

function UserHolder(User, Model){
    // some code
}

module.exports = UserHolder;
```


The package is just a name, the source file may be inside any folder in your source folder.  

`Package` and `Import` are cool and all, but there's a easier way:

#### @Named
Node-Dependency supports the `@Named` annotation used to rename the Class with an arbitrary string.  

###### User.js
```js

'@Named("userInstance123")'
function User(){
    // some code
}

module.exports = User;
```

###### UserHolder.js
```js

function UserHolder(userInstance123){ // No need to import it
    // some code
}

module.exports = UserHolder;
```
