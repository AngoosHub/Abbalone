
const board_lookup_id = {
    a1:"-4,4",
    a2:"-3,4",
    a3:"-2,4",
    a4:"-1,4",
    a5:"0,4",
    b1:"-4,3",
    b2:"-3,3",
    b3:"-2,3",
    b4:"-1,3",
    b5:"0,3",
    b6:"1,3",
    c1:"-4,2",
    c2:"-3,2",
    c3:"-2,2",
    c4:"-1,2",
    c5:"0,2",
    c6:"1,2",
    c7:"2,2",
    d1:"-4,1",
    d2:"-3,1",
    d3:"-2,1",
    d4:"-1,1",
    d5:"0,1",
    d6:"1,1",
    d7:"2,1",
    d8:"3,1",
    e1:"-4,0",
    e2:"-3,0",
    e3:"-2,0",
    e4:"-1,0",
    e5:"0,0",
    e6:"1,0",
    e7:"2,0",
    e8:"3,0",
    e9:"4,0",
    f2:"-3,-1",
    f3:"-2,-1",
    f4:"-1,-1",
    f5:"0,-1",
    f6:"1,-1",
    f7:"2,-1",
    f8:"3,-1",
    f9:"4,-1",
    g3:"-2,-2",
    g4:"-1,-2",
    g5:"0,-2",
    g6:"1,-2",
    g7:"2,-2",
    g8:"3,-2",
    g9:"4,-2",
    h4:"-1,-3",
    h5:"0,-3",
    h6:"1,-3",
    h7:"2,-3",
    h8:"3,-3",
    h9:"4,-3",
    i5:"0,-4",
    i6:"1,-4",
    i7:"2,-4",
    i8:"3,-4",
    i9:"4,-4"
}

const board_lookup_coord = {
    "-4,4":"a1",
    "-3,4":"a2",
    "-2,4":"a3",
    "-1,4":"a4",
    "0,4":"a5",
    "-4,3":"b1",
    "-3,3":"b2",
    "-2,3":"b3",
    "-1,3":"b4",
    "0,3":"b5",
    "1,3":"b6",
    "-4,2":"c1",
    "-3,2":"c2",
    "-2,2":"c3",
    "-1,2":"c4",
    "0,2":"c5",
    "1,2":"c6",
    "2,2":"c7",
    "-4,1":"d1",
    "-3,1":"d2",
    "-2,1":"d3",
    "-1,1":"d4",
    "0,1":"d5",
    "1,1":"d6",
    "2,1":"d7",
    "3,1":"d8",
    "-4,0":"e1",
    "-3,0":"e2",
    "-2,0":"e3",
    "-1,0":"e4",
    "0,0":"e5",
    "1,0":"e6",
    "2,0":"e7",
    "3,0":"e8",
    "4,0":"e9",
    "-3,-1":"f2",
    "-2,-1":"f3",
    "-1,-1":"f4",
    "0,-1":"f5",
    "1,-1":"f6",
    "2,-1":"f7",
    "3,-1":"f8",
    "4,-1":"f9",
    "-2,-2":"g3",
    "-1,-2":"g4",
    "0,-2":"g5",
    "1,-2":"g6",
    "2,-2":"g7",
    "3,-2":"g8",
    "4,-2":"g9",
    "-1,-3":"h4",
    "0,-3":"h5",
    "1,-3":"h6",
    "2,-3":"h7",
    "3,-3":"h8",
    "4,-3":"h9",
    "0,-4":"i5",
    "1,-4":"i6",
    "2,-4":"i7",
    "3,-4":"i8",
    "4,-4":"i9"
}

const directions = {
    1: [1,-1],
    3: [1,0],
    5: [0,1],
    7: [-1,1],
    9: [-1,0],
    11:[0,-1]
}

function calculateDirectionResultId(marble_id, direction) {
    const sumReducer = (accumulator, currentValue) => accumulator + currentValue;
    let id = marble_id;
    let newCoords = [];
    let parsedCoord = board_lookup_id[id].split(",");

    for (let i=0; i<parsedCoord.length; i++) {
        newCoords[i] = +parsedCoord[i] + directions[direction.toString()][i];
    }

    // Check if marble has got off edge of board.
    let validate = newCoords.reduce(sumReducer, 0);
    if (validate > 4 || validate < -4) {
        return "Drop";
    }

    return board_lookup_coord[newCoords.join(",")];
}


class Marble {
    constructor(id, color) {
        this.id = id;
        this.color = color;
    }

    getId() {
        return this.id;
    }

    getColor() {
        return this.color;
    }
}


class Board  {
    constructor() {
        this.board = {};
        this.currentColor = "w";

        for (let key in board_lookup_id) {
            if (board_lookup_id.hasOwnProperty(key)) {
                // console.log(key + " -> " + p[key]);
                this.board[key] = "";
            }
        }
    }

    addBoardPiece(id, marble) {
        this.board[id] = marble;
    }

    getBoardItem(n) {
        return this.board[n];
    }
}


class Rule {
    constructor(board, turn) {
        this.board = board;
        this.turn = turn;
    }

    readInput(board, turn) {

    }
}


$(document).ready(function() {
    // testDirectionResults();
    // setup();
    setupVer2();
});


function setupVer2() {
    const   defStartP1 = ["a1", "a2", "a3", "a4", "a5", "b1", "b2", 
                    "b3", "b4", "b5", "b6", "c3", "c4", "c5"],      
            defStartP2 = ["i5", "i6", "i7", "i8", "i9", "h4", "h5",
                    "h6", "h7", "h8", "h9", "g5", "g6", "g7"],      
            BDStartP1 = ["i8", "i9", "h7", "h8", "h9", "g7", "g8",
                    "c2", "c3", "b1", "b2", "b3", "a1", "a2"],      
            BDStartP2 = ["i5", "i6", "h4", "h5", "h6", "g4", "g5",
                    "c5", "c6", "b4", "b5", "b6", "a4", "a5"],      
            GDStartP1 = ["h8", "h9", "g7", "g8", "g9", "f7", "f8",
                    "b1", "b2", "c1", "c2", "c3", "d2", "d3"],      
            GDStartP2 = ["h4", "h5", "g3", "g4", "g5", "f3", "f4",
                    "b5", "b6", "c5", "c6", "c7", "d6", "d7"];      

    let layoutSelection = 0;
    let board = new Board();
    let play1 = "w";
    let play2 = "b";
    let play1Layout;
    let play2Layout;

    // Set layout variables.
    switch(layoutSelection) {
        case 1:
            play1Layout = BDStartP1;
            play2Layout = BDStartP2;
            break;
        case 2:
            play1Layout = GDStartP1;
            play2Layout = GDStartP2;
            break;
        default:
            play1Layout = defStartP1;
            play2Layout = defStartP2;
        }
    
    // Initialize board pieces with layout.
    for (let i=0; i<play1Layout.length; i++) {
        let id = play1Layout[i];
        let marble = new Marble(id, play1);
        board.addBoardPiece(id, marble);
    }
    for (let i=0; i<play2Layout.length; i++) {
        let id = play2Layout[i];
        let marble = new Marble(id, play2);
        board.addBoardPiece(id, marble);
    }

    getSingleMarbleMoves(board);
}


function getSingleMarbleMoves(board) {
    // let board = board;
    let bLength = board.board.length;
    let results = [];

    for (let key in board.board) {
        if (!board_lookup_id.hasOwnProperty(key)) {
            throw "oh no board entry missing key ->" + key;
        }

        let marble = board.board[key];

        if (marble == "") {
            continue; //check if empty
        }

        for (let j=1;j<12; j+=2) {
            let val = calculateDirectionResultId(board.getBoardItem(i).getId(), j);
            let found = false;

            for(var k = 0; k < bLength; k++) {
                if (board.getBoardItem(k).getId() == val) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                results.push(val+board.getBoardItem(i).getColor());
            }
        }
        
    }

    // for (let i=0; i<bLength; i++) {
    //     for (let j=1;j<12; j+=2) {
    //         let val = calculateDirectionResultId(board.getBoardItem(i).getId(), j);
    //         let found = false;

    //         for(var k = 0; k < bLength; k++) {
    //             if (board.getBoardItem(k).getId() == val) {
    //                 found = true;
    //                 break;
    //             }
    //         }
    //         if (!found) {
    //             results.push(val+board.getBoardItem(i).getColor());
    //         }
    //     }
    // }
    // console.log(results);
}



function testDirectionResults() {
    let testMarbleId = "e5"; // Expect direction results: f6,e6,d5,d4,e4,f5
    let directionReults = "";
    for (let i=1; i<12; i+=2) {
        if (i != 1) {
            directionReults += ",";
        }
        let resultId = calculateDirectionResultId(testMarbleId, i);
        directionReults += resultId;
    }
}


function setup() {

    const   defStartP1 = ["a1", "a2", "a3", "a4", "a5", "b1", "b2", 
                    "b3", "b4", "b5", "b6", "c3", "c4", "c5"],      
            defStartP2 = ["i5", "i6", "i7", "i8", "i9", "h4", "h5",
                    "h6", "h7", "h8", "h9", "g5", "g6", "g7"],      
            BDStartP1 = ["i8", "i9", "h7", "h8", "h9", "g7", "g8",
                    "c2", "c3", "b1", "b2", "b3", "a1", "a2"],      
            BDStartP2 = ["i5", "i6", "h4", "h5", "h6", "g4", "g5",
                    "c5", "c6", "b4", "b5", "b6", "a4", "a5"],      
            GDStartP1 = ["h8", "h9", "g7", "g8", "g9", "f7", "f8",
                    "b1", "b2", "c1", "c2", "c3", "d2", "d3"],      
            GDStartP2 = ["h4", "h5", "g3", "g4", "g5", "f3", "f4",
                    "b5", "b6", "c5", "c6", "c7", "d6", "d7"];      
    
    let w = "w";
    let b = "b";
    let board = new Board(w);
    for (let i=0; i<defStartP1.length; i++) {
        let marble = new Marble(defStartP1[i], b);
        board.addBoardPiece(i, marble);
    }
    for (let i=defStartP1.length; i<defStartP1.length+defStartP2.length; i++) {
        let marble = new Marble(defStartP2[i-defStartP1.length], w);
        board.addBoardPiece(i, marble);
    }

    let results = [];
    let bLength = board.board.length;
    for (let i=0; i<bLength; i++) {
        for (let j=1;j<12; j+=2) {
            let val = calculateDirectionResultId(board.getBoardItem(i).getId(), j);
            let found = false;

            for(var k = 0; k < bLength; k++) {
                if (board.getBoardItem(k).getId() == val) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                results.push(val+board.getBoardItem(i).getColor());
            }
        }
    }
    console.log(results);
}

