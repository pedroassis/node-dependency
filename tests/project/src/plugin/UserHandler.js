'package com.pedro'

'@RequestHandler("/user")'
function UserHandler () {
    
    this.arguments = arguments;
    
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

module.exports = UserHandler;