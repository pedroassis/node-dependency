+++
date = "2015-07-04T12:14:38-03:00"
title = "Classes in JavaScript"
comments = true
tags = ['Patterns', 'JavaScript', 'Object Oriented', 'Class-like', 'DI']
+++

#### I see a lot of design patterns on NodeJS, most of then I don't like.  
These NodeJS design patterns help us build fast applications using JavaScript, but they might lead to crappy code.  

Node-Dependency apps must follow some JS design patterns that I think are the easiest to learn for a programmer used to OOP.  

For instance:

```js
    // You can define Class-like functions with JS
    function MyClass(){}

    var myInstance = new MyClass();
```

This is pretty straight forward and anyone used to OOP will understand that.  

But is not a class as you'll get with Java or C# or whatever.


```js
    
    function Person(name){ 
        // The 'name' is receive in the constructor and is a private variable
        // This is the constructor of your class
        // You can define private and public properties

        var lastName = ' is awesome!';  // Private variable
        this.lastName = name + lastName; // this.lastName is a public variable

        this.getFullName = function(){
            return name + " kind of" + lastName;
        };
    }

    var someone = new Person("Mary");

    console.log(someone.lastName); // "Mary is awesome!"
    console.log(someone.getFullName()); // "Mary kind of is awesome!"
    console.log(someone.name); // undefined
    console.log(someone.lastName); // " is awesome!"

    someone.name = "John";

    console.log(someone.getFullName()); // "Mary kind of is awesome!"

    // You can see that 'name' is a private variable,
    // and you cant access it outside the Class scope.

    // When changed 'name' to "John", you haven't changed anything. 
    // You accually created a new property in the same level as 'this.lastName'
```

This is pretty neat, right?

Looking at Person class you might say that it has a dependency upon name.

This is JS, so you are not required to provide the name upon object creation.

```js
    var someone = new Person();

    console.log(someone.getFullName()); // "undefined kind of is awesome!"
```

Hnm!




