---
date: 2015-07-04T21:55:18-03:00
title: 'JS and Annotations'
comments : true
tags : ['JavaScript', 'use strict', 'annotations', 'ES5', 'esprima']
---

Since ECMAScript 5 specification it was introduced the 'use strict' directive, which is used to declared that the code inside the scope of the 'use strict' should use a subset of the JavaScript language.  

----
It means that the same code should run different of the same code without it, for instance, you can't declare a global variable in the following way:

```js
    someNumber = 123;
```

The code above will run in any browser, declaring `someNumber` in the global scope because of the missing `var`. 

----

```js
    'use strict';
    someNumber = 123; // ReferenceError: someNumber is not defined
```


The second snippet runs in strict mode and will throw a error on browsers ES5 compatible, because of using a variable that was not defined.  

And the same code will run without any problems in all browsers that do not support the ES5 especification.  

Recently ASM started using a annotation `use asm` to define that a code should be run as a fast subset of JS (Pretty fast accually).  

---
### Time to use it too!  

So we already know that annotations exists in JS, they look like code, in fact they are a `Literal Expression`, but they just get vaccued into the void, not meaning anything to normal JS code.  

#### How can we use it?  

Pretty good question, JS does not provide a simple way of using it.
I was going to suggest writing a parser to read the code and detect those annotations.  
JS is such a powerful language that you can accually do it.  

But this would take a little bit of time, and reading annotations is not what we need right now, we need to use it.  

Then I've found there are a lot of JS parsers out there and I chose [Esprima](http://esprima.org) to the job.  

Esprima is pretty cool, it reads your JS code and returns a Node Tree with the parsed code.  

Let's read the following function and see what we get.   


```js 
function Person(name){};
JSON.stringify(esprima.parse('function Person(name){}'), null, 4) 
// Or JSON.stringify(esprima.parse(Person.toString()), null, 4) 
{
    "type": "Program",
    "body": [
        {
            "type": "FunctionDeclaration",
            "id": {
                "type": "Identifier",
                "name": "Person"
            },
            "params": [
                {
                    "type": "Identifier",
                    "name": "name"
                }
            ],
            "defaults": [],
            "body": {
                "type": "BlockStatement",
                "body": []
            },
            "generator": false,
            "expression": false
        }
    ]
}
```

Esprima read a bunch of data out of the function.

It has identified that this is a `FunctionDeclaration`, with name `Person` and a parameter called `name`.  
And also the `body` of the function, which is empty.  

That's cool! How about this:  

```js

var code = "'use strict'" +
           "\n" +
           "function Person(name){}";

JSON.stringify(esprima.parse(code), null, 4)
{
    "type": "Program",
    "body": [
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "Literal",
                "value": "use strict",
                "raw": "\"use strict\""
            }
        },
        {
            "type": "FunctionDeclaration",
            "id": {
                "type": "Identifier",
                "name": "Person"
            }
            ...
        }
    ]
}

```

Now we can read the annotations from the source code, we can see in the JSON that we have a `use strict` before our function.  

This is how we extract annotations from JS files on [js-annotation-reader](https://github.com/pedroassis/js-annotation-reader), which is the module used by [node-dependency](https://github.com/pedroassis/node-dependency) to enable annotation support.  

Using this technique I wrote js-annotation-reader, and using it you can read a file like this:

```js
'package com.pedro'

'@RequestHandler("/user")'
function UserHandler () {
    
    '@Get("/all")'
    this.fetchAll = function() {
        return [{
            name : 'USER!'
        }, {
            anotherOne : 1234567
        }];
    };
    
    '@Get("/id/:id")'
    this.getByID = function($id) {
        return {
            userID : $id,
            name : "aSDFGHJKL"
        };
    };

}
```

##### And we get this result:  

```js
{
    "name": "UserHandler",
    "packaged": "com.pedro",
    "parameters": [],
    "annotations": [
        {
            "name": "RequestHandler",
            "value": "/user",
            "targets": "UserHandler"
        }
    ],
    "imports": [],
    "methods": [
        {
            "annotations": [
                {
                    "name": "Get",
                    "value": "/all",
                    "targets": "fetchAll"
                }
            ],
            "parameters": [],
            "name": "fetchAll"
        },
        {
            "annotations": [
                {
                    "name": "Get",
                    "value": "/id/:id",
                    "targets": "getByID"
                }
            ],
            "parameters": [
                "$id"
            ],
            "name": "getByID"
        }
    ]
}
```

If you are wondering in what this can be used, just check this out [Express Plugin](https://github.com/pedroassis/nd-express-plugin)  

References:

[Mozilla's MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#Making_eval_and_arguments_simpler)  

[ECMAScript 5](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-directive-prologues-and-the-use-strict-directive)

[ASM.js](http://asmjs.org/spec/latest/)


