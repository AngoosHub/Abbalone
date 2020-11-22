const positionValues = {
    "A1": 2,
    "A2": 2,
    "A3": 2,
    "A4": 2,
    "A5": 2,
    "B1": 2,
    "B2": 4,
    "B3": 4,
    "B4": 4,
    "B5": 4,
    "B6": 2,
    "C1": 2,
    "C2": 4,
    "C3": 6,
    "C4": 6,
    "C5": 6,
    "C6": 4,
    "C7": 2,
    "D1": 2,
    "D2": 4,
    "D3": 6,
    "D4": 8,
    "D5": 8,
    "D6": 6,
    "D7": 4,
    "D8": 2,
    "E1": 2,
    "E2": 4,
    "E3": 6,
    "E4": 8,
    "E5": 10,
    "E6": 8,
    "E7": 6,
    "E8": 4,
    "E9": 2,
    "F2": 2,
    "F3": 4,
    "F4": 6,
    "F5": 8,
    "F6": 8,
    "F7": 6,
    "F8": 4,
    "F9": 2,
    "G3": 2,
    "G4": 4,
    "G5": 6,
    "G6": 6,
    "G7": 6,
    "G8": 4,
    "G9": 2,
    "H4": 2,
    "H5": 4,
    "H6": 4,
    "H7": 4,
    "H8": 4,
    "H9": 2,
    "I5": 2,
    "I6": 2,
    "I7": 2,
    "I8": 2,
    "I9": 2
}
const board2DArray = [
    ['a1', 'a2', 'a3', 'a4', 'a5'],
    ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'],
    ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'],
    ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8'],
    ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9'],
    ['f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9'],
    ['g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9'],
    ['h4', 'h5', 'h6', 'h7', 'h8', 'h9'],
    ['i5', 'i6', 'i7', 'i8', 'i9']
]

let projectedMaxScore = 0,
    projectedMinScore = 0,
    currMax = Number.MIN_SAFE_INTEGER,
    currMin = Number.MAX_SAFE_INTEGER;

function futureStateGenerator(gameBoard, maxPlayer) {
    let cur = [];
    let next = [];
    let bMarbles = [],
        wMarbles = [];
    let turn = maxPlayer ? 'b' : 'w';
    for (let i = 0; i < gameBoard.length; i++) {
        let cellID = gameBoard[i].substring(0, 2);
        let team = gameBoard[i].substring(2, 3);
        if (team == 'b') {
            bMarbles.push(cellID)
        } else {
            wMarbles.push(cellID)
        }
    }
    let currentMarbles = turn === 'b' ? bMarbles : wMarbles;
    let oppositeMarbles = turn === 'b' ? wMarbles : bMarbles;
    let emptyLoc = []
    for(let i =0; i<allBoard.length;i++) {
        if(!bMarbles.includes(allBoard[i]) && !wMarbles.includes(allBoard[i])) {
            emptyLoc.push(allBoard[i]);
        }
    }
    emptyLoc.push("a0", "a6", "b0", "b7", "c0", "d0", "e0", "f1", "g1", "g2", "h1", "h2", "h3", "i1", "i2", "i3", "i4", "c8", "d9")
    for (let i = 0; i < currentMarbles.length; i++) {
        cur = getAdjacent(currentMarbles[i]);
    }
    for (let i = 0; i < oppositeMarbles.length; i++) {
        next = getAdjacent(oppositeMarbles[i]);
    }
    for (let i = 0; i < emptyLoc.length; i++) {
        next = getAdjacent(emptyLoc[i]);
    }
    return move(cur, next, currentMarbles, oppositeMarbles, true);
}

let transpositionTable = {};
let bestBoard_MIN;
let bestBoard_MAX;
let parentBoard;
const UPPERBOUND = "UPPERBOUND";
const LOWERBOUND = "LOWERBOUND";
const EXACT = "EXACT";

function alphaBetaMiniMax(gameBoard, depth, alpha, beta, maxPlayer) {
    let agentsTimeTicker = document.getElementById("p2-time");
    let displayTime = Math.floor((timeStampEnd - (new Date().getTime()) / 1000));
    agentsTimeTicker.innerHTML = displayTime;
    if (new Date().getTime() < timeStampEnd) {
        displayTime = Math.floor((timeStampEnd - (new Date().getTime()) / 1000));;
        agentsTimeTicker.innerHTML = displayTime
        // Start Retrieve from transposition table.
        let TTKey = gameBoard.join(","); // assuming gameBoard in format: ["A4w","A3w", ...]
        if (transpositionTable.hasOwnProperty(TTKey) && transpositionTable[TTKey].depth >= depth) {
            let TTEntry = transpositionTable[TTKey];
            if (TTEntry.flag == EXACT) {
                return [TTEntry.value, gameBoard];
            } else if (TTEntry.flag == LOWERBOUND) {
                alpha = Math.max(alpha, TTEntry.value);
            } else if (TTEntry.flag = UPPERBOUND) {
                beta = Math.min(beta, TTEntry.value);
            }

            if (alpha >= beta) {
                return [TTEntry.value, gameBoard];
            }
        }
        // End Retrieve.

        let gameOver = testEndGame(gameBoard);
        if (depth == 0 || gameOver) {
            let value = heuristicHandler(gameBoard);
            // Start Store into transposition table.
            let TTEntry = {
                value: value,
                depth: depth
            };
            if (value <= alpha) {
                TTEntry.flag = UPPERBOUND;
            } else if (value >= beta) {
                TTEntry.flag = LOWERBOUND;
            } else
                TTEntry.flag = EXACT;
            transpositionTable[TTKey] = TTEntry;
            // End Store.
            return [value, gameBoard];
        }

        let resultingMoves = futureStateGenerator(gameBoard, maxPlayer);
        let resultingBoardsUnordered = boardOutput(resultingMoves[0], resultingMoves[1], gameBoard)[1];
        // Start Dynamic Move Ordering (Attempt).
        let sortBoards = []
        resultingBoardsUnordered.forEach(board => {
            if (new Date().getTime() < timeStampEnd) {
                displayTime = Math.floor((timeStampEnd - (new Date().getTime()) / 1000));
                agentsTimeTicker.innerHTML = displayTime;
                let score = alphaBetaMiniMax(board, 0, alpha, beta, maxPlayer);
                sortBoards.push({
                    board: score[1],
                    score: score[0]
                });
            }
        });
        // console.log(sortBoards)
        if (maxPlayer && depth >= (maxDepth - 3)) {
            sortBoards.sort(compareMax);
        } else if (!maxPlayer && depth >= (maxDepth - 3)) {
            sortBoards.sort(compareMin);
        }

        let resultingBoards = sortBoards.map(item => item.board);
        // End Dynamic Move Ordering.
        // console.log(resultingBoards)

        let value;
        if (maxPlayer) {
            if (new Date().getTime() < timeStampEnd) {
                displayTime = Math.floor((timeStampEnd - (new Date().getTime()) / 1000));
                agentsTimeTicker.innerHTML = displayTime;
                value = Number.MIN_SAFE_INTEGER;
                for (let i = 0; i < resultingBoards.length; i++) {
                    if (new Date().getTime() >= timeStampEnd) break;
                    let board = resultingBoards[i];
                    if (depth == maxDepth && bestBoard_MAX == undefined) {
                        bestBoard_MAX = board;
                        console.log(bestBoard_MAX)
                    }
                    let t_val = alphaBetaMiniMax(board, depth - 1, alpha, beta, false)
                    if (new Date().getTime() < timeStampEnd) {
                        displayTime = Math.floor((timeStampEnd - (new Date().getTime()) / 1000));
                        agentsTimeTicker.innerHTML = displayTime;
                        if (value < t_val[0]) {
                            value = t_val[0];
                        }
                        if (value > alpha && depth == maxDepth) {
                            alpha = value;
                            console.log(bestBoard_MAX)
                            bestBoard_MAX = board;
                        }
                        alpha = Math.max(alpha, value);
                        if (alpha >= beta) {
                            break;
                        };
                    }
                }
            }
        } else {
            if (new Date().getTime() < timeStampEnd) {
                displayTime = Math.floor((timeStampEnd - (new Date().getTime()) / 1000));
                agentsTimeTicker.innerHTML = displayTime;
                value = Number.MAX_SAFE_INTEGER;
                for (let i = 0; i < resultingBoards.length; i++) {
                    if (new Date().getTime() > timeStampEnd) break;
                    let board = resultingBoards[i];
                    if (depth == maxDepth && bestBoard_MIN == undefined) {
                        bestBoard_MIN = board;
                        console.log(bestBoard_MIN)
                    }
                    let t_val = alphaBetaMiniMax(board, depth - 1, alpha, beta, true)
                    if (new Date().getTime() < timeStampEnd) {
                        displayTime = Math.floor((timeStampEnd - (new Date().getTime()) / 1000));
                        agentsTimeTicker.innerHTML = displayTime;
                        if (value > t_val[0]) {
                            value = t_val[0];
                        }
                        if (value < beta && depth == maxDepth) {
                            beta = value;
                            console.log(bestBoard_MIN)
                            bestBoard_MIN = board;
                        }
                        beta = Math.min(beta, value);
                        if (beta <= alpha) {
                            break;
                        };
                    }
                }
            }
        };

        // Start Store into transposition table.
        let TTEntry = {
            value: value,
            depth: depth
        };
        if (value <= alpha) {
            TTEntry.flag = UPPERBOUND;
        } else if (value >= beta) {
            TTEntry.flag = LOWERBOUND;
        } else
            TTEntry.flag = EXACT;
        transpositionTable[TTKey] = TTEntry;
        // End Store.
        return [value, (maxPlayer) ? bestBoard_MAX : bestBoard_MIN];
    }
};

function testEndGame(gameBoard) {
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
            nodeScore += positionValues[cell.toUpperCase()];

            if (h_count < 0) h_count = 0;
            h_count++;
            if (h_count > 2) {
                nodeScore += 1;
            } else if (h_count > 1) {
                nodeScore += 1;
            }
        } else {
            nodeScore -= positionValues[cell.toUpperCase()];
            if (h_count > 0) h_count = 0;
            h_count--;
            if (h_count < -2) {
                nodeScore -= 1;
            } else if (h_count < -1) {
                nodeScore -= 1;
            }
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

// Orders ascending for Min player
function compareMin(a, b) {
    if (a.score < b.score) {
        return -1;
    }
    if (a.score > b.score) {
        return 1;
    }
    return 0;
}

// Orders descending for Max player
function compareMax(a, b) {
    if (a.score < b.score) {
        return 1;
    }
    if (a.score > b.score) {
        return -1;
    }
    return 0;
}