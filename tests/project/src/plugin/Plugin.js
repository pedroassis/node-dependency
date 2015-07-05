
'@BeforeLoadContainer'
function Plugin(){

    "@InjectAnnotatedWith([@RequestHandler, @Interceptor, @ExpressConfiguration])"
    this.configure = function() {
        this.arguments = arguments
    };

}

module.exports = Plugin;
