// Calculating screen width, height
const screenWidth = document.documentElement.clientWidth;
const screenHeight = document.documentElement.clientHeight;
const isVertical = screenWidth < screenHeight;
const isComputer = navigator.userAgent.includes("Win");

// Setting object array, cell size
const levels = {
    "1":[[4, 0, 0, 0, 4],
        [0, 5, 0, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 2, 0, 0, 0],
        [4, 0, 0, 0, 4]],

    "2":[[0, 0, 0, 4, 4, 4, 4],
        [0, 0, 0, 4, 5, 0, 4],
        [0, 0, 0, 4, 0, 0, 4],
        [0, 0, 0, 4, 1, 2, 4],
        [4, 4, 4, 4, 0, 0, 4],
        [4, 0, 0, 0, 0, 0, 4],
        [4, 0, 1, 2, 0, 0, 4],
        [4, 4, 4, 4, 4, 4, 4]]
};

let objArr = levels[1];
let cellsOnX = objArr[0].length;
let cellsOnY = objArr.length;
let cellSize = calculateCellSize(cellsOnX, cellsOnY);

function calculateCellSize(cellsX, cellsY){
    let cellSizeY = Math.floor(screenHeight * 0.97 / cellsOnY);
    let cellSizeX = Math.floor(screenWidth * 0.98 / cellsOnX);
    let cellSize = cellSizeY - (cellSizeY - cellSizeX);
    return isComputer ? cellSize * 0.3 : cellSize;
};

// Calculating max game width and height
let maxWidth = cellSize * cellsOnX;
let maxHeight = cellSize * cellsOnY;


// Placing canvas, calculating it`s width, height
let canvasEl = document.querySelector("canvas");
canvasEl.width = maxWidth;
canvasEl.height = maxHeight;
canvasEl.style.top = (screenHeight - maxHeight) / 3 + "px";
canvasEl.style.left = (screenWidth - maxWidth) / 2 + "px";
let canvas = canvasEl.getContext('2d'); // Getting canvas image

//Player coordinates
let player = {};

// Setting button container position
function setBtnContainerPos(){
    let btnContainer = document.querySelector(".container");
    let btnContainerRect = btnContainer.getBoundingClientRect()

    if(isVertical){
        btnContainer.style.left = (screenWidth - btnContainerRect.width) / 3.5 + "px";
        btnContainer.style.top = screenHeight - btnContainerRect.height * 1.3 + "px";
    }
    else{
        btnContainer.style.left = (screenWidth - btnContainerRect.width) / 1.2 + "px";
        btnContainer.style.top = screenHeight - btnContainerRect.height * 1.3 + "px";
    };
};
setBtnContainerPos();

// Getting buttons
let up = document.getElementById("up");
let left = document.getElementById("left");
let right = document.getElementById("right");
let down = document.getElementById("down");
let center = document.getElementById("center");
let btnList = document.querySelectorAll(".btn");
setBtnSize();

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

// Creating coordinates array, drawing map first time
function createCoordinatesArr(){
    canvas.strokeStyle = "rgb(220, 212, 200)" //"darkorange"
    let coordinatesArr = [];
    for(let i = 0; i < cellsOnY; i++){
        coordinatesArr.push([]);
        for(let j = 0; j < cellsOnX; j++){
            coordinatesArr[i].push([j * cellSize, i * cellSize]);
            canvas.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
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
    return coordinatesArr;
};

let coordinatesArr = createCoordinatesArr();

function calculateCollisions(objX, objY, addX, addY){
    const whatIsAhead = objArr[objY + addY][objX + addX];
    const isCellAfterAheadInArray = objX + addX * 2 < objArr[0].length && objY + addY * 2 < objArr.length && objX + addX * 2 > -1 && objY + addY * 2 > -1;
    switch(whatIsAhead){
        case 0: return {canMove: true, before: 0, after: null}; // empty
        case 1: // target
            if(!isCellAfterAheadInArray || objArr[objY + addY * 2][objX + addX * 2] == 4 || objArr[objY + addY * 2][objX + addX * 2] == 3) return {canMove: false, before: null, after: null};
            if(objArr[objY + addY * 2][objX + addX * 2] == 2){
                countFreeTargets(-1);
                return {canMove: true, before: 0, after: 3};
            }
            else{
                return {canMove: true, before: 0, after: 1};
            }
        case 2: // place
            player.onPlace = true;
            return {canMove: true, before: 0, after: null};
        case 3: // target on place
            if(!isCellAfterAheadInArray || objArr[objY + addY * 2][objX + addX * 2] == 4) return {canMove: false, before: null, after: null};
            player.onPlace = true;
            return {canMove: true, before: 0, after: 1};
        case 4: // wall
            return {canMove: false, before: null, after: null};
    };
};

function countFreeTargets(count){
    for(row of objArr){
        for(obj of row){
            if(obj === 1) count++;
        };
    };
    if(!count) win();
};

function eraseObj(objX, objY){
    const coordinates = coordinatesArr[objY][objX];
    canvas.clearRect(coordinates[0], coordinates[1], cellSize, cellSize);
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
                player.onPlace = false;
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

function win(){
    let gameEndModal = document.querySelector(".game-end-modal");
    gameEndModal.style.display = "flex"
    let info = document.getElementById("info");
    info.innerText = "== You WON! ==";
    document.getElementById("repeat-btn").addEventListener("touchstart", e => {
        gameEndModal.style.display = "none"
        objArr = levels[2];
        cellsOnX = objArr[0].length;
        cellsOnY = objArr.length;
        cellSize = calculateCellSize(cellsOnX, cellsOnY);
        
        function calculateCellSize(cellsX, cellsY){
            let cellSizeY = Math.floor(screenHeight * 0.97 / cellsOnY);
            let cellSizeX = Math.floor(screenWidth * 0.98 / cellsOnX);
            let cellSize = cellSizeY - (cellSizeY - cellSizeX);
            return isComputer ? cellSize * 0.3 : cellSize;
        };
        
        // Calculating max game width and height
        maxWidth = cellSize * cellsOnX;
        maxHeight = cellSize * cellsOnY;
        
        
        // Placing canvas, calculating it`s width, height
        canvasEl = document.querySelector("canvas");
        canvasEl.width = maxWidth;
        canvasEl.height = maxHeight;
        canvasEl.style.top = (screenHeight - maxHeight) / 3 + "px";
        canvasEl.style.left = (screenWidth - maxWidth) / 2 + "px";
        canvas = canvasEl.getContext('2d'); // Getting canvas image
        
        //Player coordinates
        player = {};
        coordinatesArr = createCoordinatesArr();
    });
};

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
    };
});

//Keyboard "keyup" Listeners
document.addEventListener("keyup", (e) => {
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
});