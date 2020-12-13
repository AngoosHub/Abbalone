
const   defStartP1 = ["a1", "a2", "a3", "a4", "a5", "b1", "b2", 
                    "b3", "b4", "b5", "b6", "c3", "c4", "c5"],      // Array of coordinates for PLAYER 1's default layout
        defStartP2 = ["i5", "i6", "i7", "i8", "i9", "h4", "h5",
                    "h6", "h7", "h8", "h9", "g5", "g6", "g7"],      // Array of coordinates for PLAYER 2's default layout
        BDStartP1 = ["i8", "i9", "h7", "h8", "h9", "g7", "g8",
                    "c2", "c3", "b1", "b2", "b3", "a1", "a2"],      // Array of coordinates for PLAYER 1's  Belgium Daisy layout
        BDStartP2 = ["i5", "i6", "h4", "h5", "h6", "g4", "g5",
                    "c5", "c6", "b4", "b5", "b6", "a4", "a5"],      // Array of coordinates for PLAYER 2's Belgium Daisy layout
        GDStartP1 = ["h8", "h9", "g7", "g8", "g9", "f7", "f8",
                    "b1", "b2", "c1", "c2", "c3", "d2", "d3"],      // Array of coordinates for PLAYER 1's German Daisy layout
        GDStartP2 = ["h4", "h5", "g3", "g4", "g5", "f3", "f4",
                    "b5", "b6", "c5", "c6", "c7", "d6", "d7"],      // Array of coordinates for PLAYER 2's German Daisy layout
        adjacentDirections = [7, 5, 9, 3, 11, 1], // This array stores the corresponding clock direction according to it's index for the adjacent array
        adjOppositesHigh = [7, 9, 11],
        adjOppositesLow = [1, 3, 5],
        adjOppositeDirections = [1, 11, 3, 9, 5, 7],
        rowOrder = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];


// For 'undo' button

let oldMarblesP1 = [];
let oldMarblesP2 = [];
let oldEmptyLocation = [];
let oldPlayer1Score;
let oldPlayer2Score;
let oldBoard=[];


// GAME VARIABLES
let marblesP1 = [],
    marblesP2 = [],
    themeNo = 0,
    mammaMia = null,
    player1Score = 0,
    player2Score = 0,
    fullHistory = [];  

let layoutInt = 0,
    gameMode = 0,
    turnLimit = 50,
    p1TimeLimit = 5,
    p2TimeLimit = 5,
    blackPlayer = 1,
    whitePlayer = 2;

// TURN-BASED VARIABLES
let currentTurn = 'b',              // b (black) or w (white)
    currentTurnINT = 1,             // Integer representing which players turn it is (1 or 2)
    currentClickSequence = [],      // The marbles clicked for this turn
    clickableCells = [];

window.onload = function() {
    mammaMia = new Audio("../audio/mammamia.mp3");
    layoutInt = localStorage.getItem('layout');
    gameMode = localStorage.getItem('gameMode');
    turnLimit = localStorage.getItem('turnLimit');
    p1TimeLimit = localStorage.getItem('p1TimeLimit');
    p2TimeLimit = localStorage.getItem('p2TimeLimit');
    blackPlayer = localStorage.getItem('blackPlayer');

    if (blackPlayer == 1) {
        currentTurnINT = 1;
    } else if (blackPlayer == 2) {
        whitePlayer = 1;
        currentTurnINT = 2;
    } else {
        currentTurnINT = 1;
    }
    let moveLimits = document.getElementsByClassName("move-limit");
    moveLimits[0].innerHTML = turnLimit;
    moveLimits[1].innerHTML = turnLimit;
    document.getElementById("p1-time").innerHTML = p1TimeLimit;
    document.getElementById("p2-time").innerHTML = p2TimeLimit;
   
 
    initBoard(layoutInt);
    console.log(getCurrentBoard())
    console.log(getCurrentBoard2())
    // oldMarblesP1 = marblesP1;
    // oldMarblesP2 = marblesP2;
    // oldEmptyLocation = emptyLocation;
    // oldPlayer1Score = player1Score;
    // oldPlayer2Score = player2Score;
    // turn();
    // emptyBoard()
    let cells = document.getElementsByClassName("cell");
    for (i = 0; i < cells.length; i++) {
        let cellID = cells[i].id;
        cells[i].addEventListener('click', function() { cellClicked(cellID) } );
    }
}
// function decreaseScore() {
    
//     let id = (player == blackPlayer) ? 'p1c-' + scoreP1 : 'p2c-' + scoreP2;
//     document.getElementById('p2c-1').style.background = resetMarbleColour;
// }
function undo() {  
    let boards = oldBoard;

    marblesP1=[];
    marblesP2=[];
    newMarblesP1=[];
    newMarblesP2=[];
    emptyLocation=[];
    player1Score = oldPlayer1Score
    player2Score = oldPlayer2Score
    for(let i =0; i<boards.length;i++) {
        let location = (boards[i].substring(0, 1)).toLowerCase()+boards[i].substring(1, 2);
        let marbleColor = boards[i].substring(2, 3);
        
        if(marbleColor==='b') {
            let marble1 = createMarble(location, 'b', blackMarbleColour);
            marblesP1.push(marble1)
            newMarblesP1.push(marble1.coordinate);
            document.getElementById(location).style.background=blackMarbleColour;
            document.getElementById(location).classList.add(hasMarbleClass);
            // create a black marble object then add to marblesP1 array
            
        }else {
            let marble1 = createMarble(location, 'w', whiteMarbleColour);
            marblesP2.push(marble1)
            newMarblesP2.push(marble1.coordinate);
            document.getElementById(location).style.background=whiteMarbleColour;
            document.getElementById(location).classList.add(hasMarbleClass);
            // create a black marble object then add to marblesP1 array
            
        }
    }
    // set empty location
    for(let i =0; i<allBoard.length;i++) {
        if(!newMarblesP1.includes(allBoard[i]) && !newMarblesP2.includes(allBoard[i])) {
            emptyLocation.push(allBoard[i]);

        }
    }
    for(let i =0; i<emptyLocation.length;i++) {
        let target = document.getElementById(emptyLocation[i])
        console.log(target)
        if(target.classList.contains(hasMarbleClass)) {
            target.classList.remove(hasMarbleClass);
            target.style.background = emptyCellColour
        }        
    }
    for(let i=1;i<7;i++) {
        let id = "p1c-"+i;
        let id2 = "p1c-"+i;
        document.getElementById(id).style.background = resetMarbleColour;
        document.getElementById(id2).style.background = resetMarbleColour;
    }
    for(let i=0;i<player1Score;i++) {
        let n= i+1;
        let id = "p1c-"+n;
        document.getElementById(id).style.background = redMarbleColour;
    }
    for(let i=0;i<player2Score;i++) {
        let n= i+1;
        let id = "p2c-"+n;
        document.getElementById(id).style.background = redMarbleColour;
    }

    

    console.log(newMarblesP1)
    console.log(newMarblesP2)
    emptyLocation.push("a0", "a6", "b0", "b7", "c0", "d0", "e0", "f1", "g1", "g2", "h1", "h2", "h3", "i1", "i2", "i3", "i4", "c8", "d9")
    stateGenerator()
    
}

function stop() {
    reset();
    window.location.href="../index.html"
}
function reset() {
    window.location.reload();
    resetScore();
    marblesP1 = [],
    marblesP2 = [],
    themeNo = 0,
    mammaMia = null,
    
    fullHistory = [];  

    layoutInt = 0,
    gameMode = 0,
    turnLimit = 50,
    p1TimeLimit = 5,
    p2TimeLimit = 5,
    blackPlayer = 1;

// TURN-BASED VARIABLES
    currentTurn = 'b',              // b (black) or w (white)
    currentTurnINT = 1,             // Integer representing which players turn it is (1 or 2)
    currentClickSequence = [],      // The marbles clicked for this turn
    clickableCells = [];
    
    console.log("reset from the beginning")
    layoutInt = localStorage.getItem('layout');
    gameMode = localStorage.getItem('gameMode');
    turnLimit = localStorage.getItem('turnLimit');
    p1TimeLimit = localStorage.getItem('p1TimeLimit');
    p2TimeLimit = localStorage.getItem('p2TimeLimit');
    blackPlayer = localStorage.getItem('blackPlayer');

    if (blackPlayer == 1) currentTurnINT = 1;
    else if (blackPlayer == 2) currentTurnINT = 2;
    else currentTurnINT = 1;

    let moveLimits = document.getElementsByClassName("move-limit");
    moveLimits[0].innerHTML = turnLimit;
    moveLimits[1].innerHTML = turnLimit;
    document.getElementById("p1-time").innerHTML = p1TimeLimit;
    document.getElementById("p2-time").innerHTML = p2TimeLimit;

    initBoard(layoutInt);
    let cells = document.getElementsByClassName("cell");
    for (i = 0; i < cells.length; i++) {
        let cellID = cells[i].id;
        cells[i].addEventListener('click', function() { cellClicked(cellID) } );
    }


}

function getPlayerMarble(player, id) { 
    let marbles;
    if (player) marbles = (player === 'b') ? marblesP1 : marblesP2;
    else marbles = marblesP1.concat(marblesP2)
    for (let i = 0; i < marbles.length; i++) {
        if (marbles[i].coordinate == id) {
            return marbles[i]
        }
    }
}
function getPlayerMarblePreviousLoc(player, id) {
    let marbles;
    if (player) marbles = (player === 'b') ? marblesP1 : marblesP2;
    else marbles = marblesP1.concat(marblesP2)
    for (let i = 0; i < marbles.length; i++) {
        if (marbles[i].prevCoord == id) {
            return marbles[i]
        }
    }
}

function clearClickables() {
    let oldClickables = document.querySelectorAll("." + clickableClass);
    for(let c = 0; c < oldClickables.length; c++) {
        oldClickables[c].classList.remove(clickableClass);
    }
    clickableCells = []
}

function addClickable(id) {
    if (!clickableCells.includes(id)) {
        let adjCell = document.getElementById(id);
        clickableCells.push(id);
        adjCell.classList.add(clickableClass);
    }
}

function setClickables(id) {
    clearClickables();
    let marble = getPlayerMarble(currentTurn, id);
    if (!marble) {
        return;
    }

    let adjacentArr = adjacentInfo[id],
        firstClicked = currentClickSequence[0],
        secondClicked = currentClickSequence[1],
        firstAdjArr = firstClicked ? adjacentInfo[firstClicked.coordinate] : null,
        secondAdjArr = secondClicked ? adjacentInfo[secondClicked.coordinate] : null;
    
    // 1 cell selected 
    if (currentClickSequence.length == 0) {
        for (let i = 0; i < adjacentArr.length; i++) {
            let n_id = adjacentArr[i],
                movDir = adjacentDirections[i];
            let inlineMove = "i-" + id + "-" + movDir;

            let adjCell = document.getElementById(n_id),
                adjDir,
                inlineAdjMove = null,
                potentialSideStep = null,
                potentialSideStep2 = null; 
            if (adjCell != null) {
                if (adjCell && adjCell.classList.contains(hasMarbleClass)) { 
                    // Set the direction for potential adjacent moves
                    adjDir = adjOppositesHigh.includes(movDir) ? adjOppositesLow[adjOppositesHigh.indexOf(movDir)] 
                                                                : adjOppositesHigh[adjOppositesLow.indexOf(movDir)]
                    inlineAdjMove = "i-" + n_id + "-" + adjDir;

                    for (let j = 0; j < adjacentDirections.length; j++) {
                        potentialSideStep = "s-" + id + "-" + n_id + "-" + adjacentDirections[j]; 
                        potentialSideStep2 = "s-" + n_id + "-" + id + "-" + adjacentDirections[j];
                        if (resultsSideStep.includes(potentialSideStep) 
                            || resultsSideStep.includes(potentialSideStep2)) {
                                if (allBoard.includes(n_id)) addClickable(n_id)
                                break;
                        }
                    }
                } 
            }
            if (resultsInline.includes(inlineMove) || resultsInline.includes(inlineAdjMove)) {
                if (allBoard.includes(n_id)) addClickable(n_id)
            }
        }
    } else {
        let clickDirIndex,
            clickDirection,
            oppClickDirection;
        if (currentClickSequence.length > 1) {
            clickDirIndex = adjacentInfo[currentClickSequence[0].coordinate].indexOf(currentClickSequence[1].coordinate);
            clickDirection = adjacentDirections[clickDirIndex];
            oppClickDirection = adjOppositeDirections[clickDirIndex];
        } else if (currentClickSequence.length > 0) {
            clickDirIndex = adjacentInfo[currentClickSequence[0].coordinate].indexOf(id);
            clickDirection = adjacentDirections[clickDirIndex];
            oppClickDirection = adjOppositeDirections[clickDirIndex];
        }

        // 3 cells selected
        if (secondClicked) {
            for (let i = 0; i < secondAdjArr.length; i++) {
                let n_id = adjacentArr[i],
                    n_id2 = firstAdjArr[i],
                    n_id3 = secondAdjArr[i];
                let p_enemy1 = getPlayerMarble(currentTurn, n_id),
                    p_enemy2 = getPlayerMarble(currentTurn, n_id2),
                    p_enemy3 = getPlayerMarble(currentTurn, n_id3),
                    movDir = adjacentDirections[i];
                if (movDir == clickDirection || movDir == oppClickDirection) { // inline
                    let inlineMove1 = "i-" + id + "-" + movDir,
                        inlineMove2 = "i-" + firstClicked.coordinate + "-" + movDir,
                        inlineMove3 = "i-" + secondClicked.coordinate + "-" + movDir;
                    
                    let adjCell = document.getElementById(n_id),
                        adjCell2 = document.getElementById(n_id2),
                        adjCell3 = document.getElementById(n_id3);
                    if (adjCell && (!adjCell.classList.contains(hasMarbleClass) || p_enemy1 == undefined) 
                        && resultsInline.includes(inlineMove1)) {
                        if (allBoard.includes(n_id)) addClickable(n_id);
                    }
                    if (adjCell2 && (!adjCell2.classList.contains(hasMarbleClass) || p_enemy2 == undefined)
                        && resultsInline.includes(inlineMove2)) {
                        if (allBoard.includes(n_id2)) addClickable(n_id2);
                    }
                    if (adjCell3 && (!adjCell3.classList.contains(hasMarbleClass) || p_enemy3 == undefined)
                        && resultsInline.includes(inlineMove3)) {
                        if (allBoard.includes(n_id3)) addClickable(n_id3);
                    }
                } else { // sidestep /// Sidestep clickable will be in reference to the first clicked marble
                    let firstRow = firstClicked.coordinate[0],
                        secondRow = secondClicked.coordinate[0],
                        thirdRow = id[0],
                        values;
                    
                    if (firstRow == secondRow) { // horizontal selection
                        values = [parseInt(firstClicked.coordinate[1]), parseInt(secondClicked.coordinate[1]), parseInt(id[1])];
                    } else { // vertical selection
                        values = [rowOrder.indexOf(firstRow), rowOrder.indexOf(secondRow), rowOrder.indexOf(thirdRow)];
                    }
                    let topID = values.indexOf(Math.max.apply(Math, values)),
                        botID = values.indexOf(Math.min.apply(Math, values)),
                        clicked = [firstClicked.coordinate, secondClicked.coordinate, id];
                    let sideStep1 = "s-" + clicked[botID] + "-" + clicked[topID] + "-" + movDir,
                        sideStep2 = "s-" + clicked[topID] + "-" + clicked[botID] + "-" + movDir,
                        ss_clickable = firstAdjArr[i];
                    let ss_cell = document.getElementById(ss_clickable);
                    if (ss_cell && !ss_cell.classList.contains(hasMarbleClass)
                        && (resultsSideStep.includes(sideStep1) || resultsSideStep.includes(sideStep2))) {
                        if (allBoard.includes(ss_clickable)) addClickable(ss_clickable);
                    }
                }
            }
        } // 2 cells selected
        else if (firstClicked) { 
            for (let i = 0; i < firstAdjArr.length; i++) {
                let n_id = adjacentArr[i],
                    n_id2 = firstAdjArr[i],
                    movDir = adjacentDirections[i];
                if (movDir == clickDirection || movDir == oppClickDirection) { // inline
                    let inlineMove1 = "i-" + id + "-" + movDir,
                        inlineMove2 = "i-" + firstClicked.coordinate + "-" + movDir;
                    
                    let adjCell = document.getElementById(n_id),
                        adjCell2 = document.getElementById(n_id2),
                        adjDir,
                        inlineAdjMove1 = null,
                        inlineAdjMove2 = null,
                        potentialSideStep = null,
                        potentialSideStep2 = null;
                    if (adjCell && adjCell.classList.contains(hasMarbleClass)) { 
                        // Set the direction for potential adjacent moves
                        adjDir = adjOppositesHigh.includes(movDir) ? adjOppositesLow[adjOppositesHigh.indexOf(movDir)] 
                                                                    : adjOppositesHigh[adjOppositesLow.indexOf(movDir)]
                        inlineAdjMove1 = "i-" + n_id + "-" + adjDir;

                        for (let j = 0; j < adjacentDirections.length; j++) {
                            potentialSideStep = "s-" + id + "-" + n_id + "-" + adjacentDirections[j]; 
                            potentialSideStep2 = "s-" + n_id + "-" + id + "-" + adjacentDirections[j];
                            potentialSideStep3 = "s-" + id + "-" + n_id2 + "-" + adjacentDirections[j]; 
                            potentialSideStep4 = "s-" + n_id2 + "-" + id + "-" + adjacentDirections[j];
                            
                            if (resultsSideStep.includes(potentialSideStep) 
                                || resultsSideStep.includes(potentialSideStep2)
                                || resultsSideStep.includes(potentialSideStep3)
                                || resultsSideStep.includes(potentialSideStep4)) {
                                    if (allBoard.includes(n_id)) addClickable(n_id)
                                    break;
                            }
                        }
                    } 
                    if (adjCell2 && adjCell2.classList.contains(hasMarbleClass)) { 
                        // Set the direction for potential adjacent moves
                        adjDir = adjOppositesHigh.includes(movDir) ? adjOppositesLow[adjOppositesHigh.indexOf(movDir)] 
                                                                    : adjOppositesHigh[adjOppositesLow.indexOf(movDir)]
                        inlineAdjMove2 = "i-" + n_id2 + "-" + adjDir;
                    } 
                    if (resultsInline.includes(inlineMove1) || resultsInline.includes(inlineAdjMove1)) {
                        addClickable(n_id)
                    }
                    if (resultsInline.includes(inlineMove2) || resultsInline.includes(inlineAdjMove2)) {
                        addClickable(n_id2)
                    }
                } else { // sidestep /// Sidestep clickable will be in reference to the first clicked marble
                    let sideStep1 = "s-" + id + "-" + firstClicked.coordinate + "-" + movDir,
                        sideStep2 = "s-" + firstClicked.coordinate + "-" + id + "-" + movDir,
                        ss_clickable = firstAdjArr[i];
                        
                    if (resultsSideStep.includes(sideStep1) || resultsSideStep.includes(sideStep2)) {
                        if (allBoard.includes(ss_clickable)) addClickable(ss_clickable);
                    }
                }
            }
        }
    }
}

function selectCell(id, cell) { // selects the actual marble
    setClickables(id) 
    let marble = getPlayerMarble(currentTurn, id);
    if (marble) {
        currentClickSequence.push(marble);
        cell.classList.add(clickedClass);
    }
}

function cellClicked(id) {
    let cell = document.getElementById(id);
    let marble = getPlayerMarble(currentTurn, id);
    if (cell.classList.contains(hasMarbleClass)) { // Marble was clicked
        if (clickableCells.length == 0 
            || (cell.classList.contains(clickableClass) && !cell.classList.contains(clickedClass))) {
            if (marble) {
                selectCell(id, cell);
            } else {
                moveHandler(cell, id)
            }
        } 
    } else { // Empty space clicked
        moveHandler(cell, id);
    }
}


function moveHandler(cell, id) {
    console.log(getCurrentBoard()) //currentBoard
    oldBoard = getCurrentBoard();
    oldPlayer1Score = player1Score;
    oldPlayer2Score = player2Score;
    if (currentClickSequence.length > 0) { // Move the marbles!
        if (cell.classList.contains(clickableClass)) {
            playerTurnRunning = false;
            let marble = currentClickSequence[0],
                dirIndex = adjacentInfo[marble.coordinate].indexOf(id);
            if (dirIndex == -1) {
                marble = currentClickSequence[1];
                dirIndex = adjacentInfo[marble.coordinate].indexOf(id);
                if (dirIndex == -1) {
                    marble = currentClickSequence[2];
                    dirIndex = adjacentInfo[marble.coordinate].indexOf(id);
                }
            }

            let moveDirection = adjacentDirections[dirIndex],
                clickDirIndex,
                clickDirection,
                inline = true;
            if (currentClickSequence.length > 1) {
                clickDirIndex = adjacentInfo[currentClickSequence[0].coordinate].indexOf(currentClickSequence[1].coordinate);
                clickDirection = adjacentDirections[clickDirIndex];
                oppClickDirection = adjOppositeDirections[clickDirIndex];
                inline = (clickDirection == moveDirection || oppClickDirection == moveDirection) ? true : false;
            }

            let moveMarble;
            let toMoveRowValue = rowOrder.indexOf(id[0]), moveDir = 0, toMoveColValue = id[1];
            let rowValues = [], colValues = [];
            for (let i = 0; i < currentClickSequence.length; i++) {
                let marble = currentClickSequence[i];
                rowValues.push(rowOrder.indexOf(marble.coordinate[0]));
                colValues.push(marble.coordinate[1]);
            }
            if (rowValues.length > 0 && rowValues[1] == rowValues[0]) { // horizontal selection
                moveDir = toMoveColValue > colValues[0] ? "right" : "left"
            } else {  // vertical selection
                moveDir = toMoveRowValue > rowValues[0] ? "up" : "down";
            }
            let topID, botID, values;
            switch (moveDir) {
                case "up":
                    values = rowValues;
                    topID = values.indexOf(Math.min.apply(Math, values));
                    botID = values.indexOf(Math.max.apply(Math, values));
                    break;
                case "down":
                    values = rowValues;
                    topID = values.indexOf(Math.max.apply(Math, values));
                    botID = values.indexOf(Math.min.apply(Math, values));
                    break;
                case "left":
                    values = colValues;
                    topID = values.indexOf("" + Math.max.apply(Math, values));
                    botID = values.indexOf("" + Math.min.apply(Math, values));
                    break;
                case "right":
                    values = colValues;
                    topID = values.indexOf("" + Math.min.apply(Math, values));
                    botID = values.indexOf("" + Math.max.apply(Math, values));
                    break;
                default:
                    console.log("FAIRY GOD PARENTS")
                    break;
            }
            // let res = getMaxAndMinSelections(id),
            //     topID = res[0], botID = res[1];
            if (inline) {
                moveMarble = currentClickSequence[topID]
                let board = getCurrentBoard2();
                let inputMove = "i-" + moveMarble.coordinate + "-" + moveDirection
                if (resultsInline.includes(inputMove)) {
                    let newBoard = generateBoardConfigurationFromMove(board, inputMove);
                    newBoard = transformBoardToArray(newBoard)
                    drawBoard(newBoard);
                    chosenMoveNotation = inputMove;
                }
            } else {
                moveMarble = currentClickSequence[botID]
                let moveMarble2 = currentClickSequence[topID]
                let board = getCurrentBoard2();
                let inputMove = "s-" + moveMarble.coordinate + "-" + moveMarble2.coordinate + "-" + moveDirection
                let inputMove2 = "s-" + moveMarble2.coordinate + "-" + moveMarble.coordinate + "-" + moveDirection
                if (resultsSideStep.includes(inputMove)) {
                    let newBoard = generateBoardConfigurationFromMove(board, inputMove);
                    newBoard = transformBoardToArray(newBoard)
                    drawBoard(newBoard);
                    chosenMoveNotation = inputMove;
                } else if (resultsSideStep.includes(inputMove2)) {
                    let newBoard = generateBoardConfigurationFromMove(board, inputMove2);
                    newBoard = transformBoardToArray(newBoard)
                    drawBoard(newBoard);
                    chosenMoveNotation = inputMove2;
                }
            }
            deselectClicks();
            clearClickables();
            setTimeout(function() {
                endTurn()
            }, 100)
        } else {
            deselectClicks()
            clearClickables()
        }
    } else {
        deselectClicks();
    }
}

function deselectClicks() {
    let clickedBTNs = document.querySelectorAll("." + clickedClass);
    for (let i = 0; i < clickedBTNs.length; i++) {
        clickedBTNs[i].classList.remove(clickedClass)
    }
    currentClickSequence = []
}

let playerTurnTimeout, playerTurnRunning, turnNum = 1, tempTurnNum, chosenMoveNotation;

function endTurn() {
    clearInterval(playerTurnTimeout);
    let turnsLeft1 = parseInt(document.getElementById("p1-moves").innerHTML),
        turnsLeft2 = parseInt(document.getElementById("p2-moves").innerHTML);
    if (turnsLeft1 > 0 || turnsLeft2 > 0) {
        console.log("ENDING TURN FOR " + currentTurn)
        let board = getCurrentBoard();
        fullHistory.push(board);
        turnNum++;
        tempTurnNum = turnNum;
        board = board.toString();
        let newText = document.createElement("p");
        newText.id = board + turnNum;
        newText.innerHTML = "Move: " + chosenMoveNotation + "<br/>Board: " + board.replaceAll(',', ', ');
        if (currentTurn == 'b') {
            nextTurn = 'w'
            currentTurn = 'w';
            newText.style.background = "#3f3f4066"
        } else {
            newText.style.background = "#ebebeb66"
            nextTurn = 'b'
            currentTurn = 'b';
        }
        document.getElementById("fh-div").prepend(newText);
        if (currentTurnINT == 1) {
            currentTurnINT = 2
            document.getElementById("p1-tab-span").innerHTML = "";
            document.getElementById("p2-tab-span").innerHTML = "<<<<";
            turnsLeft1--;
            document.getElementById("p1-moves").innerHTML = turnsLeft1
        } else {
            currentTurnINT = 1
            document.getElementById("p1-tab-span").innerHTML = "<<<<";
            document.getElementById("p2-tab-span").innerHTML = "";
            turnsLeft2--;
            document.getElementById("p2-moves").innerHTML = turnsLeft2;
        }
        stateGenerator();
        if (gameMode == 1 && currentTurnINT == 2) { // Computer turn
            console.log("-------Starting AI!");
            let maxPlayer = (blackPlayer == 2);
            handleGameAgent(maxPlayer);
        } else { // Player turn
            console.log("--------Starting PLAYER!")
            playerTurnRunning = true;
            let playerSeconds = p1TimeLimit;
            let remainingTime = 0;
            document.getElementById("pause-btn").onclick = (function() {
                if (remainingTime == 0) {
                    remainingTime = 1;
                    clearInterval(playerTurnTimeout);
                    remainingTime = document.getElementById("p1-time").innerHTML;
                    document.getElementById("p1-time").innerHTML = remainingTime + " - PAUSED";
                    document.getElementById("pause-btn").innerText = "Paused";
                    let cells = document.getElementsByClassName("cell");
                    for (let i = 0; i < cells.length; i++) {
                        cells.item(i).classList.add("disabledbutton");
                    }
                }
                else {
                    playerSeconds = remainingTime;
                    remainingTime = 0;
                    playerTurnTimeout = setInterval(() => {
                        console.log("Interval: " + playerSeconds);
                        document.getElementById("p1-time").innerHTML = playerSeconds;
                        if (playerSeconds < 1) {
                            clearInterval(playerTurnTimeout);
                            window.alert("Out of time!");
                        } else {
                            playerSeconds--;
                        }
                    }, 950);
                    document.getElementById("pause-btn").innerText = "Pause";
                    let cells = document.getElementsByClassName("cell");
                    for (let i = 0; i < cells.length; i++) {
                        cells.item(i).classList.remove("disabledbutton");
                    }
                }
            });
            playerTurnTimeout = setInterval(() => {
                // console.log("Interval: " + playerSeconds);
                document.getElementById("p1-time").innerHTML = playerSeconds;
                if (playerSeconds < 1) {
                    clearInterval(playerTurnTimeout);
                    window.alert("Out of time!");
                } else {
                    playerSeconds--;
                }
            }, 950);
        }
    } else {
        // compare score...
        if (player1Score > player2Score) {
            endGame("BLACK");
        } else if (player2Score > player1Score) {
            endGame("WHITE");
        } else {
            endGame("NOBODY")
        }
    }
    
}

let timeStamp, timeStampEnd;
const maxDepthPerm = 9;
let maxDepth;

function handleGameAgent(maxPlayer) {
    let depth = 0;
    let alphaBeta;
    // let agentsTimeTicker = document.getElementById("p2-time");
    timeStamp = new Date().getTime();
    timeStampEnd = timeStamp + (p2TimeLimit * 1000) - 50;
    let displayTime = Math.floor((timeStampEnd - timeStamp) / 1000);
    // agentsTimeTicker.innerHTML = displayTime;
    let board = getCurrentBoard();
    let ai_timer_start = window.performance.now();
    let ai_timer_end;
    while (depth < maxDepthPerm && new Date().getTime() < timeStampEnd) {
        displayTime = Math.floor((timeStampEnd - (new Date().getTime())) / 1000);
        // agentsTimeTicker.innerHTML = displayTime;
        maxDepth = depth;
        let alphaBetaTemp = alphaBetaMiniMax(board, depth,  Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, maxPlayer);
        if (new Date().getTime() < timeStampEnd && (alphaBeta == undefined || 
            (((maxPlayer && alphaBetaTemp[0] >= alphaBeta[0])) || (!maxPlayer && alphaBetaTemp[0] <= alphaBeta[0])))) {
            alphaBeta = alphaBetaTemp;
            ai_timer_end = window.performance.now();
        }
        depth++;
    }
    let ai_time = ((ai_timer_end - ai_timer_start) / 1000).toFixed(6);
    writeToAiTime(ai_time)
    drawBoard(alphaBeta[1]);
    // console.log("-------AI MOVED");
    endTurn();
}

let aiTimeColor = true;
function writeToAiTime(ai_time) {
    let newText = document.createElement("p");
    newText.innerHTML = ai_time;
    if (aiTimeColor) {
        newText.style.background = "#3f3f4066"
    } else {
        newText.style.background = "#ebebeb66"
    }
    aiTimeColor = !aiTimeColor;
    document.getElementById("aiTime-div").prepend(newText);

    let aiTimeChildren = document.getElementById("aiTime-div").children
    let aggregate = 0;
    let i;
    for (i = 0; i < aiTimeChildren.length; i++) {
        console.log(aiTimeChildren[i].innerText)
        aggregate += +aiTimeChildren[i].innerText;
    }

    document.getElementById("aiTimeTotal-div").innerText = (aggregate/i).toFixed(6);
}

function createMarble(startCoord, player, mbcolour) {
    // startCoord is just the id of the initial location
    // player -> 1 for player 1, 2 for player 2
    return marble = {
        coordinate: startCoord,
        prevCoord: startCoord,
        player: player,
        marbleColour: mbcolour,
        dropped: false,
        draw: function() {
            document.getElementById(this.coordinate).style.background = this.marbleColour;
            if (!allBoard.includes(this.coordinate)) this.dropped = true;
        },
        move: function(newCoord) {
            this.prevCoord = this.coordinate;
            this.coordinate = newCoord;
            if (!allBoard.includes(newCoord)) this.dropped = true;
        },
        fixClasses: function() {
            document.getElementById(this.prevCoord).classList.remove(hasMarbleClass)
            if (!this.dropped) {
                document.getElementById(this.coordinate).classList.add(hasMarbleClass)

            }
        }
    }
}

function initBoard(startStyle) {
    // 0 or undefined = default
    // 1 = Belgium Daisy
    // 2 = German Daisy
    emptyBoard();
    let startCoordsP1 = [],
        startCoordsP2 = [];
    if (!startStyle || startStyle == 0) {
        console.log("Default layout")
        startCoordsP1 = defStartP1;
        startCoordsP2 = defStartP2;
    } else if (startStyle == 1) {
        console.log("Belgium Daisy");
        startCoordsP1 = BDStartP1;
        startCoordsP2 = BDStartP2;
    } else if (startStyle == 2) {
        console.log("German Daisy");
        startCoordsP1 = GDStartP1;
        startCoordsP2 = GDStartP2;
    }

    for (i = 0; i < startCoordsP1.length; i++) {
        let cellP1 = document.getElementById(startCoordsP1[i]);
        cellP1.style.background = blackMarbleColour;
        cellP1.classList.add(hasMarbleClass);
        // create a black marble object then add to marblesP1 array
        let marble1 = createMarble(startCoordsP1[i], 'b', blackMarbleColour);
        marblesP1.push(marble1)
        newMarblesP1.push(marble1.coordinate);

        let cellP2 = document.getElementById(startCoordsP2[i])
        cellP2.style.background = whiteMarbleColour;
        cellP2.classList.add(hasMarbleClass);
        // create a white marble object then add to marblesP2 array
        let marble2 = createMarble(startCoordsP2[i], 'w', whiteMarbleColour)
        marblesP2.push(marble2)
        newMarblesP2.push(marble2.coordinate);
    }
    for(let i =0; i<allBoard.length;i++) {
        if(!newMarblesP1.includes(allBoard[i]) && !newMarblesP2.includes(allBoard[i])) {
            emptyLocation.push(allBoard[i]);
        }
    }
    emptyLocation.push("a0", "a6", "b0", "b7", "c0", "d0", "e0", "f1", "g1", "g2", "h1", "h2", "h3", "i1", "i2", "i3", "i4", "c8", "d9")
    fullHistory.push(getCurrentBoard());
    stateGenerator();
    if (gameMode == 1) { // player vs computer
        document.getElementById("player2-tab").innerHTML = "Computer  <span id='p2-tab-span'></span>";
        if (blackPlayer == 1) { // player moves first
            document.getElementById("p1-tab-span").innerHTML = "<<<<";
            console.log("PLAYER MOVE")
            playerTurnRunning = true;
            playerTurnTimeout = setTimeout(() => {
                if (playerTurnRunning) {
                    // window.alert("Out of time!");
                }
            }, p1TimeLimit * 1000);
        } else { // computer moves first
            document.getElementById("p2-tab-span").innerHTML = "<<<<";
            randomFirstTurn();
            console.log("COMPUTER MOVE")
        }
    }
}

function randomFirstTurn() {
    let boardOutputArr = boardOutput(resultsInline, resultsSideStep)[1];
    let randomMove = boardOutputArr[Math.floor(Math.random() * boardOutputArr.length)];
    drawBoard(randomMove);
    endTurn()
}

function playGame() {
    mammaMia.currentTime = 0;

    
    // mammaMia.play();
    turn();
    testResultsInline = [];
    testResultsSideStep =[];
    testResultsInline.push(resultsInline[0])
    testResultsInline.push(resultsInline[1])
    testResultsSideStep.push(resultsSideStep[4])
    testResultsSideStep.push(resultsSideStep[6])
    console.log(resultsInline)
    console.log(resultsSideStep)

    resultsSideStep = removeDuplicateMoveNotation(resultsSideStep);
    // boardOutput(testResultsInline, testResultsSideStep);
    boardOutput(resultsInline, resultsSideStep);
}
function removeDuplicateMoveNotation(sideStepRes) {
    let idxArray = [];
    for(let i =0; i<sideStepRes.length;i++) {
        if(sideStepRes[i].substring(0,1)=="T") {
            continue;
        }
        let startingNode = sideStepRes[i].substring(2,4);
        let finishingNode = sideStepRes[i].substring(5,7);
        let newNode = 's-'+finishingNode+"-"+startingNode+sideStepRes[i].substring(7, sideStepRes.length);
        // console.log(newNode);
        if(!idxArray.includes(newNode)) {
            idxArray.push(sideStepRes[i]);
        }
    }
    return idxArray;
}

// function undo() {
//     if (fullHistory.length > 1) {
//         let board = fullHistory.pop();
//         let id = board + tempTurnNum;
//         console.log(id)
//         console.log(turnNum)
//         tempTurnNum--;
//         let oldMove = document.getElementById(id);
//         oldMove.style.textDecoration = "line-through"

//         let prevMove = fullHistory[fullHistory.length - 1]
//         if (currentTurn == 'b') {
//             nextTurn = 'w';
//             currentTurn = 'w';
//             oldMove.style.background = "#dd000066";
//         } else {
//             nextTurn = 'b';
//             currentTurn = 'b';
//             oldMove.style.background = "#78000066";
//         }
//         if (currentTurnINT == 1) {
//             currentTurnINT = 2;
//             let turnsLeft = parseInt(document.getElementById("p1-moves").innerHTML)
//             document.getElementById("p1-tab-span").innerHTML = "";
//             document.getElementById("p2-tab-span").innerHTML = "<<<<";
//             turnsLeft++;
//             document.getElementById("p1-moves").innerHTML = turnsLeft
//         } else {
//             currentTurnINT = 1
//             let turnsLeft = parseInt(document.getElementById("p2-moves").innerHTML)
//             document.getElementById("p1-tab-span").innerHTML = "<<<<";
//             document.getElementById("p2-tab-span").innerHTML = "";
//             turnsLeft++;
//             document.getElementById("p2-moves").innerHTML = turnsLeft
//         }
//         deselectClicks();
//         clearClickables();
//         drawBoard(prevMove);
//         stateGenerator();
//     } else {
//         window.alert("This is the farthest you can go!")
//     }
// }

function clearHasMarble() {
    let marbles = document.querySelectorAll(".hasMarble");
    for (let i = 0; i < marbles.length; i++) {
        marbles[i].classList.remove(hasMarbleClass);
    }
}

let p1Left = 14,
    p2Left = 14;

function drawBoard(board) {
    emptyBoard();
    marblesP1 = [];
    marblesP2 = [];
    clearHasMarble();
    board.forEach(marbleID => {
        let id = marbleID.substring(0, 2);
        let team = marbleID.substring(2,3);
        let newMarblesARR = team == 'b' ? newMarblesP1 : newMarblesP2;
        let marbleArr = team == 'b' ? marblesP1 : marblesP2;
        let marbleColour = team == 'b' ? blackMarbleColour : whiteMarbleColour;
        let marble = createMarble(id, team, marbleColour)

        marbleArr.push(marble);
        newMarblesARR.push(id);
        marble.draw();
        marble.fixClasses();
    });
    for(let i =0; i<allBoard.length;i++) {
        if(!newMarblesP1.includes(allBoard[i]) && !newMarblesP2.includes(allBoard[i])) {
            emptyLocation.push(allBoard[i]);
        }
    }
    emptyLocation.push("a0", "a6", "b0", "b7", "c0", "d0", "e0", "f1", "g1", "g2", "h1", "h2", "h3", "i1", "i2", "i3", "i4", "c8", "d9")
    if (p2Left > marblesP2.length) {
        console.log("black score")
        player1Score++;
        p2Left--;
        updateScore(blackPlayer);
    } else if (p1Left > marblesP1.length) {
        console.log("white score")

        player2Score++;
        p1Left--;
        updateScore(whitePlayer);
    }
    // console.log("DONE DRAWING");
}

function updateScore(player) {
    let scoreP1 = (blackPlayer == 1) ? player1Score : player2Score;
    let scoreP2 = (whitePlayer == 2) ? player2Score : player1Score;
    console.log("black " + blackPlayer)
    console.log("white " + whitePlayer)
    console.log(player1Score)
    console.log(player2Score)
    let id = (player == 1) ? 'p1c-' + scoreP1 : 'p2c-' + scoreP2
    console.log(id)
    document.getElementById(id).style.background = redMarbleColour;
    if (player1Score >= 6) {
        endGame("BLACK")
    } else if (player2Score >= 6) {
        endGame("WHITE")
    }
}

function resetScore() {
    console.log("inside     reset")
    if(player1Score!=0) {
        for(let i =0; i<player1Score;i++) {
            let n = i+1;
            let id = 'p1c-'+n
            document.getElementById(id).style.background = resetMarbleColour
        }
    }
    if(player2Score!=0) {
        for(let i =0; i<player1Score;i++) {
            let n = i+1;
            let id = 'p1c-'+n
            document.getElementById(id).style.background = resetMarbleColour
        }
    }
    player1Score=0;
    player2Score=0;
}

function changeTheme() {
    themeNo++;
    if (themeNo > 1) {
        themeNo = 0;
    }
    let gameboard = document.getElementById("game");
    if (themeNo == 0) {
        gameboard.style.background = "url(../images/abba-transparent.png)";
        document.getElementById("game-title").innerHTML = "ABBA-Lone"
    } else if (themeNo == 1) {
        gameboard.style.background = "url(../images/jabba.png)";
        document.getElementById("game-title").innerHTML = "Jabba-Lone"
    }
    gameboard.style.backgroundSize = "contain";
    gameboard.style.backgroundRepeat = "no-repeat";
    gameboard.style.backgroundPosition = "center";
}

function toggleHistory(ghTab) {
    let fhBTN = document.getElementById("gh-tabs-fh"),
        aitBTN = document.getElementById("gh-tabs-ai"),
        clickedBTN = null,
        notClickedBTN = null;
    if (!ghTab) {
        document.getElementById("gh-full").style.display = "block";
        document.getElementById("gh-ai-time").style.display = "none";
        clickedBTN = fhBTN;
        notClickedBTN = aitBTN;
    } else if (ghTab == 1) {
        document.getElementById("gh-ai-time").style.display = "block";
        document.getElementById("gh-full").style.display = "none";
        clickedBTN = aitBTN;
        notClickedBTN = fhBTN;
    }
    if (!clickedBTN.classList.contains("selected-btn")) {
        clickedBTN.classList.add("selected-btn");
        notClickedBTN.classList.remove("selected-btn");
    }
}

function setMoveNotation() {
    let textBox = document.getElementById("moveNoteText");
    let moveNotation = textBox.value,
        board = getCurrentBoard2();
    console.log(moveNotation);
    console.log(resultsInline);
    console.log(resultsSideStep);
    let prefix = moveNotation.substring(0,1);
    console.log(prefix);
    if (prefix == 'f') {
        moveNotation = moveNotation.substring(1);
        console.log(moveNotation);
        if (moveNotation.substring(0,2) == 's-' || moveNotation.substring(0,2) == 'i-') {
            oldBoard = getCurrentBoard();
            oldPlayer1Score = player1Score;
            oldPlayer2Score = player2Score;
            let newBoard = generateBoardConfigurationFromMove(board, moveNotation);
            newBoard = transformBoardToArray(newBoard);
            textBox.value = "";
            drawBoard(newBoard);
            deselectClicks();
            clearClickables();
            setTimeout(function() {
                endTurn()
            }, 100)
        }
    } else if (resultsSideStep.includes(moveNotation) || resultsInline.includes(moveNotation)) {
        oldBoard = getCurrentBoard();
        oldPlayer1Score = player1Score;
        oldPlayer2Score = player2Score;
        let newBoard = generateBoardConfigurationFromMove(board, moveNotation);
        newBoard = transformBoardToArray(newBoard);
        textBox.value = "";
        drawBoard(newBoard);
        deselectClicks();
        clearClickables();
        setTimeout(function() {
            endTurn()
        }, 100)
    } else {
        console.log("INVALID MOVE!");
    }
}

function endGame(winner) {
    window.alert(winner + " WINS!!!!");
    document.getElementById("game-tint").style.pointerEvents = "none";
}