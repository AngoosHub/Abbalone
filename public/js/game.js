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
        adjOppositesLow = [1, 3, 5];

// GAME VARIABLES
let marblesP1 = [],
    marblesP2 = [],
    themeNo = 0,
    mammaMia = null;  

// TURN-BASED VARIABLES
let currentTurn = 'b',              // b (black) or w (white)
    currentClickSequence = [],      // The marbles clicked for this turn
    currentClickDirections = [],
    clickableCells = [];

window.onload = function() {
    mammaMia = new Audio("../audio/mammamia.mp3");
    let layoutInt = localStorage.getItem('layout');
    // initBoard(layoutInt);
    turn();
    let cells = document.getElementsByClassName("cell");
    for (i = 0; i < cells.length; i++) {
        let cellID = cells[i].id;
        cells[i].addEventListener('click', function() { cellClicked(cellID) } );
    }
}

function getPlayerMarble(player, id) { 
    let marbles = player === 'b' ? marblesP1 : marblesP2;
    for (let i = 0; i < marbles.length; i++) {
        if (marbles[i].coordinate == id) {
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
                if (adjCell.classList.contains(hasMarbleClass) && !getPlayerMarble(currentTurn, adjacentArr[i])) {
                    // check for sumito, otherwise do the other check
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
    if (cell.classList.contains(hasMarbleClass)) { // Marble was clicked
        if (clickableCells.length == 0 
            || (cell.classList.contains(clickableClass)  && !cell.classList.contains(clickedClass))) { 
            selectCell(id, cell);
        } 
    } else { // Empty space clicked
        if (currentClickSequence.length > 0) { // Move the marbles!
            if (cell.classList.contains(clickableClass)) {
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

                let rowOrder = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
                let toMoveRowValue = rowOrder.indexOf(id[0]), moveDir = 0;
                let rowValues = [], colValues = [];
                for (let i = 0; i < currentClickSequence.length; i++) {
                    let marble = currentClickSequence[i];
                    rowValues.push(rowOrder.indexOf(marble.coordinate[0]));
                    colValues.push(marble.coordinate[1]);
                }
                if (rowValues.length > 0 && rowValues[1] == rowValues[0]) {
                    // horizontal selection
                    if (toMoveRowValue == rowValues[0]) {
                        // inline horizontal move
                        moveDir = toMoveRowValue > colValues[0] ? "right" : "left"
                    } else {
                        moveDir = 0
                    }
                } else {
                    // vertical selection
                    moveDir = toMoveRowValue > rowValues[0] ? "up" : "down";
                }
                let length = currentClickSequence.length
                for (let i = 0; i < length; i++) {
                    let moveMarble, topID, values, inline = true;
                    switch (moveDir) {
                        case "up":
                            values = rowValues;
                            topID = values.indexOf(Math.max.apply(Math, values));
                            moveMarble = currentClickSequence[topID];
                            break;
                        case "down":
                            values = rowValues;
                            topID = values.indexOf(Math.min.apply(Math, values));
                            moveMarble = currentClickSequence[topID];
                            break;
                        case "left":
                            values = colValues;
                            topID = values.indexOf(Math.min.apply(Math, values));
                            moveMarble = currentClickSequence[topID];
                            break;
                        case "right":
                            values = colValues;
                            topID = values.indexOf(Math.max.apply(Math, values));
                            moveMarble = currentClickSequence[topID];
                            break;
                        default:
                            inline = false;
                            moveMarble = currentClickSequence[i]
                            moveMarble.move(adjacentInfo[moveMarble.coordinate][dirIndex])
                    }
                    if (inline) {
                        values.splice(topID, 1);
                        currentClickSequence.splice(topID, 1);
                        moveMarble.move(adjacentInfo[moveMarble.coordinate][dirIndex]);
                    }
                }
                endTurn()
            } else {
                deselectClicks()
                clearClickables()
            }
        } else {
            deselectClicks();
        }
    }
}

function deselectClicks() {
    let clickedBTNs = document.querySelectorAll("." + clickedClass);
    for (let i = 0; i < clickedBTNs.length; i++) {
        clickedBTNs[i].classList.remove(clickedClass)
    }
    currentClickSequence = []
}

function endTurn() {
    if (currentTurn == 'b') {
        currentTurn = 'w';
    } else {
        currentTurn = 'b';
    }
    deselectClicks();
    clearClickables();
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
        move: function(newCoord) {
            this.prevCoord = this.coordinate;
            this.coordinate = newCoord;
            this.redraw();
        },
        redraw: function() {
            let cellOriginal = document.getElementById(this.prevCoord),
                cellNew = document.getElementById(this.coordinate);
            cellOriginal.style.background = emptyCellColour;
            cellOriginal.classList.remove(hasMarbleClass)
            cellNew.style.background = this.marbleColour;
            cellNew.classList.add(hasMarbleClass);
        }
    }
}

function initBoard(startStyle) {
    // 0 or undefined = default
    // 1 = Belgium Daisy
    // 2 = German Daisy
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
        marblesP1.push(createMarble(startCoordsP1[i], 'b', blackMarbleColour))

        let cellP2 = document.getElementById(startCoordsP2[i])
        cellP2.style.background = whiteMarbleColour;
        cellP2.classList.add(hasMarbleClass);
        // create a white marble object then add to marblesP2 array
        marblesP2.push(createMarble(startCoordsP2[i], 'w', whiteMarbleColour))
    }
}

function playGame() {
    mammaMia.currentTime = 0;
    // mammaMia.play();
    turn();
    boardOutput();
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
