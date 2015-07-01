
var fs                      = require('fs');
var path                    = require('path');

var nd                      = require("../");

var container               = nd(path.join(__dirname, 'project'));

module.exports = function() {
    return container;
};