
'@RequestHandler("/user")'
function UserHandler (ProjectBootstrap) {
    
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