
function ArrayUtils () {
    
    this.toMap = function(array, key) {
        var object = {};
        for (var i = array.length - 1; i >= 0; i--) {
            var keyValue = array[i][key];
            object[keyValue] = array[i];
        }
        return object;
    };

}

module.exports = ArrayUtils;