/*
 * Note that "Express" is a external dependency and it must be in your package.json
 * and in your Dependencies.json because its name is "express" without the capital "E"
 * the other dependencies must be inside your source folder.
 * 
 * Injecting an invalid name will cause your app to break!
 */
function App(Express, httpConfig, Models, requestPromise) {
    var app = Express();

    app.get('/', function (req, res) {
        res.send('Hello World!');
    });

    app.get('/:name', function (req, res) {
        var name = req.params.name;

        var model = Models[name];

        res.send(model || (name + ' not found, available models: ' + Object.keys(Models).join(', ')));

    });

    var server = app.listen(httpConfig.port, httpConfig.host, function () {

        var host = server.address().address;
        var port = server.address().port;

        console.log('Example app listening at http://%s:%s', host, port);

    });
}

// Don't forget this, because if you do there isn't going to be an error
// exports will be an empty object.
// If you receive an empty object as dependency, look inside the file for this statement.
module.exports = App;