
function HTTPConfig(HTTPServer, rootFolder, httpConfig){
    
    var expressAdapter      = new HTTPServer.ExpressAdapter();

    var HTTPMethods         = HTTPServer.HTTPMethods;

    var httpServer          = new HTTPServer.HTTPServer(expressAdapter, httpConfig.port, httpConfig.host);

    httpServer.start();

    HTTPBinders.forEach(function(HandlerClass){

        httpServer.addCRUD(HandlerClass);
    });


    expressAdapter.addStaticFolder(rootFolder + '/frontend');

    console.log(rootFolder + '/frontend')
    // expressAdapter.addStaticFolder('/Users/ac-passis/Documents/to-watch');

}

module.exports = HTTPConfig;