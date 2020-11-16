const positionValues = {
                "A1": 2, "A2": 2, "A3": 2, "A4": 2, "A5": 2,
            "B1": 2, "B2": 4, "B3": 4, "B4": 4, "B5": 4, "B6": 2,
        "C1": 2, "C2": 4, "C3": 6, "C4": 6, "C5": 6, "C6": 4, "C7": 2,
    "D1": 2, "D2": 4, "D3": 6, "D4": 8, "D5": 8, "D6": 6, "D7": 4, "D8": 2,
"E1": 2, "E2": 4, "E3": 6, "E4": 8, "E5": 10, "E6": 8, "E7": 6, "E8": 4, "E9": 2,
    "F2": 2, "F3": 4, "F4": 6, "F5": 8, "F6": 8, "F7": 6, "F8": 4, "F9": 2,
        "G3": 2, "G4": 4, "G5": 6, "G6": 6, "G7": 6, "G8": 4, "G9": 2,
            "H4": 2, "H5": 4, "H6": 4, "H7": 4, "H8": 4, "H9": 2,
                "I5": 2, "I6": 2, "I7": 2, "I8": 2, "I9": 2
}
const board2DArray = [
    ['a1','a2','a3','a4','a5'],
    ['b1','b2','b3','b4','b5','b6'],
    ['c1','c2','c3','c4','c5','c6','c7'],
    ['d1','d2','d3','d4','d5','d6','d7','d8'],
    ['e1','e2','e3','e4','e5','e6','e7','e8','e9'],
    ['f2','f3','f4','f5','f6','f7','f8','f9'],
    ['g3','g4','g5','g6','g7','g8','g9'],
    ['h4','h5','h6','h7','h8','h9'],
    ['i5','i6','i7','i8','i9']
]

let projectedMaxScore = 0,
    projectedMinScore = 0,
    currMax = Number.MIN_SAFE_INTEGER,
    currMin = Number.MAX_SAFE_INTEGER;

function aiDecisionStart() {
    let currBoard = generateCurrentBoardLayout();
    let arr = boardOutput();
    let moveNotes = arr[0];
    let boardResults = arr[1];
    let nodeDepth = 0; 

    let bestMove = alphaBetaSearch(currBoard);
}

// function alphaBetaSearch(currBoard) {
//     let v = maxValue(currBoard, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
// }

// function maxValue(v, node, alpha, beta, depth) {
//     if (checkTerminal()) {
//         // return node; maybe v aswell
//         return v;
//     }

//     let children = boardOutput(node);
//     let childScores = [];

//     for (let i = 0; i < children.length; i++) { // loop thru all nodes of parent node, terminate if worse
//         // get the score of all potential board layouts
//         childScores.push(heuristicHandler(children[i]));
//     }
//     if (depth < 4) {
//         // sort the nodes according to childScores

//     }


//     // HOW DO I RETURN THE SCORE? lol
//     let maxIndex = 0;
//     for (let i = 0; i < children.length; i++) {
//         let childNodeScore = minValue(children[i], alpha, beta, depth + 1);
//         if (v > childNodeScore) {
//             v = childNodeScore;
//         }
//     }
//     return v;
// }

// function minValue(node, alpha, beta, depth) {
//     if (checkTerminal()) {
//         return node;
//     }

// }

function futureStateGenerator(gameBoard, maxPlayer) {
    let cur = [];
    let next = [];
    let bMarbles = [], wMarbles = [];
    let turn = maxPlayer ? 'b' : 'w';
    for (let i = 0; i < gameBoard.length; i++) {
        let cellID = gameBoard[i].substring(0,2);
        let team = gameBoard[i].substring(2, 3);
        if (team == 'b') {
            bMarbles.push(cellID)
        } else {
            wMarbles.push(cellID)
        }
    }
    currentMarbles = turn==='b'? bMarbles:wMarbles;
    oppositeMarbles = turn ==='b'? wMarbles:bMarbles;
    
    for(let i =0; i<currentMarbles.length;i++) {
        cur =getAdjacent(currentMarbles[i]);
    }
    for(let i =0; i<oppositeMarbles.length;i++) {
        next =getAdjacent(oppositeMarbles[i]);
    }
    for(let i =0; i<emptyLocation.length;i++) {
        next =getAdjacent(emptyLocation[i]);
    }
    return move(cur, next, true);
}

function alphaBetaMiniMax(gameBoard, depth, alpha, beta, maxPlayer) {
    let gameOver = testEndGame(gameBoard);
    console.log(gameOver)
    if (depth == 0 || gameOver) {
        // return heuristicHandler(gameBoard);
        return gameBoard;
    }
    let value;
    let resultingMoves = futureStateGenerator(gameBoard, maxPlayer);
    // console.log(resultingMoves)
    let resultingBoards = boardOutput(resultingMoves[0], resultingMoves[1], gameBoard)[1];
    if (maxPlayer) {
        value = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < resultingBoards.length; i++) {
            let board = resultingBoards[i];
            value = Math.max(value, alphaBetaMiniMax(board, depth - 1, alpha, beta, false));
            alpha = Math.max(alpha, value);
            if (alpha >= beta) {
                break;
            };
        }
        // resultingBoards.forEach(board => {
            
        // });
        return value;
    } else {
        value = Number.POSITIVE_INFINITY;
        for (let i = 0; i < resultingBoards.length; i++) {
            let board = resultingBoards[i];
            value = Math.min(value, alphaBetaMiniMax(board, depth - 1, alpha, beta, true));
            beta = Math.min(beta, value);
            if (beta <= alpha) {
                break;
            };
        }
        // resultingBoards.forEach(board => {
            
        // });
        return value;
    };
};

function testEndGame(gameBoard) {
    // console.log(gameBoard);
    // let gamePieces = gameBoard.split(",");
    let blackPieces = 0;
    let whitePieces = 0;
    gameBoard.forEach(piece => {
        let pieceColour = piece.substring(2, 3);
        if (pieceColour == "b") {
            blackPieces++;
        } else {
            whitePieces++;
        }
    })
    if (blackPieces <= 8 || whitePieces <= 8) {
        return true;
    } else {
        return false;
    }
}

function heuristicHandler(board) {
    return boardScore(board);
}


// black is MAX, white is MIN
function boardScore(board) {
    let nodeScore = 0;
    for (let i = 0; i < board.length; i++) {
        let cell = board[i].substring(0, 2);
        let team = board[i].substring(2, 3);

        // Heuristic 1: board score
        // Heuristic 2: 2/3 in a row (horizontal)
        let h_count = 0;
        if (team == 'b') {
            nodeScore += positionValues[cell];

            if (h_count < 0) h_count = 0;
            h_count++;
            if (h_count > 2) { nodeScore += 1; } 
            else if (h_count > 1) { nodeScore += 1; }
        }
        else {
            nodeScore -= positionValues[cell];
            if (h_count > 0) h_count = 0;
            h_count--;
            if (h_count < -2) { nodeScore -= 1; } 
            else if (h_count < -1) { nodeScore -= 1; }
        }

        // Heuristic 3: 2/3 in a row + number of neighbours
        let neighbours = getAdjacent(cell.toLowerCase(), true);
        for (let j = 0; j < neighbours.length; j++) {
            if (board.includes(neighbours[j] + 'b') || board.includes(neighbours[j] + 'w')) {
                if (team == 'b') nodeScore += 1; 
                else nodeScore -= 1;
            } 
        }
    }
    return nodeScore
}