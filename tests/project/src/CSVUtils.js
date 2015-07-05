/*
 * Convert a CSV String to JSON
 */
module.exports = function() {
    return function(csvString, csvColumns) {
        var json = [];
        var csvArray = csvString.split("\n");

        // Remove the column names from csvArray into csvColumns.
        // Also replace single quote with double quote (JSON needs double).
        if(!csvColumns){
            var csvColumns = JSON
                .parse("[" + csvArray.shift().replace(/'/g, '"') + "]");
        }

        csvArray.forEach(function(csvRowString) {

            var csvRow = csvRowString.split(",");

            // Here we work on a single row.
            // Create an object with all of the csvColumns as keys.
            jsonRow = new Object();
            for ( var colNum = 0; colNum < csvRow.length; colNum++) {
                // Remove beginning and ending quotes since stringify will add them.
                var colData = csvRow[colNum].replace(/^['"]|['"]$/g, "");
                jsonRow[csvColumns[colNum]] = colData;
            }
            json.push(jsonRow);
        });
        return json;
    };
};

module.exports.className = "CSVUtils";