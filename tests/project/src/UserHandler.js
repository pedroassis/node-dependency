
'package default'

'@RequestHandler("/user")'
function UserHandler (Users) {
    
    this.arguments = arguments;
    
    '@Get("/all")'
    this.fetchAll = function() {
        return [{
            name : 'USER!'
        }, {
            anotherOne : 1234567
        }];
    };
    
    '@Get("/{id}")'
    this.getByID = function(id) {
        return {
            userID : id
        };
    };

}

module.exports = UserHandler;