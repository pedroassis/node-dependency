
function FileUtils (rootFolder, fs) {
    
    this.getAllJS = function getAllJS () {
        return getFiles(rootFolder);
    }

    this.getFileName = function(fullName) {
        var fpath = fullName.replace(/\\/g, '/');

        return fpath.substring(fpath.lastIndexOf('/')+1, fpath.lastIndexOf('.'));
    };
    
    function getFiles(dir, files_){
        files_ = files_ || [];
        var files = fs.readdirSync(dir);
        for(var i in files){
            if (!files.hasOwnProperty(i)) continue;
            var name = dir+'/'+files[i];
            if (fs.statSync(name).isDirectory()){
                getFiles(name,files_);
            } else if(isJS(name)){
                files_.push(name);
            }
        }
        return files_;
    }

    function isJS (name) {
        return name.indexOf(".js") === (name.length -3) || name.indexOf(".json") === (name.length -5);
    }
}

module.exports = FileUtils;