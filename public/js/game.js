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
        whitePlayer == 1;
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
    // turn();
    // emptyBoard()
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
        firstAdjArr = firstClicked ? adjacentInfo[currentClickSequence[0].coordinate] : null,
        secondAdjArr = secondClicked ? adjacentInfo[currentClickSequence[1].coordinate] : null,
        firstDir;
    
    for (let i = 0; i < adjacentArr.length; i++) {
        let adjCell = document.getElementById(adjacentArr[i]),
            movDir = adjacentDirections[i],
            inlineMove = "i-" + id + "-" + movDir, 
            adjDir,
            inlineAdjMove = null; 
        if (adjCell != null) {
            if (adjCell && adjCell.classList.contains(hasMarbleClass)) { 
                // Set the direction for potential adjacent moves
                adjDir = adjOppositesHigh.includes(movDir) ? adjOppositesLow[adjOppositesHigh.indexOf(movDir)] 
                                                            : adjOppositesHigh[adjOppositesLow.indexOf(movDir)]
                inlineAdjMove = "i-" + adjacentArr[i] + "-" + adjDir;
            } 
            if (resultsInline.includes(inlineMove) || resultsInline.includes(inlineAdjMove)) {
                if (adjCell.classList.contains(hasMarbleClass) && getPlayerMarble(currentTurn, adjacentArr[i]) == undefined) {
                    // check for sumito, otherwise do the other check
                    console.log("maybe sumito?")
                    console.log(!getPlayerMarble(currentTurn, adjacentArr[i]))
                }
                if (currentClickSequence.length > 0) {
                    for (let x = 0; x < currentClickSequence.length; x++) {
                        let adjArr = (x === 0) ? firstAdjArr : secondAdjArr;
                    
                        let indexMain = adjArr.indexOf(id);
                        if (indexMain != -1) {
                            firstDir = adjacentDirections[indexMain];
                        } else {
                            if (adjOppositesHigh.includes(movDir)) {
                                firstDir = adjOppositesLow[adjOppositesHigh.indexOf(firstDir)];
                            } else {
                                firstDir = adjOppositesHigh[adjOppositesLow.indexOf(firstDir)];
                            }
                        }
                        if (movDir == firstDir) {
                            addClickable(adjacentArr[i]);
                        }
                    }
                } else if (currentClickSequence.length == 0) {
                    addClickable(adjacentArr[i])
                }
            }
        }
    }
    // check the previously clicked ones
    // sumito stuff check
    let clickDirIndex, clickDirection, oppClickDirection;
    if (currentClickSequence.length > 1) {
        clickDirIndex = adjacentInfo[currentClickSequence[0].coordinate].indexOf(currentClickSequence[1].coordinate);
        clickDirection = adjacentDirections[clickDirIndex];
        oppClickDirection = adjOppositeDirections[clickDirIndex];
    }
    for (let z = 0; z < currentClickSequence.length; z++) {
        let adjArr = (z === 0) ? firstAdjArr : secondAdjArr;
        if (adjArr) {
            for (let j = 0; j < adjArr.length; j++) {
                let adjCell = document.getElementById(adjArr[j]),
                    movDir = adjacentDirections[j],
                    adjDir;
                if (adjCell != null) {
                    if (adjOppositesHigh.includes(movDir)) {
                        adjDir = adjOppositesLow[adjOppositesHigh.indexOf(movDir)];
                    } else {
                        adjDir = adjOppositesHigh[adjOppositesLow.indexOf(movDir)];
                    }
                    if (adjDir == firstDir || movDir == firstDir) {
                        addClickable(adjArr[j])
                    }
                }
            }
        }
        // let possibleSumitoMove1 = "i-" + currentClickSequence[z].coordinate + "-" + clickDirection,
        //     possibleSumitoMove2 = "i-" + currentClickSequence[z].coordinate + "-" + oppClickDirection;
        // if (resultsInline.includes(possibleSumitoMove1)) {
        //     // find the victim!
        //     addClickable()
        // }
    }
    // SIDE STEPS
    if (currentClickSequence.length > 0) {
        let clickedButtons = currentClickSequence.slice();
        clickedButtons.push(marble);
        let sideStepMoveNot = "s-";

        if (clickedButtons.length == 2) {
            sideStepMoveNot += clickedButtons[0].coordinate + "-" + clickedButtons[1].coordinate
        }
        if (clickedButtons.length == 3) {
            sideStepMoveNot += clickedButtons[0].coordinate + "-" + clickedButtons[2].coordinate
        }

        let sidestepDirections = [1, 5, 7, 11]
        for (let q = 0; q < 4; q++) {
            let dir = sidestepDirections[q];
            let sideStepNotation = sideStepMoveNot.slice() + "-" + dir;
            if (resultsSideStep.includes(sideStepNotation)) {
                // loop thru adjacents and find the adjacent cell of each cell in that direction
                // then add it to the array
                let adj =  adjacentInfo[clickedButtons[0].coordinate],
                    ssAdd = adj[adjacentDirections.indexOf(dir)];
                if (!clickableCells.includes(ssAdd)) {
                    let adjCell = document.getElementById(ssAdd);
                    clickableCells.push(ssAdd);
                    adjCell.classList.add(clickableClass);
                }
            }
        }
    }
}

function setClickables2(id) {
    clearClickables();
    let marble = getPlayerMarble(currentTurn, id);
    if (!marble) {
        return;
    }
    
    let adjacentArr = adjacentInfo[id],
        firstClicked = currentClickSequence[0],
        secondClicked = currentClickSequence[1],
        thirdClicked = currentClickSequence[2],
        firstAdjArr = firstClicked ? adjacentInfo[firstClicked.coordinate] : null,
        secondAdjArr = secondClicked ? adjacentInfo[secondClicked.coordinate] : null,
        thirdAdjArr = thirdClicked ? adjacentInfo[thirdClicked.coordinate] : null;
    
    // First selected
    if (currentClickSequence.length == 0) {
        for (let i = 0; i < adjacentArr.length; i++) {
            let n_id = adjacentArr[i];
            let inline = "i-" + id + "-" + adjacentDirections[i];
            if (resultsInline.includes(inline)) {
                addClickable(n_id)
            }
        }
    }

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

    // First selected
    if (firstClicked) {
        for (let i = 0; i < firstAdjArr.length; i++) {
            let n_id = firstAdjArr[i];
            if (adjacentDirections[i] == clickDirection || adjacentDirections[i] == oppClickDirection) {
                console.log("nyahallo")
                let inline = "i-" + firstClicked.coordinate + "-" + adjacentDirections[i];
                if (resultsInline.includes(inline)) {
                    addClickable(n_id)
                }
            }
        }
    }

    // Second selected
    if (secondClicked) {
        for (let i = 0; i < secondAdjArr.length; i++) {
            let n_id = secondAdjArr[i];
            let inline = "i-" + secondClicked.coordinate + "-" + adjacentDirections[i];
            let res = getMaxAndMinSelections(n_id),
                topID = res[0], botID = res[1];
            let sideStep = "s-" + botID + "-" + topID + adjacentDirections[i]
            if (resultsInline.includes(inline) || resultsSideStep.includes(sideStep)) {
                addClickable(n_id)
            }
        }
    }

    // Third selected
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

function getMaxAndMinSelections(id) {
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
    return [topID, botID]
}

function moveHandler(cell, id) {
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
                console.log(resultsInline)
                if (resultsInline.includes(inputMove)) {
                    console.log(inputMove)
                    let newBoard = generateBoardConfigurationFromMove(board, inputMove);
                    newBoard = transformBoardToArray(newBoard)
                    drawBoard(newBoard);
                }
            } else {
                moveMarble = currentClickSequence[botID]
                let moveMarble2 = currentClickSequence[topID]
                let board = getCurrentBoard2();
                let inputMove = "s-" + moveMarble.coordinate + "-" + moveMarble2.coordinate + "-" + moveDirection
                if (resultsSideStep.includes(inputMove)) {
                    console.log(inputMove)
                    let newBoard = generateBoardConfigurationFromMove(board, inputMove);
                    newBoard = transformBoardToArray(newBoard)
                    drawBoard(newBoard);
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

let playerTurnTimeout, playerTurnRunning;

function endTurn() {
    clearTimeout(playerTurnTimeout);
    console.log("------ENDING " + currentTurn)
    let board = getCurrentBoard();
    fullHistory.push(board);
    board = board.toString().replaceAll(',', ', ');
    let newText = document.createElement("p");
    newText.innerHTML = board.toString();
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
        let turnsLeft = parseInt(document.getElementById("p1-moves").innerHTML)
        document.getElementById("p1-tab-span").innerHTML = "";
        document.getElementById("p2-tab-span").innerHTML = "<<<<";
        turnsLeft--;
        document.getElementById("p1-moves").innerHTML = turnsLeft
    } else {
        currentTurnINT = 1
        let turnsLeft = parseInt(document.getElementById("p2-moves").innerHTML)
        document.getElementById("p1-tab-span").innerHTML = "<<<<";
        document.getElementById("p2-tab-span").innerHTML = "";
        turnsLeft--;
        document.getElementById("p2-moves").innerHTML = turnsLeft;
    }
    stateGenerator();
    if (gameMode == 1 && currentTurnINT == 2) { // Computer turn
        console.log("-------Starting AI!")
        let maxPlayer = (blackPlayer == 2)
        handleGameAgent(maxPlayer);
    } else { // Player turn
        console.log("--------Starting PLAYER!")
        playerTurnRunning = true;
        playerTurnTimeout = setTimeout(() => {
            if (playerTurnRunning) {
                window.alert("Out of time!");
            }
        }, p1TimeLimit * 1000);
    }
}

let timeStamp, timeStampEnd;
const maxDepthPerm = 9;
let maxDepth;

function handleGameAgent(maxPlayer) {
    let depth = 0;
    let alphaBeta;
    let agentsTimeTicker = document.getElementById("p2-time");
    timeStamp = new Date().getTime();
    timeStampEnd = timeStamp + (p2TimeLimit * 1000) - 100;
    let displayTime = Math.floor((timeStampEnd - timeStamp) / 1000);
    agentsTimeTicker.innerHTML = displayTime;
    let board = getCurrentBoard();
    while (depth < maxDepthPerm && new Date().getTime() < timeStampEnd) {
        displayTime = Math.floor((timeStampEnd - (new Date().getTime())) / 1000);
        agentsTimeTicker.innerHTML = displayTime;
        maxDepth = depth;
        let alphaBetaTemp = alphaBetaMiniMax(board, depth,  Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, maxPlayer);
        if (new Date().getTime() < timeStampEnd && (alphaBeta == undefined || 
            (((maxPlayer && alphaBetaTemp[0] >= alphaBeta[0])) || (!maxPlayer && alphaBetaTemp[0] <= alphaBeta[0])))) {
            alphaBeta = alphaBetaTemp;
        }
        depth++;
    }
    drawBoard(alphaBeta[1]);
    // console.log("-------AI MOVED");
    endTurn();
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
                    window.alert("Out of time!");
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

function undo() {
    if (fullHistory.length > 1) {
        fullHistory.pop();
        let prevMove = fullHistory[fullHistory.length - 1]
        if (currentTurn == 'b') {
            nextTurn = 'b'
            currentTurn = 'w';
        } else {
            nextTurn = 'w'
            currentTurn = 'b';
        }
        if (currentTurnINT == 1) {
            currentTurnINT = 2
            let turnsLeft = parseInt(document.getElementById("p1-moves").innerHTML)
            document.getElementById("p1-tab-span").innerHTML = "";
            document.getElementById("p2-tab-span").innerHTML = "<<<<";
            turnsLeft++;
            document.getElementById("p1-moves").innerHTML = turnsLeft
        } else {
            currentTurnINT = 1
            let turnsLeft = parseInt(document.getElementById("p2-moves").innerHTML)
            document.getElementById("p1-tab-span").innerHTML = "<<<<";
            document.getElementById("p2-tab-span").innerHTML = "";
            turnsLeft++;
            document.getElementById("p2-moves").innerHTML = turnsLeft
        }
        deselectClicks();
        clearClickables();
        drawBoard(prevMove);
    } else {
        window.alert("This is the farthest you can go!")
    }
}

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
    marblesP1 = []
    marblesP2 = []
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
    let id = (player == blackPlayer) ? 'p1c-' + scoreP1 : 'p2c-' + scoreP2
    document.getElementById(id).style.background = redMarbleColour;
    if (player1Score >= 6) {
        // black WINS
    } else if (player2Score >= 6) {
        // white WINS
    }
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
