
module.exports = function(fileUtils, container, AnnotationService, runConfigMethods) {

    fileUtils.getAllJS(__dirname).map(function(file) {
        return fileUtils.getFileName(file);
    })

    .forEach(function(name) {
        if(name !== 'index'){
            var Class = require("./" + name);
            new Class(container, AnnotationService).configure(runConfigMethods);
        }
    });

};
