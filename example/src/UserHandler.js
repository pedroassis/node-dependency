'@RequestHandler("user")'
function UserHandler () {
    
    '@Get("/all")'
    this.fetchAll = function() {
        return [{
            name : 'USER!'
        }]
    };

}

module.exports = UserHandler;