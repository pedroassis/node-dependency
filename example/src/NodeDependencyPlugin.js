
'@BeforeLoadContainer'
function NodeDependencyPlugin(){

    var Get = 'Get';

    "@InjectAnnotatedWith(@RequestHandler)"
    this.configure = function(gets) {
        console.log(gets);
    };

}

module.exports = NodeDependencyPlugin;