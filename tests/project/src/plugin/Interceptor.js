
"@Interceptor"
function Interceptor () {
    
    this.arguments = arguments;
    "@Intercept('/*')"
    this.all = function(url, next) {
        console.log("Intercepted the url: '" + url + "' on /*");
        next();
    }
    
    "@Intercept('/user')"
    this.user = function(url, next, response) { // You can inject the request, response and other sfuff
        console.log("Intercepted the url: '" + url + "' on /user");
        response.status(401).send('Access Denied');
    }
}

module.exports = Interceptor;