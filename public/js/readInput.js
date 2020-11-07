const fs = require("fs");

let rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

function readInput(filePath) {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            throw err
        };
        let lines = data.split("\n");
        let turn = lines[0].replace("\r", "");
        let positions = lines[1].replace("\r", "").split(",");

        let input = [turn, positions];
        // console.log([turn, positions]);
        // return [turn, positions];
        return input;
    })
}

console.log(readInput("./Test1.input"));