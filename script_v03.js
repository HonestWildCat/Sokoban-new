// Calculating screen width, height
const screenWidth = document.documentElement.clientWidth;
const screenHeight = document.documentElement.clientHeight;
const isVertical = screenWidth < screenHeight;
const isComputer = navigator.userAgent.includes("Win");

// Levels
const levels = {
    "1":[[9, 0, 0, 0, 9],
         [0, 5, 0, 0, 0],
         [0, 0, 0, 1, 0],
         [0, 2, 0, 0, 0],
         [9, 0, 0, 0, 9]],

    "2":[[9, 9, 9, 4, 4, 4, 4],
         [9, 9, 9, 4, 0, 0, 4],
         [9, 9, 9, 4, 0, 0, 4],
         [9, 9, 9, 4, 1, 2, 4],
         [4, 4, 4, 4, 0, 0, 4],
         [4, 0, 0, 0, 0, 0, 4],
         [4, 5, 1, 2, 0, 0, 4],
         [4, 4, 4, 4, 4, 4, 4]],

     "3":[[9, 9, 4, 4, 4, 4, 4, 4, 9],
         [9, 9, 4, 0, 0, 0, 0, 4, 4],
         [4, 4, 4, 1, 4, 4, 0, 0, 4],
         [4, 2, 0, 0, 0, 1, 0, 0, 4],
         [4, 2, 0, 0, 4, 4, 0, 0, 4],
         [4, 6, 0, 4, 4, 0, 0, 0, 4],
         [4, 4, 0, 1, 0, 0, 0, 0, 4],
         [9, 4, 0, 0, 0, 0, 0, 4, 4],
         [9, 4, 4, 4, 4, 4, 4, 4, 9]],

     "4":[[4, 4, 4, 4, 4, 9, 9],
          [4, 0, 0, 0, 4, 4, 4],
          [4, 0, 0, 1, 5, 0, 4],
          [4, 2, 3, 3, 2, 0, 4],
          [4, 0, 1, 0, 0, 0, 4],
          [4, 4, 0, 0, 0, 4, 4],
          [9, 4, 0, 0, 4, 4, 9],
          [9, 4, 4, 4, 4, 9, 9]],

     "5":[[9, 9, 9, 4, 4, 4, 4, 9],
          [4, 4, 4, 4, 0, 0, 4, 4],
          [4, 0, 0, 2, 2, 2, 0, 4],
          [4, 0, 1, 2, 1, 2, 0, 4],
          [4, 4, 1, 1, 1, 0, 4, 4],
          [9, 4, 0, 5, 0, 0, 4, 9],
          [9, 4, 4, 4, 4, 4, 4, 9]]
};

let currLevel = 1;
let gotVictory = false;

let objArr, cellsOnX, cellsOnY, cellSize;
let maxWidth, maxHeight;
let canvasEl, canvas;

// Setting current level, object array, cell size
selectLevel();
// Calculating max width and height
maxGameSize();
// Placing canvas, calculating it`s width, height
placeCanvas();
// Setting button container position
let repeatBtn = document.getElementById("repeat-btn");
let nextBtn = document.getElementById("next-btn");
setBtnContainerPos();

// Getting buttons
let up = document.getElementById("up");
let left = document.getElementById("left");
let right = document.getElementById("right");
let down = document.getElementById("down");
let center = document.getElementById("center");
let btnList = document.querySelectorAll(".btn");
setBtnSize();

// Creating coordinates array, drawing map first time
let coordinatesArr;
createCoordinatesArr();


// FUNCTIONS

function selectLevel(){
    objArr = structuredClone(levels[currLevel]);
    // Cells amount, size
    cellsOnX = objArr[0].length;
    cellsOnY = objArr.length;
    cellSize = calculateCellSize(cellsOnX, cellsOnY);
}

function calculateCellSize(){
    let cellSizeY = Math.floor(screenHeight * 0.97 / cellsOnY);
    let cellSizeX = Math.floor(screenWidth * 0.98 / cellsOnX);
    let cellSize = cellSizeY - (cellSizeY - cellSizeX);
    return isComputer ? cellSize * 0.3 : cellSize;
};

function maxGameSize(){
    maxWidth = cellSize * cellsOnX;
    maxHeight = cellSize * cellsOnY;
}

function placeCanvas(){
    canvasEl = document.querySelector("canvas");
    canvasEl.width = maxWidth;
    canvasEl.height = maxHeight;
    canvasEl.style.top = (screenHeight - maxHeight) / 3 + "px";
    canvasEl.style.left = (screenWidth - maxWidth) / 2 + "px";
    canvas = canvasEl.getContext('2d'); // Getting canvas image
}

function setBtnContainerPos(){
    let btnContainer = document.querySelector(".container");
    document.querySelector(".game-end-modal-container").style.display = "none";
    let gameEndModal = document.querySelector(".game-end-modal");
    let btnContainerRect = btnContainer.getBoundingClientRect();

    if(isVertical){
        btnContainer.style.left = (screenWidth - btnContainerRect.width) / 3.5 + "px";
        btnContainer.style.top = screenHeight - btnContainerRect.height * 1.3 + "px";
        gameEndModal.classList.add("vertical");
        repeatBtn.classList.add("vertical");
        nextBtn.classList.add("vertical");
    }
    else{
        btnContainer.style.left = (screenWidth - btnContainerRect.width) / 1.2 + "px";
        btnContainer.style.top = screenHeight - btnContainerRect.height * 1.3 + "px";
        gameEndModal.classList.add("horisontal");
        repeatBtn.classList.add("horisontal");
        nextBtn.classList.add("horisontal");
    };
};

function setBtnSize(){
    if(isVertical){
        for(let i of btnList){
            i.style.width = `${screenWidth * 0.15}px`;
            i.style.height = `${screenWidth * 0.12}px`;
        };
    }
    else{
        for(let i of btnList){
            i.style.width = `${screenWidth * 0.05}px`;
            i.style.height = `${screenWidth * 0.035}px`;
        };
    };
};

function createCoordinatesArr(){
    canvas.strokeStyle = "rgb(220, 212, 200)"
    coordinatesArr = [];
    for(let i = 0; i < cellsOnY; i++){
        coordinatesArr.push([]);
        for(let j = 0; j < cellsOnX; j++){
            coordinatesArr[i].push([j * cellSize, i * cellSize]);
            if(objArr[i][j] != 9){ // 9 - not painted
                canvas.fillStyle = "rgb(248, 243, 234)";
                canvas.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                canvas.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
            switch(objArr[i][j]){
                // 0 - empty
                case 1: // target
                    canvas.fillStyle = "#FCD88A";
                    canvas.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                    break;
                case 2: // place
                    canvas.fillStyle = "#AB4E52";
                    canvas.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                    break;
                case 3: // target on place
                    canvas.fillStyle = "#87A96B";
                    canvas.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                    break;
                case 4: // wall
                    canvas.fillStyle = "#A2ACB8";
                    canvas.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                    break;
                case 5: // player
                    canvas.fillStyle = "#5072A7";
                        canvas.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                        player = {
                            x: j,
                            y: i,
                            onPlace: false
                        };
                        break;
                case 6: // player on place
                    canvas.fillStyle = "#5072A7";
                    canvas.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                    player = {
                        x: j,
                        y: i,
                        onPlace: true
                    };
                    break;
            };

        };
    };
};


function calculateCollisions(objX, objY, addX, addY){
    const whatIsAhead = objArr[objY + addY][objX + addX];
    const isCellAfterAheadInArray = objX + addX * 2 < objArr[0].length && objY + addY * 2 < objArr.length && objX + addX * 2 > -1 && objY + addY * 2 > -1;
    switch(whatIsAhead){
        case 0: return {canMove: true, before: 0, after: null}; // empty
        case 1: // target
            if(!isCellAfterAheadInArray || objArr[objY + addY * 2][objX + addX * 2] == 4 || objArr[objY + addY * 2][objX + addX * 2] == 3 || objArr[objY + addY * 2][objX + addX * 2] == 9) return {canMove: false, before: null, after: null};
            if(objArr[objY + addY * 2][objX + addX * 2] == 2){
                countFreeTargets(-1);
                return {canMove: true, before: 0, after: 3};
            }
            else if(objArr[objY + addY * 2][objX + addX * 2] == 1){
                return {canMove: false, before: null, after: null};
            }
            else{
                return {canMove: true, before: 0, after: 1};
            }
        case 2: // place
            player.onPlace = true;
            return {canMove: true, before: 0, after: null};
        case 3: // target on place
            if(!isCellAfterAheadInArray || objArr[objY + addY * 2][objX + addX * 2] == 4 || objArr[objY + addY * 2][objX + addX * 2] == 3 || objArr[objY + addY * 2][objX + addX * 2] == 9) return {canMove: false, before: null, after: null};
            player.onPlace = true;
            return (objArr[objY + addY * 2][objX + addX * 2] == 2) ? {canMove: true, before: 0, after: 3} : {canMove: true, before: 0, after: 1};
        case 4: // wall
        case 9: 
            return {canMove: false, before: null, after: null};
    };
};

function countFreeTargets(count){
    for(row of objArr){
        for(obj of row){
            if(obj === 1) count++;
        };
    };
    if(!count) victory();
};

function eraseObj(objX, objY){
    const coordinates = coordinatesArr[objY][objX];
    canvas.fillStyle = "rgb(248, 243, 234)";
    canvas.fillRect(coordinates[0], coordinates[1], cellSize, cellSize);
    canvas.strokeRect(coordinates[0], coordinates[1], cellSize, cellSize);
};

function drawObj(objX, objY, objNum){
    switch(objNum){
        case 0: return;
        case 1: canvas.fillStyle = "#FCD88A"; break;
        case 2: canvas.fillStyle = "#AB4E52"; break;
        case 3: canvas.fillStyle = "#87A96B"; break;
        case 4: canvas.fillStyle = "#A2ACB8"; break;
        case 5:
        case 6: canvas.fillStyle = "#5072A7"; break;
    }
    const coordinates = coordinatesArr[objY][objX];
    canvas.fillRect(coordinates[0], coordinates[1], cellSize, cellSize);
};

function renderMove(addX, addY){
    const isInArray = player.x + addX < objArr[0].length && player.y + addY < objArr.length && player.x + addX > -1 && player.y + addY > -1;
    const playerOnPlace = player.onPlace;
    if(isInArray){
        const collisions = calculateCollisions(player.x, player.y, addX, addY);
        if(collisions.canMove){
            eraseObj(player.x, player.y);
            // set obj before player
            if(collisions.before !== null){
                objArr[player.y][player.x] = collisions.before;
                drawObj(player.x, player.y, collisions.before);
            };
            if(playerOnPlace){
                objArr[player.y][player.x] = 2;
                drawObj(player.x, player.y, 2);
                player.onPlace = (objArr[player.y + addY][player.x + addX] == 2 || objArr[player.y + addY][player.x + addX] == 3);
            };
            // set player
            player.x += addX;
            player.y += addY;
            objArr[player.y][player.x] = (playerOnPlace) ? 6 : 5;
            drawObj(player.x, player.y, (playerOnPlace) ? 6 : 5);
            // set obj after player
            if(collisions.after !== null){
                objArr[player.y + addY][player.x + addX] = collisions.after;
                drawObj(player.x + addX, player.y + addY, collisions.after);
            };
        };
    };
};

function victory(){
    gotVictory = true;
    document.querySelector(".game-end-modal-container").style.display = "flex";
};

function repeatLevel(){
    gotVictory = false;
    currLevel = currLevel;

    // Setting current level, object array, cell size
    selectLevel();
    // Calculating max width and height
    maxGameSize();
    // Placing canvas, calculating it`s width, height
    placeCanvas();
    // Getting buttons
    setBtnSize();
    document.querySelector(".game-end-modal-container").style.display = "none";
    // Creating coordinates array, drawing map first time
    createCoordinatesArr();
}

function nextLevel(){
    gotVictory = false;

    currLevel = (currLevel > 4) ? 1 : currLevel + 1;
    console.log(currLevel)

    // Setting current level, object array, cell size
    selectLevel();
    // Calculating max width and height
    maxGameSize();
    // Placing canvas, calculating it`s width, height
    placeCanvas();
    // Getting buttons
    setBtnSize();
    document.querySelector(".game-end-modal-container").style.display = "none";
    // Creating coordinates array, drawing map first time
    createCoordinatesArr();
}

// Touchstart listeners
up.addEventListener("touchstart", e => {
    up.classList.add("active");
    renderMove(0, -1);
}, {passive: true});

right.addEventListener("touchstart", e => {
    right.classList.add("active");
    renderMove(1, 0);
}, {passive: true});

down.addEventListener("touchstart", e => {
    down.classList.add("active");
    renderMove(0, 1);
}, {passive: true});

left.addEventListener("touchstart", e => {
    left.classList.add("active");
    renderMove(-1, 0);
}, {passive: true});

// Touchend listeners
up.addEventListener("touchend", e => {
    up.classList.remove("active");
}, {passive: true});

right.addEventListener("touchend", e => {
    right.classList.remove("active");
}, {passive: true});

down.addEventListener("touchend", e => {
    down.classList.remove("active");
}, {passive: true});

left.addEventListener("touchend", e => {
    left.classList.remove("active");
}, {passive: true});

//Keyboard "keydown" Listeners
document.addEventListener("keydown", (e) => {
    if(!gotVictory){
        if(e.code == "KeyW" || e.code == "ArrowUp"){
            renderMove(0, -1);
            up.classList.add("active");
        }
        else if(e.code == "KeyD" || e.code == "ArrowRight"){
            renderMove(1, 0);
            right.classList.add("active");
        }
        else if(e.code == "KeyS" || e.code == "ArrowDown"){
            renderMove(0, 1);
            down.classList.add("active");
        }
        else if(e.code == "KeyA" || e.code == "ArrowLeft"){
            renderMove(-1, 0);
            left.classList.add("active");
        }
        else if(e.code == "KeyV"){
            victory();
        }
        else if(e.code == "KeyR"){
            repeatLevel();
        };
    };
});

//Keyboard "keyup" Listeners
document.addEventListener("keyup", (e) => {
    if(!gotVictory){
        if(e.code == "KeyW" || e.code == "ArrowUp"){
            up.classList.remove("active");
        }
        else if(e.code == "KeyD" || e.code == "ArrowRight"){
            right.classList.remove("active");
        }
        else if(e.code == "KeyS" || e.code == "ArrowDown"){
            down.classList.remove("active");
        }
        else if(e.code == "KeyA" || e.code == "ArrowLeft"){
            left.classList.remove("active");
        };
    }; 
});

if(isComputer){
    repeatBtn.addEventListener("click", e => {
        repeatLevel();
    }, {passive: true});
    nextBtn.addEventListener("click", e => {
        nextLevel();
    }, {passive: true});
}
else{
    repeatBtn.addEventListener("touchstart", e => {
        repeatLevel();
    }, {passive: true});
    nextBtn.addEventListener("click", e => {
        nextLevel();
    }, {passive: true});
};