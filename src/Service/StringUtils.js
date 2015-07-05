
function StringUtils () {
}
    
StringUtils.removeDashes = function(string) {
    return string.replace(/-([a-z])/g, function (m, w) {
        return w.toUpperCase();
    });
};

module.exports = StringUtils;