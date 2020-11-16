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

const allBoard = 
    ["a1", "a2", "a3", "a4", "a5", 
    "b1", "b2", "b3", "b4", "b5", "b6",
    "c1", "c2", "c3", "c4", "c5", "c6", "c7", 
    "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", 
    "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", 
    "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9",
    "g3", "g4", "g5", "g6", "g7", "g8", "g9",
    "h4", "h5", "h6", "h7", "h8", "h9",
    "i5", "i6", "i7", "i8", "i9"];
// GAME VARIABLES
let marblesP1 = [],  // same with newMarblesP1
    marblesP2 = [],  // same with newMarblesP2
    emptyLocation = [],
    themeNo = 0,
    mammaMia = null;  
    turn =1;
        
    playerTurn = turn%2!=0? true : false;

// TURN-BASED VARIABLES
let currentTurn = 'b',              // b (black) or w (white)
    currentClickSequence = [],      // The marbles clicked for this turn
    currentClickDirections = [],
    clickableCells = [], 
    currentMarbles = [], 
    oppositeMarbles = [];
    let curadjacent =[];
    let nextadjacent = [];
    let emptyadjacent = [];
    adjacentInfo = {};
    dummyLocation = [];
    let results;
    let setlist= [];

let moveResultsByMarble =[];
let listPossibleMovement = [];

window.onload = function() {
    mammaMia = new Audio("../audio/mammamia.mp3");
    let layoutInt = localStorage.getItem('layout');
    initBoard(layoutInt);

   
}
function playGame() {
    gamesetup();
    console.log(nextadjacent);
    console.log(curadjacent);
    move(curadjacent, nextadjacent);
    results = resultsInline.concat(resultsSideStep);   
    console.log(results); 
    
}
//alpha beta herustic.. function.
function heuristicFunction() {
    
    results =[];
    resultsInline =[];
    resultsSideStep =[];
    console.log(marblesP2)
    currentMarbles = marblesP2;
    oppositeMarbles = marblesP1;
    let answer;
    move(nextadjacent, curadjacent);
    results = resultsInline.concat(resultsSideStep);
    // console.log(results);
    let max=-100;
    let score =0;
    
    console.log(marblesP2)
    console.log(currentMarbles)
    for (let i =0; i<results.length;i++) {
        let tempMarblesAIList =  moveMarblesAI(results[i]);
        console.log(tempMarblesAIList);
        if(tempMarblesAIList!=null) {
            
            for(let j=0;j<tempMarblesAIList.length;j++) {
                // console.log(tempMarblesAIList[j])
                if(tempMarblesAIList[j].substring(0,1)==('e')) {
                    score+=3;
                }else if(tempMarblesAIList[j].substring(0,1)==('f')) {
                    score+=2;
                }else if(tempMarblesAIList[j].substring(0,1)==('g')) {
                    score+=1;
                }else if(tempMarblesAIList[j].substring(0,1)==('h')) {
                    score+=0;
                }else if(tempMarblesAIList[j].substring(0,1)==('i')) {
                    score+=-1;
                } 
    
            }
            for(let j=0;j<tempMarblesAIList.length;j++) {
                
                if(tempMarblesAIList[j].substring(1,2)==('5')) {
                    score+=5;
                }else if(tempMarblesAIList[j].substring(0,1)==('4')) {
                    score+=4;
                }else if(tempMarblesAIList[j].substring(0,1)==('3')) {
                    score+=3;
                }else if(tempMarblesAIList[j].substring(0,1)==('2')) {
                    score+=2;
                }else if(tempMarblesAIList[j].substring(0,1)==('1')) {
                    score+=1;
                }else if(tempMarblesAIList[j].substring(0,1)==('6')) {
                    score+=4;
                }else if(tempMarblesAIList[j].substring(0,1)==('7')) {
                    score+=3;
                }else if(tempMarblesAIList[j].substring(0,1)==('8')) {
                    score+=2;
                }else if(tempMarblesAIList[j].substring(0,1)==('9')) {
                    score+=1;
                } 
            }
           
        }
        
        console.log(score);   
        
        if(max<score) {
            max=score;
            answer= results[i];
        }
        score=0;      

    }
    console.log(marblesP2);
    console.log(answer)
    console.log(max);
    let aiMove = moveMarblesAI(answer);
    marblesP2=aiMove;
    console.log(aiMove);
    console.log(marblesP1);
    console.log(marblesP2);
    drawBoardAI();
}
function drawBoardAI() {
    emptyLocation=[];
    for(i=0;i<allBoard.length;i++) {
        let cellP1 = document.getElementById(allBoard[i]);
        cellP1.style.background=null;
        cellP1.classList.remove(hasMarbleClass);
        
    }
    console.log("working?")
    for (i = 0; i < marblesP1.length; i++) {
        let cellP1 = document.getElementById(marblesP1[i]);
        cellP1.style.background = blackMarbleColour;
        cellP1.classList.add(hasMarbleClass);
    }
    for (i = 0; i < marblesP2.length; i++) {
        let cellP2 = document.getElementById(marblesP2[i])
        cellP2.style.background = whiteMarbleColour;
        cellP2.classList.add(hasMarbleClass);
    }
    for(i=0;i<allBoard.length;i++) {
        let cellP1 = document.getElementById(allBoard[i]);
        if(!cellP1.classList.contains(hasMarbleClass)) {
            emptyLocation.push(cellP1.id);
            cellP1.style.background=null;
        }
    }
    gamesetup();
 
}

function getMiddleNode(first, third) {
    for(let i =0;i<6;i++) {
        if(adjacentInfo[adjacentInfo[first][i]][i]==third) {
            return i;
        }
    }
    
}
function moveMarblesAI(value) {
    let tempMarbles = marblesP2.slice();
    let tempMarblesP2 = tempMarbles;
    if(value.substring(0, 1)=='T') {
        return null;
    }
    let direction = getDirection(value.substring(value.length-2, value.length));
    let move = value.substring(0,1);
    if(move =='s') {
        let alphabet1 = (value.substring(2,3)).charCodeAt(0);
        let alphabet2 = (value.substring(5,6)).charCodeAt(0);
        let num1 = value.substring(3,4);
        let num2 = value.substring(6,7);
   
        if(num2-num1==1 || alphabet2-alphabet1==1) {
            let first= value.substring(2,4);
            let second= value.substring(5,7);
            
            let index = directionToIndex(direction)
            let idx1 = tempMarblesP2.indexOf(first)
            tempMarblesP2.splice(idx1, 1);
            let idx2 = tempMarblesP2.indexOf(second)
            tempMarblesP2.splice(idx2, 1);
            tempMarblesP2.push(adjacentInfo[first][index])
            tempMarblesP2.push(adjacentInfo[second][index])
        }else if(num2-num1==2 || alphabet2-alphabet1==2) {
            console.log(marblesP2)
            let first= value.substring(2,4);

            let third= value.substring(5,7);
            let dir = getMiddleNode(first, third);

            let second= adjacentInfo[first][dir];

            let index = directionToIndex(direction)
            let idx1 = tempMarblesP2.indexOf(first)
            tempMarblesP2.splice(idx1, 1);
            let idx2 = tempMarblesP2.indexOf(second)
        
            tempMarblesP2.splice(idx2, 1);
            let idx3 = tempMarblesP2.indexOf(third)
            tempMarblesP2.splice(idx3, 1);
            tempMarblesP2.push(adjacentInfo[first][index])
            // console.log(adjacentInfo[first][index])
            tempMarblesP2.push(adjacentInfo[second][index])
            tempMarblesP2.push(adjacentInfo[third][index])
            // console.log(adjacentInfo[second][index])
        }
    }else if(move=='i') {
        // console.log(marblesP2)
        let len = 1;
        let first = value.substring(2,4);
        let findingNode =first;
        // console.log(marblesP2)
        while(!emptyLocation.includes(adjacentInfo[findingNode][directionToIndex(direction)])) {
            findingNode = adjacentInfo[findingNode][directionToIndex(direction)]
            // console.log(marblesP2)
            len++;
        }
        if(len <=3) {
            // console.log(marblesP2)
            let idx = tempMarblesP2.indexOf(first)
            tempMarblesP2.splice(idx, 1);
            // console.log(marblesP2)
            tempMarblesP2.push(adjacentInfo[findingNode][directionToIndex(direction)]);
        }else if(len >4) {
            //this needs to be done to move.. opponent's 
        }
        
    }
    // console.log(tempMarblesP2);
    return tempMarblesP2;
}
function directionToIndex(num) {
    if(num =='-1' || num==1) {
        return 5;
    }else if(num=="-3" || num==3) {
        return 3;
    }else if(num =="-5" || num==5) {
        return 1;
    }else if(num =="-7" || num==7) {
        return 0;
    }else if(num =="-9" || num==9) {
        return 2;
    }else if(num =="11" || num==11) {
        return 4;
    }
}
function getDirection(num) {
    if(num =='-1') {
        return 1;
    }else if(num=="-3") {
        return 3;
    }else if(num =="-5") {
        return 5;
    }else if(num =="-7") {
        return 7;
    }else if(num =="-9") {
        return 9;
    }else if(num =="11") {
        return 11;
    }
}
function indexToDirection(num) {
    if(num ==0) {
        return 7;
    }else if(num==1) {
        return 5;
    }else if(num ==2) {
        return 9;
    }else if(num ==3) {
        return 3;
    }else if(num ==4) {
        return 11;
    }else if(num ==5) {
        return 1;
    }
}
function oppositeIndex(num) {
    if(num ==0) {
        return 5;
    }else if(num==1) {
        return 4;
    }else if(num ==2) {
        return 3;
    }else if(num ==3) {
        return 2;
    }else if(num ==4) {
        return 1;
    }else if(num ==5) {
        return 0;
    }
}
function getDirectionBetweenMarbles(marbles, adjacent) {
    return indexToDirection(adjacentInfo[marbles].indexOf(adjacent));
}



function searchMoveResultsByMarbles(marbles) {    
    console.log("this is also called")
    console.log(results);
    console.log(marbles.id);
    for(let i =0; i<results.length;i++) {
        if(results[i].substring(2,4)===marbles.id) {
            moveResultsByMarble.push(results[i])
        }
    }
    console.log(moveResultsByMarble)
    return moveResultsByMarble;
}

function makingBtn(listOfMovable) {
    // console.log(listOfMovable)

    let list = document.getElementById('ai-time-text')
    list.querySelectorAll('*').forEach(n=>n.remove());
    for(let i =0; i<listOfMovable.length;i++) {
        let tempButton = document.createElement('button');
        tempButton.innerHTML = listOfMovable[i];
        document.getElementById('ai-time-text').append(tempButton)
        tempButton.addEventListener('click', moveMarbles)
        
    }
 
    
    
}
function drawBoard() {
    emptyLocation=[];
    curadjacent =[];
    nextadjacent=[];
    emptyLocation=[];
    for (i = 0; i < allBoard.length; i++) {
        let cellP1 = document.getElementById(allBoard[i]);
        cellP1.classList.remove(hasMarbleClass);
        cellP1.classList.remove(clickableClass2);
        cellP1.classList.remove(clickableClass);
    }
    console.log("working?")
    for (i = 0; i < marblesP1.length; i++) {
        let cellP1 = document.getElementById(marblesP1[i]);
        cellP1.style.background = blackMarbleColour;
        cellP1.classList.add(hasMarbleClass);
    }
    for (i = 0; i < marblesP2.length; i++) {
        let cellP2 = document.getElementById(marblesP2[i])
        cellP2.style.background = whiteMarbleColour;
        cellP2.classList.add(hasMarbleClass);

    }
    for(i=0;i<allBoard.length;i++) {
        let cellP1 = document.getElementById(allBoard[i]);
        if(!cellP1.classList.contains(hasMarbleClass)) {
            emptyLocation.push(cellP1.id);
            cellP1.style.background=null;
        }
    }
    
    currentMarbles = marblesP1;
    oppositeMarbles = marblesP2;
    console.log(marblesP1)
    console.log(marblesP2)
    setlist=[];

    for(let i =0; i<currentMarbles.length; i++) {
        let marbles = document.getElementById(currentMarbles[i]);
        marbles.addEventListener('click', function() {
            if(setlist.length==0) {
                moveResultsByMarble=[];
                marbles.classList.add(clickableClass);
                setlist.push(marbles.id);
                possibleMoveWithOneMarble(marbles);
            }else if(setlist.length==1){
                if(marbles.classList.contains(clickableClass2)) {
                    marbles.classList.remove(clickableClass2);
                    let idx= setlist.indexOf(marbles.id)
                    setlist.splice(idx, 1);
                   
                }else if (marbles.classList.contains(clickableClass)) {
                    console.log(setlist.length); 
                     marbles.classList.remove(clickableClass);
                    let idx= setlist.indexOf(marbles.id)
                    setlist.splice(idx, 1);
                    
                }else {
                    if(setlist.length>0 && setlist.length<=2) {
                        console.log("or here");
                        marbles.classList.add(clickableClass2);
                        setlist.push(marbles.id);   
                        possibleMoveWithTwoMarble(marbles.id);
                    }     
                }
            }else if(setlist.length==2) {
                if(marbles.classList.contains(clickableClass2)) {
                    marbles.classList.remove(clickableClass2);
                    let idx= setlist.indexOf(marbles.id)
                    setlist.splice(idx, 1);
                   
                }else if (marbles.classList.contains(clickableClass)) {
                    console.log(setlist.length); 
                     marbles.classList.remove(clickableClass);
                    let idx= setlist.indexOf(marbles.id)
                    setlist.splice(idx, 1);
                    
                }else {
                    if(setlist.length>0 && setlist.length<=2) {
                        console.log("or here");
                        marbles.classList.add(clickableClass2);
                        setlist.push(marbles.id);   
                        possibleMoveWithThreeMarble(marbles.id);
                    }     
                }
            }else if(setlist.length==3) {
                if(marbles.classList.contains(clickableClass2)) {
                    marbles.classList.remove(clickableClass2);
                    let idx= setlist.indexOf(marbles.id)
                    setlist.splice(idx, 1);
                   
                }else if (marbles.classList.contains(clickableClass)) {
                    console.log(setlist.length); 
                     marbles.classList.remove(clickableClass);
                    let idx= setlist.indexOf(marbles.id)
                    setlist.splice(idx, 1);
                }
            }
        })
        curadjacent = getAdjacent(currentMarbles[i])
        

    }
    for(let i =0; i<oppositeMarbles.length; i++) {
        nextadjacent = getAdjacent(oppositeMarbles[i])

    }
    // set empty location
    for(let i =0; i<allBoard.length;i++) {
        if(!document.getElementById(allBoard[i]).classList.contains(hasMarbleClass)) {
            emptyLocation.push(allBoard[i]);
        }

    }
    for(let i =0; i<emptyLocation.length;i++) {
        emptyadjacent = getAdjacent(emptyLocation[i]);
    }
    emptyLocation.push("a0", "a6", "b0", "b7", "c0", "d0", "e0", "f1", "g1", "g2", "h1", "h2", "h3", "i1", "i2", "i3", "i4", "c8", "d9")
    dummyLocation.push("a0", "a6", "b0", "b7", "c0", "d0", "e0", "f1", "g1", "g2", "h1", "h2", "h3", "i1", "i2", "i3", "i4", "c8", "d9")

    heuristicFunction();
}

function gamesetup() {

    currentMarbles = marblesP1;
    oppositeMarbles = marblesP2;
    console.log(marblesP1)
    console.log(marblesP2)
    setlist=[];

    for(let i =0; i<currentMarbles.length; i++) {
        let marbles = document.getElementById(currentMarbles[i]);
        marbles.addEventListener('click', function() {
            if(setlist.length==0) {
                moveResultsByMarble=[];
                marbles.classList.add(clickableClass);
                setlist.push(marbles.id);
                possibleMoveWithOneMarble(marbles);
            }else if(setlist.length==1){
                if(marbles.classList.contains(clickableClass2)) {
                    marbles.classList.remove(clickableClass2);
                    let idx= setlist.indexOf(marbles.id)
                    setlist.splice(idx, 1);
                   
                }else if (marbles.classList.contains(clickableClass)) {
                    console.log(setlist.length); 
                     marbles.classList.remove(clickableClass);
                    let idx= setlist.indexOf(marbles.id)
                    setlist.splice(idx, 1);
                    
                }else {
                    if(setlist.length>0 && setlist.length<=2) {
                        console.log("or here");
                        marbles.classList.add(clickableClass2);
                        setlist.push(marbles.id);   
                        possibleMoveWithTwoMarble(marbles.id);
                    }     
                }
            }else if(setlist.length==2) {
                if(marbles.classList.contains(clickableClass2)) {
                    marbles.classList.remove(clickableClass2);
                    let idx= setlist.indexOf(marbles.id)
                    setlist.splice(idx, 1);
                   
                }else if (marbles.classList.contains(clickableClass)) {
                    console.log(setlist.length); 
                     marbles.classList.remove(clickableClass);
                    let idx= setlist.indexOf(marbles.id)
                    setlist.splice(idx, 1);
                    
                }else {
                    if(setlist.length>0 && setlist.length<=2) {
                        console.log("or here");
                        marbles.classList.add(clickableClass2);
                        setlist.push(marbles.id);   
                        possibleMoveWithThreeMarble(marbles.id);
                    }     
                }
            }else if(setlist.length==3) {
                if(marbles.classList.contains(clickableClass2)) {
                    marbles.classList.remove(clickableClass2);
                    let idx= setlist.indexOf(marbles.id)
                    setlist.splice(idx, 1);
                   
                }else if (marbles.classList.contains(clickableClass)) {
                    console.log(setlist.length); 
                     marbles.classList.remove(clickableClass);
                    let idx= setlist.indexOf(marbles.id)
                    setlist.splice(idx, 1);
                }
            }
        })
        curadjacent = getAdjacent(currentMarbles[i])
        

    }
    for(let i =0; i<oppositeMarbles.length; i++) {
        nextadjacent = getAdjacent(oppositeMarbles[i])

    }
    // set empty location
    for(let i =0; i<allBoard.length;i++) {
        if(!document.getElementById(allBoard[i]).classList.contains(hasMarbleClass)) {
            emptyLocation.push(allBoard[i]);
        }

    }
    for(let i =0; i<emptyLocation.length;i++) {
        emptyadjacent = getAdjacent(emptyLocation[i]);
    }
    emptyLocation.push("a0", "a6", "b0", "b7", "c0", "d0", "e0", "f1", "g1", "g2", "h1", "h2", "h3", "i1", "i2", "i3", "i4", "c8", "d9")
    dummyLocation.push("a0", "a6", "b0", "b7", "c0", "d0", "e0", "f1", "g1", "g2", "h1", "h2", "h3", "i1", "i2", "i3", "i4", "c8", "d9")
}
function moveMarbles() {
    let value = this.innerText;
    let direction = getDirection(value.substring(value.length-2, value.length));
    console.log(direction);
    let move = value.substring(0,1);
    if(move =='s') {
        if(setlist.length==2) {
            let first= value.substring(2,4);
            let second= value.substring(5,7);
            
            let index = directionToIndex(direction)
            let idx1 = marblesP1.indexOf(first)
            marblesP1.splice(idx1, 1);
            let idx2 = marblesP1.indexOf(second)
            marblesP1.splice(idx2, 1);
            marblesP1.push(adjacentInfo[first][index])
            // console.log(adjacentInfo[first][index])
            marblesP1.push(adjacentInfo[second][index])
            // console.log(adjacentInfo[second][index])
        }else if(setlist.length==3) {
            let first= value.substring(2,4);
            let second= setlist[1];
            let third= value.substring(5,7);
            // console.log(first)
            // console.log(second)
            let index = directionToIndex(direction)
            let idx1 = marblesP1.indexOf(first)
            
            
            marblesP1.splice(idx1, 1);
            let idx2 = marblesP1.indexOf(second)
            marblesP1.splice(idx2, 1);
            let idx3 = marblesP1.indexOf(third)
            marblesP1.splice(idx3, 1);
            marblesP1.push(adjacentInfo[first][index])
            // console.log(adjacentInfo[first][index])
            marblesP1.push(adjacentInfo[second][index])
            marblesP1.push(adjacentInfo[third][index])
            // console.log(adjacentInfo[second][index])
        }
    }else if(move=='i') {
        let len = 1;
        let first = value.substring(2,4);
        let findingNode =first;
        while(!emptyLocation.includes(adjacentInfo[findingNode][directionToIndex(direction)])) {
            findingNode = adjacentInfo[findingNode][directionToIndex(direction)]
            len++;
            // console.log(len);
        }
        if(len <=3) {
            let idx = marblesP1.indexOf(first)
            marblesP1.splice(idx, 1);
            console.log(findingNode);
            marblesP1.push(adjacentInfo[findingNode][directionToIndex(direction)]);
        }else if(len >4) {
            //this needs to be done to move.. opponent's 
        }
    }
    drawBoard();
}

function possibleMoveWithOneMarble(marbles) {    
    console.log("this is called")
    let tempList = searchMoveResultsByMarbles(marbles);
    console.log(tempList)
    for(let i =0; i<tempList.length;i++) {
        console.log(directionToIndex(tempList[i].substring(tempList[i].length-2, tempList[i].length)));   
        let tempidx = directionToIndex(tempList[i].substring(tempList[i].length-2, tempList[i].length))
        let tempAdjMarble = adjacentInfo[marbles.id][tempidx];
        if(tempList[i].substring(0,1)=='i' && emptyLocation.includes(tempAdjMarble)) {
            listPossibleMovement.push(tempList[i]);
        }
    }
    // console.log(listPossibleMovement);
    
    makingBtn(listPossibleMovement)
}

function possibleMoveWithTwoMarble(marbles) {
    // console.log(moveResultsByMarble)
    let tempList = moveResultsByMarble;
    listPossibleMovement=[];
    for(let i =0; i<tempList.length;i++) {

        let tempidx = directionToIndex(tempList[i].substring(tempList[i].length-2, tempList[i].length))
        let tempAdjMarbleOfOriginalMarble = adjacentInfo[setlist[0]][tempidx];
        let tempAdjMarbleOfSecondMarble = adjacentInfo[setlist[1]][tempidx];
        if(tempList[i].substring(0,1)=='i' && tempAdjMarbleOfOriginalMarble ==marbles &&emptyLocation.includes(tempAdjMarbleOfSecondMarble)) {
            listPossibleMovement.push(tempList[i]);
        }
    }
    for(let i =0; i<tempList.length;i++) { 
        if(tempList[i].substring(0,1)=='s' && tempList[i].substring(5,7)==marbles) {
            listPossibleMovement.push(tempList[i]);
        }
    }
    // console.log(listPossibleMovement)
    makingBtn(listPossibleMovement)
    

}

function possibleMoveWithThreeMarble(marbles) {
    listPossibleMovement=[];
    let tempList = moveResultsByMarble;
    for(let i =0; i<tempList.length;i++) {
        let findidx = adjacentInfo[setlist[1]].indexOf(setlist[2]);
        
        if(tempList[i].substring(0,1)=='i' && findidx ==directionToIndex(tempList[i].substring(tempList[i].length-2, tempList[i].length))) {
            listPossibleMovement.push(tempList[i]);
        }
        findidx = oppositeIndex(findidx);
        if(tempList[i].substring(0,1)=='i' && findidx ==directionToIndex(tempList[i].substring(tempList[i].length-2, tempList[i].length))) {
            listPossibleMovement.push(tempList[i]);
        }
    }
    for(let i =0; i<tempList.length;i++) { 
        if(tempList[i].substring(0,1)=='s' && tempList[i].substring(5,7)==marbles) {
            listPossibleMovement.push(tempList[i]);
        }
    }
    // console.log(listPossibleMovement)
    
    makingBtn(listPossibleMovement)

}




// function createMarble(startCoord, player, mbcolour) {
//     // startCoord is just the id of the initial location
//     // player -> 1 for player 1, 2 for player 2
//     return marble = {
//         coordinate: startCoord,
//         prevCoord: startCoord,
//         player: player,
//         marbleColour: mbcolour,
//         dropped: false,
//         move: function(newCoord) {
//             this.prevCoord = this.coordinate;
//             this.coordinate = newCoord;
//             this.redraw();
//         },
//         redraw: function() {
//             let cellOriginal = document.getElementById(this.prevCoord),
//                 cellNew = document.getElementById(this.coordinate);
//             cellOriginal.style.background = emptyCellColour;
//             cellOriginal.classList.remove(hasMarbleClass)
//             cellNew.style.background = this.marbleColour;
//             cellNew.classList.add(hasMarbleClass);
//         }
//     }
// }

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
        
        marblesP1.push(cellP1.id)
    }
    for (i = 0; i < startCoordsP2.length; i++) {
        let cellP2 = document.getElementById(startCoordsP2[i])
        cellP2.style.background = whiteMarbleColour;
        cellP2.classList.add(hasMarbleClass);
        // create a white marble object then add to marblesP2 array
        marblesP2.push(cellP2.id)
    }
}


// This is to get adjacent 
// to make it easy to figure out direction(==array's index)
// added "x" for null value
function getAdjacent(marble) {
    
    let alphabet = marble.substring(0, 1)
    let number = marble.substring(1, 2)
    
    let adjacent = [];
    let adjacentAlphabet = [];
    let adjacentNumber = [];
    
    if(alphabet=='a') {
        adjacentAlphabet = ['x', 'a', 'b']
    }else if(alphabet=='b') {
        adjacentAlphabet = ['a', 'b', 'c']
    }else if(alphabet=='c') {
        adjacentAlphabet = ['b', 'c', 'd']
    }else if(alphabet=='d') {
        adjacentAlphabet = ['c', 'd', 'e']
    }else if(alphabet=='e') {
        adjacentAlphabet = ['d', 'e', 'f']
    }else if(alphabet=='f') {
        adjacentAlphabet = ['e', 'f', 'g']
    }else if(alphabet=='g') {
        adjacentAlphabet = ['f', 'g', 'h']
    }else if(alphabet=='h') {
        adjacentAlphabet = ['g', 'h', 'i']
    }else if(alphabet=='i') {
        adjacentAlphabet = ['h', 'i', 'x']
    }
    
    if(number==1) {
        adjacentNumber = [0, 1, 2]
    }else if(number==2) {
        adjacentNumber = [1,2,3]
    }else if(number==3) {
        adjacentNumber = [2,3,4]
    }else if(number==4) {
        adjacentNumber = [3,4,5]
    }else if(number==5) {
        adjacentNumber = [4,5,6]
    }else if(number==6) {
        adjacentNumber = [5,6,7]
    }else if(number==7) {
        adjacentNumber = [6,7,8]
    }else if(number==8) {
        adjacentNumber = [7,8,9]
    }else if(number==9) {
        adjacentNumber = [8,9,0]
    }
    

    //MAKE ADJACENT ALL 
    for(let i =0; i<adjacentAlphabet.length;i++) {
        for(let j=0;j<adjacentNumber.length;j++) {
            let candidate = adjacentAlphabet[i]+adjacentNumber[j];
            if(adjacentAlphabet[i]<alphabet && adjacentNumber[j]<=number) {
                adjacent.push(candidate);
            }
            if(adjacentAlphabet[i]>alphabet && adjacentNumber[j]>=number) {
                adjacent.push(candidate);
            }
            //remove if the marble is smae with the current marble
            if(adjacentAlphabet[i]==alphabet &&candidate!=marble) {
                adjacent.push(candidate);
            }
            // console.log(adjacent)
            
        }
        adjacentInfo[marble] = adjacent
    }
   
    return adjacentInfo


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










// function addClickable(id) {
//     if (!clickableCells.includes(id)) {
//         let adjCell = document.getElementById(id);
//         clickableCells.push(id);
//         adjCell.classList.add(clickableClass);
//     }
// }

// function getPlayerMarble(player, id) { 
//     let marbles = player === 'b' ? marblesP1 : marblesP2;
//     for (let i = 0; i < marbles.length; i++) {
//         if (marbles[i].coordinate == id) {
//             return marbles[i]
//         }
//     }
// }

// function clearClickables() {
//     let oldClickables = document.querySelectorAll("." + clickableClass);
//     for(let c = 0; c < oldClickables.length; c++) {
//         oldClickables[c].classList.remove(clickableClass);
//     }
//     clickableCells = []
// }

// function addClickable(id) {
//     if (!clickableCells.includes(id)) {
//         let adjCell = document.getElementById(id);
//         clickableCells.push(id);
//         adjCell.classList.add(clickableClass);
//     }
// }

// function setClickables(id) {
//     clearClickables();
//     let marble = getPlayerMarble(currentTurn, id);
//     if (!marble) {
//         return;
//     }

//     let adjacentArr = adjacentInfo[id],
//         firstClicked = currentClickSequence[0],
//         secondClicked = currentClickSequence[1],
//         firstAdjArr = firstClicked ? adjacentInfo[currentClickSequence[0].coordinate] : null,
//         secondAdjArr = secondClicked ? adjacentInfo[currentClickSequence[1].coordinate] : null,
//         firstDir;
    
//     for (let i = 0; i < adjacentArr.length; i++) {
//         let adjCell = document.getElementById(adjacentArr[i]),
//             movDir = adjacentDirections[i],
//             inlineMove = "i-" + id + "-" + movDir, 
//             adjDir,
//             inlineAdjMove = null; 
//         if (adjCell != null) {
//             if (adjCell && adjCell.classList.contains(hasMarbleClass)) { 
//                 // Set the direction for potential adjacent moves
//                 adjDir = adjOppositesHigh.includes(movDir) ? adjOppositesLow[adjOppositesHigh.indexOf(movDir)] 
//                                                             : adjOppositesHigh[adjOppositesLow.indexOf(movDir)]
//                 inlineAdjMove = "i-" + adjacentArr[i] + "-" + adjDir;
//             } 
//             if (resultsInline.includes(inlineMove) || resultsInline.includes(inlineAdjMove)) {
//                 if (adjCell.classList.contains(hasMarbleClass) && !getPlayerMarble(currentTurn, adjacentArr[i])) {
//                     // check for sumito, otherwise do the other check
//                 }
//                 if (currentClickSequence.length > 0) {
//                     for (let x = 0; x < currentClickSequence.length; x++) {
//                         let adjArr = (x === 0) ? firstAdjArr : secondAdjArr;
                    
//                         let indexMain = adjArr.indexOf(id);
//                         if (indexMain != -1) {
//                             firstDir = adjacentDirections[indexMain];
//                         } else {
//                             if (adjOppositesHigh.includes(movDir)) {
//                                 firstDir = adjOppositesLow[adjOppositesHigh.indexOf(firstDir)];
//                             } else {
//                                 firstDir = adjOppositesHigh[adjOppositesLow.indexOf(firstDir)];
//                             }
//                         }
//                         if (movDir == firstDir) {
//                             addClickable(adjacentArr[i]);
//                         }
//                     }
//                 } else if (currentClickSequence.length == 0) {
//                     addClickable(adjacentArr[i])
//                 }
//             }
//         }
//     }
//     // check the previously clicked ones
//     for (let z = 0; z < currentClickSequence.length; z++) {
//         let adjArr = (z === 0) ? firstAdjArr : secondAdjArr;
//         if (adjArr) {
//             for (let j = 0; j < adjArr.length; j++) {
//                 let adjCell = document.getElementById(adjArr[j]),
//                     movDir = adjacentDirections[j],
//                     adjDir;
//                 if (adjCell != null) {
//                     if (adjOppositesHigh.includes(movDir)) {
//                         adjDir = adjOppositesLow[adjOppositesHigh.indexOf(movDir)];
//                     } else {
//                         adjDir = adjOppositesHigh[adjOppositesLow.indexOf(movDir)];
//                     }
//                     if (adjDir == firstDir || movDir == firstDir) {
//                         addClickable(adjArr[j])
//                     }
//                 }
//             }
//         }
//     }
//     // SIDE STEPS
//     if (currentClickSequence.length > 0) {
//         let clickedButtons = currentClickSequence.slice();
//         clickedButtons.push(marble);
//         let sideStepMoveNot = "s-";

//         if (clickedButtons.length == 2) {
//             sideStepMoveNot += clickedButtons[0].coordinate + "-" + clickedButtons[1].coordinate
//         }
//         if (clickedButtons.length == 3) {
//             sideStepMoveNot += clickedButtons[0].coordinate + "-" + clickedButtons[2].coordinate
//         }

//         let sidestepDirections = [1, 5, 7, 11]
//         for (let q = 0; q < 4; q++) {
//             let dir = sidestepDirections[q];
//             let sideStepNotation = sideStepMoveNot.slice() + "-" + dir;
//             if (resultsSideStep.includes(sideStepNotation)) {
//                 // loop thru adjacents and find the adjacent cell of each cell in that direction
//                 // then add it to the array
//                 let adj =  adjacentInfo[clickedButtons[0].coordinate],
//                     ssAdd = adj[adjacentDirections.indexOf(dir)];
//                 if (!clickableCells.includes(ssAdd)) {
//                     let adjCell = document.getElementById(ssAdd);
//                     clickableCells.push(ssAdd);
//                     adjCell.classList.add(clickableClass);
//                 }
//             }
//         }
//     }
// }

// function selectCell(id, cell) { // selects the actual marble
//     setClickables(id) 

//     let marble = getPlayerMarble(currentTurn, id);
//     if (marble) {
//         currentClickSequence.push(marble);
//         cell.classList.add(clickedClass);
//     }
// }

// function cellClicked(id) {
//     let cell = document.getElementById(id);
//     if (cell.classList.contains(hasMarbleClass)) { // Marble was clicked
//         if (clickableCells.length == 0 
//             || (cell.classList.contains(clickableClass)  && !cell.classList.contains(clickedClass))) { 
//             selectCell(id, cell);
//         } 
//     } else { // Empty space clicked
//         if (currentClickSequence.length > 0) { // Move the marbles!
//             if (cell.classList.contains(clickableClass)) {
//                 let marble = currentClickSequence[0],
//                     dirIndex = adjacentInfo[marble.coordinate].indexOf(id);
//                 if (dirIndex == -1) {
//                     marble = currentClickSequence[1];
//                     dirIndex = adjacentInfo[marble.coordinate].indexOf(id);
//                     if (dirIndex == -1) {
//                         marble = currentClickSequence[2];
//                         dirIndex = adjacentInfo[marble.coordinate].indexOf(id);
//                     }
//                 }

//                 let rowOrder = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
//                 let toMoveRowValue = rowOrder.indexOf(id[0]), moveDir = 0;
//                 let rowValues = [], colValues = [];
//                 for (let i = 0; i < currentClickSequence.length; i++) {
//                     let marble = currentClickSequence[i];
//                     rowValues.push(rowOrder.indexOf(marble.coordinate[0]));
//                     colValues.push(marble.coordinate[1]);
//                 }
//                 if (rowValues.length > 0 && rowValues[1] == rowValues[0]) {
//                     // horizontal selection
//                     if (toMoveRowValue == rowValues[0]) {
//                         // inline horizontal move
//                         moveDir = toMoveRowValue > colValues[0] ? "right" : "left"
//                     } else {
//                         moveDir = 0
//                     }
//                 } else {
//                     // vertical selection
//                     moveDir = toMoveRowValue > rowValues[0] ? "up" : "down";
//                 }
//                 let length = currentClickSequence.length
//                 for (let i = 0; i < length; i++) {
//                     let moveMarble, topID, values, inline = true;
//                     switch (moveDir) {
//                         case "up":
//                             values = rowValues;
//                             topID = values.indexOf(Math.max.apply(Math, values));
//                             moveMarble = currentClickSequence[topID];
//                             break;
//                         case "down":
//                             values = rowValues;
//                             topID = values.indexOf(Math.min.apply(Math, values));
//                             moveMarble = currentClickSequence[topID];
//                             break;
//                         case "left":
//                             values = colValues;
//                             topID = values.indexOf(Math.min.apply(Math, values));
//                             moveMarble = currentClickSequence[topID];
//                             break;
//                         case "right":
//                             values = colValues;
//                             topID = values.indexOf(Math.max.apply(Math, values));
//                             moveMarble = currentClickSequence[topID];
//                             break;
//                         default:
//                             inline = false;
//                             moveMarble = currentClickSequence[i]
//                             moveMarble.move(adjacentInfo[moveMarble.coordinate][dirIndex])
//                     }
//                     if (inline) {
//                         values.splice(topID, 1);
//                         currentClickSequence.splice(topID, 1);
//                         moveMarble.move(adjacentInfo[moveMarble.coordinate][dirIndex]);
//                     }
//                 }
//                 endTurn()
//             } else {
//                 deselectClicks()
//                 clearClickables()
//             }
//         } else {
//             deselectClicks();
//         }
//     }
// }

// function deselectClicks() {
//     let clickedBTNs = document.querySelectorAll("." + clickedClass);
//     for (let i = 0; i < clickedBTNs.length; i++) {
//         clickedBTNs[i].classList.remove(clickedClass)
//     }
//     currentClickSequence = []
// }

// function endTurn() {
//     if (currentTurn == 'b') {
//         currentTurn = 'w';
//     } else {
//         currentTurn = 'b';
//     }
//     deselectClicks();
//     clearClickables();
// }