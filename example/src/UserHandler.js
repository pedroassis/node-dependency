'@RequestHandler("/user")'
function UserHandler () {
    
    '@Get'
    this.fetchAll = function(resolver, request) {
        resolver.resolve([{
            name : 'USER!'
        }]);
    };

}

module.exports = UserHandler;