
'@ExpressConfiguration'
function Config (serverConfig) { // serverConfig.json injected here
    
    this.arguments = arguments;
    this.configure = function(expressApp) {
        expressApp.listen(serverConfig.port, serverConfig.host, function() {
            console.log('Express server started on port %s at %s', serverConfig.port, serverConfig.host);
        });
    };

}

module.exports = Config;