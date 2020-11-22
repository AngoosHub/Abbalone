
/* Given: (from ai-algorithm file)
    - Arrays of moveNotations 
        - resultsInline
        - resultsSideStep
    - Input file to generate starting positions
        - inputFile

This function will generate an array of resulting board configurations for output file. */
function boardOutput(resultsI, resultsSS, inputBoard) {
    let currentBoard;
    if (!inputBoard) {
        currentBoard = getCurrentBoard2();
    } else {
        currentBoard = getCurrentBoardFromInput(inputBoard);
        // currentBoard = getCurrentBoard2();
    }
    let moveConfigOutputFile = [];
    let boardConfigOutputFile = [];
    // console.log(currentBoard);
    resultsI.forEach(inline_move => {
        if (inline_move.includes("-")) {
            let newBoard = generateBoardConfigurationFromMove(currentBoard, inline_move);
            // let resultString = transformBoardToOutputLine(newBoard);
            let resultArray= transformBoardToArray(newBoard);

            if (boardConfigOutputFile.indexOf(newBoard) == -1) {
                boardConfigOutputFile.push(resultArray);
                moveConfigOutputFile.push(inline_move);
            }
        }
    });

    resultsSS.forEach(sidestep_move => {
        if (sidestep_move.includes("-")) {
            let newBoard = generateBoardConfigurationFromMove(currentBoard, sidestep_move);
            // let resultString = transformBoardToOutputLine(newBoard);
            // console.log(newBoard);
            let resultArray= transformBoardToArray(newBoard);
            
            if (boardConfigOutputFile.indexOf(newBoard) == -1) {
                boardConfigOutputFile.push(resultArray);
                moveConfigOutputFile.push(sidestep_move);
            }
        }
    });

    // console.log("---- START OF BOARD OUTPUT ----");
    // console.log(moveConfigOutputFile);
    // console.log(boardConfigOutputFile);
    // console.log("---- END OF BOARD OUTPUT ----");
    let boardConfigOutputFileUppercase = []
    for (let i = 0; i < boardConfigOutputFile.length; i++) {
        let result = boardConfigOutputFile[i];
        let resultUpper = [];
        for( let j = 0; j < result.length; j++) {
            resultUpper.push(result[j].substring(0,1).toUpperCase() + result[j].substring(1));
        }
        boardConfigOutputFileUppercase.push(resultUpper);
    }
    // downloadFile(fileName.replace("input", "move"), moveConfigOutputFile.join("\n"));
    // downloadFile(fileName.replace("input", "board"), boardConfigOutputFileUppercase.join("\n"));
    
    return [moveConfigOutputFile, boardConfigOutputFile];
}

function downloadFile(filename, text) {
    let downloader = document.createElement('a');
    downloader.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    downloader.setAttribute('download', filename);

    downloader.style.display = 'none';
    document.body.appendChild(downloader);

    downloader.click();

    document.body.removeChild(downloader);
}

/* Generate the current board from input file */
function generateCurrentBoardLayout(boardInput) {
    // make empty board.
    let currentBoard = {};
    allBoard.forEach(element => currentBoard[element] = "");

    // add in marbles from input file.
    const boardInputLowercase = boardInput.map(item => item.toLowerCase());
    boardInputLowercase.forEach(element => {
        let id = element.substring(0, 2);
        let color = element.substring(2);
        currentBoard[id] = color;
    });

    return currentBoard;
}

function getCurrentBoard() {
    let currentBoard = []
    for (let i = 0; i < 14; i++) {
        if (marblesP1[i] && !marblesP1[i].dropped) { // if the marble has not been dropped
            let marble = marblesP1[i];
            let cellID = marble.coordinate;
            let team = marble.player;
            currentBoard.push(cellID + team);
        }
        if (marblesP2[i] && !marblesP2[i].dropped) {
            let marble = marblesP2[i];
            let cellID = marble.coordinate;
            let team = marble.player;
            currentBoard.push(cellID + team);
        }
    }
    return currentBoard;
}

function getCurrentBoard2() {
    // make empty board.
    let currentBoard = {};
    allBoard.forEach(element => currentBoard[element] = "");

    // add in marbles from input file.
    // const boardInputLowercase = boardInput.map(item => item.toLowerCase());
    // boardInputLowercase.forEach(element => {
    //     let id = element.substring(0, 2);
    //     let color = element.substring(2);
    //     currentBoard[id] = color;
    // });

    for (let i = 0; i < 14; i++) {
        if (marblesP1[i] && !marblesP1[i].dropped) { // if the marble has not been dropped
            let marble = marblesP1[i];
            let cellID = marble.coordinate;
            let team = marble.player;
            currentBoard[cellID] = team;
        }
        
    }
    for(let i =0; i<marblesP2.length;i++) {
        if (!marblesP2[i].dropped) {
            let marble = marblesP2[i];
            let cellID = marble.coordinate;
            let team = marble.player;
            currentBoard[cellID] = team;
        }
    }
    // console.log(currentBoard)
    return currentBoard;
}

function getCurrentBoardFromInput(inputBoard) {
    // make empty board.
    let currentBoard = {};
    allBoard.forEach(element => currentBoard[element] = "");

    // add in marbles from inputBoard array.
    const inputBoardLowercase = inputBoard.map(item => item.toLowerCase());
    inputBoardLowercase.forEach(element => {
        let id = element.substring(0, 2);
        let color = element.substring(2);
        currentBoard[id] = color;
    });

    return currentBoard;
}


/* Generate a resulting board after performing given move on current board. */
/* IMPORTANT - This function assumes given move is legal. */
function generateBoardConfigurationFromMove(board, inputMove) {
    const sidestep = "s";
    const inline = "i";
    const drop = "DROP";
    let currentBoard = JSON.parse(JSON.stringify(board));
    // console.log(currentBoard);
    let moveInfo = inputMove.split("-");
    let moveType = moveInfo[0];
    let direction = moveInfo[moveInfo.length-1];
    
    // console.log(adjacentInfo);
    // Side step loop will move each marble towards direction.
    if (moveType == sidestep) {
     if (moveInfo.length == 3) {
            let marble_id = moveInfo[1];
            let result = calculateDirectionResultId(marble_id, direction);

            if (result != drop) {
                currentBoard[result] = currentBoard[marble_id];
            }
            currentBoard[marble_id] = "";
        }
        else {
            let marble_id_first = moveInfo[1];
            let marble_id_third = moveInfo[2];
            
            let result1 = calculateDirectionResultId(marble_id_first, direction);
            let result3 = calculateDirectionResultId(marble_id_third, direction);

            if (result1 != drop) {
                currentBoard[result1] = currentBoard[marble_id_first];
            }
            if (result3 != drop) {
                currentBoard[result3] = currentBoard[marble_id_third];
            }
            currentBoard[marble_id_first] = "";
            currentBoard[marble_id_third] = "";    
            
            if (!adjacentInfo[marble_id_first].includes(marble_id_third)) {
                let marble_id_second = findMiddleMarble(marble_id_first, marble_id_third);
                // console.log("!!!!"+marble_id_first);
                // console.log("!!!!"+marble_id_third);
                // console.log("!!!!"+marble_id_second);
                let result2 = calculateDirectionResultId(marble_id_second, direction);
                if (result2 != drop) {
                    currentBoard[result2] = currentBoard[marble_id_second];
                }
                currentBoard[marble_id_second] = "";
            }
           
        }
    }
    // Inline loop starts at marble furthest back in the group of the direction moving, 
    // and recursively push all marbles infront of it forward.
    else if (moveType == inline) {
        // console.log(inputMove);
        // console.log(adjacentInfo)
        let marble_id = moveInfo[1]; //a3
        // console.log(moveInfo);
        // console.log(moveInfo.length);
        // console.log(currentBoard);
        if (direction == 5 || direction == 7 || direction == 9) {
            marble_id == moveInfo[moveInfo.length - 2];
        }

        let inlineMove = function inlineMoveRecursive(marble_id_R) {
            let result = calculateDirectionResultId(marble_id_R, direction);
            
            if (result != drop) {
                if (currentBoard[result] != "") {
                    inlineMoveRecursive(result);
                }
                currentBoard[result] = currentBoard[marble_id_R];
            }
            currentBoard[marble_id_R] = "";
        }

        inlineMove(marble_id);
    }

    return currentBoard;
}

function findMiddleMarble(firstNode, thirdNode) {
    let first = getAdjacent(firstNode, true)
    for(let i =0; i<6;i++) {
        let firstN = first[i], firstNNeighbour = getAdjacent(firstN, true)[i];
        if(firstNNeighbour == thirdNode) {
            return firstN;
        }
    }
}
/* Takes a board array and writes it into string of marbles for output file. */
function transformBoardToOutputLine(board) {   
    let resultString = [];
    // console.log(board);
    // console.log(Object.entries(board))
    for (const [marble_id, color] of Object.entries(board)) {
        if (color != "") {
            resultString.push(color + marble_id);
        }
    }

    resultString.sort();

    let sortedResults = [];

    resultString.forEach(result => {
        sortedResults.push(result.substring(1).toUpperCase() + result.substring(0,1));
    });

    return sortedResults.join(",");
}


function transformBoardToArray(board) {   
    let resultString = [];
    // console.log(board);
    // console.log(Object.entries(board))
    for (const [marble_id, color] of Object.entries(board)) {
        if (color != "") {
            resultString.push(color + marble_id);
        }
    }

    resultString.sort();

    let sortedResults = [];

    resultString.forEach(result => {
        sortedResults.push(result.substring(1) + result.substring(0,1));
    });

    // console.log(sortedResults);
    return sortedResults;
}


/* Moves a marble in a direction, and returns the resulting destination. */
function calculateDirectionResultId(marble_id, direction) {
    const drop = "DROP";
    const sumReducer = (accumulator, currentValue) => accumulator + currentValue;
    let id = marble_id;
    let newCoords = [];

    // Transforms marble location into 2-D coordiates for movement calculation.
    let parsedCoord = board_lookup_id[id].split(",");
    for (let i=0; i<parsedCoord.length; i++) {
        newCoords[i] = +parsedCoord[i] + directions[direction.toString()][i];
    }

    // Check if marble has gone off edge of board.
    let validate = newCoords.reduce(sumReducer, 0);
    if (validate > 4 || validate < -4 || newCoords.some(x => x > 4 || x < -4)) {
        return drop;
    }

    return board_lookup_coord[newCoords.join(",")];
}


/* Table for marble direction movement along 2-D array. */
const directions = {
    1: [1,-1],
    3: [1,0],
    5: [0,1],
    7: [-1,1],
    9: [-1,0],
    11:[0,-1]
}


/* Look up tables for: board location ID to 2-D coordinates. */
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

