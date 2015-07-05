
// You should require node-dependency
var statupMethod = require('node-dependency');

/* 
 *  The returned value is a function which take 1 parameters: rootFolder
 *  After that node-dependency will read your source folder and load all your classes
 *  and instantiate the class named ProjectBootstrap, this file can be anywhere inside
 *  your source folder
 */
statupMethod(__dirname);