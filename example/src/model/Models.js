
// No configuration needed to inject the dependencies, the names in the constructor is enough
// The names must match the file name in case of JSON files and the class name in case of functions
// like this one.
function Models (Users, Messages) {
    
    this.users = Users;

    this.messages = Messages;
}

// Exporting the class function
module.exports = Models;
