let canvasEl = document.querySelector("canvas"); // Getting canvas

// Calculating canvas width, height and cell size;
let maxWidth, maxHeight, cellSize;
let screenWidth = window.screen.width;
let screenHeight = window.screen.height;
if(screenWidth < screenHeight){ // If vertical screen
    cellSize = Math.floor(screenHeight * 0.75 / 12);
    maxWidth = screenWidth * 0.99 - ((screenWidth * 0.99) % cellSize);
    maxHeight = screenHeight * 0.75 - ((screenHeight * 0.75) % cellSize);
}
else{
    if(navigator.userAgent.includes("Win")){ //If device is a computer
        // cellSize = Math.floor(screenWidth * 0.99 / 25);
        // maxWidth = screenWidth * 0.99 - ((screenWidth * 0.99) % cellSize);
        // maxHeight = screenHeight * 0.65  - ((screenHeight * 0.65) % cellSize);
        cellSize = Math.floor(screenWidth * 0.99 / 30);
        maxWidth = screenWidth * 0.99 - ((screenWidth * 0.99) % cellSize);
        maxHeight = screenHeight * 0.85  - ((screenHeight * 0.85) % cellSize);
        document.querySelector(".container").style.display = "none"
    }
    else{ // If horizontal screen
        cellSize = Math.floor(screenWidth * 0.99 / 20);
        maxWidth = screenWidth * 0.99 - ((screenWidth * 0.99) % cellSize);
        maxHeight = screenHeight * 0.75  - ((screenHeight * 0.75) % cellSize);
    }
};
canvasEl.width = maxWidth;
canvasEl.height = maxHeight;
let canvas = canvasEl.getContext('2d'); // Getting canvas image

// Getting buttons
let up = document.getElementById("up");
let left = document.getElementById("left");
let right = document.getElementById("right");
let down = document.getElementById("down");
let center = document.getElementById("center");
let btnList = [up, left, right, down, center];

// Setting buttons size
if(screenWidth < screenHeight){ //for vertical screen
    for(let i of btnList){
        i.style.width = `${screenWidth * 0.15}px`;
        i.style.height = `${screenWidth * 0.12}px`;
    };
}
else{ //for horizontal screen
    for(let i of btnList){
        i.style.width = `${screenWidth * 0.05}px`;
        i.style.height = `${screenWidth * 0.035}px`;
    };
};

// Creating 2d array
canvas.strokeStyle = "darkorange"
let gameFieldArr = [];
for(let i = 0; i < Math.floor(maxHeight / cellSize); i++){
    gameFieldArr.push([]);
    for(let j = 0; j < Math.floor(maxWidth / cellSize); j++){
        gameFieldArr[i].push([j * cellSize, i * cellSize]);
        canvas.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
    };
};

// Random cell
function randomSpawn(){
    let value = [Math.floor(Math.random() * (gameFieldArr[0].length - 2)) + 1, Math.floor(Math.random() * (gameFieldArr.length - 2)) + 1];
    console.log(value);
    return value;
};

// Player object
let player = {
    cell: [0, 0],
    color: "rgb(45,90,160)"
};

// Target objects
a = randomSpawn()
b = randomSpawn()
let targetList = [
    {
        cell: a,
        color: "rgb(255,210,0)"
    }
];

// Place objects
let placeList = [
    {
        cell: b,
        color: "rgb(200,5,35)"
    }
];

function drawObject(obj){
    canvas.fillStyle = obj.color;
    coordinates = gameFieldArr[obj.cell[1]][obj.cell[0]];
    canvas.fillRect(coordinates[0], coordinates[1], cellSize, cellSize);
};

function eraseObject(obj){
    coordinates = gameFieldArr[obj.cell[1]][obj.cell[0]];
    canvas.clearRect(coordinates[0], coordinates[1], cellSize, cellSize);
    canvas.strokeRect(coordinates[0], coordinates[1], cellSize, cellSize);
};

function calcPlayerCollisions(cell, addX, addY){
    for(target of targetList){
        let thereIsATarget = target.cell[0] === cell[0] + addX && target.cell[1] === cell[1] + addY;
        let targetCanMove = (target.cell[0] + addX < gameFieldArr[0].length && target.cell[1] + addY < gameFieldArr.length) && (target.cell[0] + addX > -1 && target.cell[1] + addY > -1);
        let onPlace = target.cell[0] + addX == placeList[0].cell[0] && target.cell[1] + addY == placeList[0].cell[1];
        if(thereIsATarget){
            if(targetCanMove){
                eraseObject(target);
                target.cell[0] += addX;
                target.cell[1] += addY;
                drawObject(target);
                if(onPlace){
                    eraseObject(target);
                    //targetList = [];
                    placeList[0].color = "darkorange" ; //"rgb(75,130,25)";
                    drawObject(placeList[0]);
                    placeList[0].color = "rgb(200,5,35)"
                    targetList[0].cell = randomSpawn();
                    placeList[0].cell = randomSpawn();
                    drawObject(targetList[0]);
                    drawObject(placeList[0]);
                }
                return true;
            }
            else{
                return false;
            };
        };
    };
    return true;
};

function renderMove(addX, addY){
    if((player.cell[0] + addX < gameFieldArr[0].length && player.cell[1] + addY < gameFieldArr.length) && (player.cell[0] + addX > -1 && player.cell[1] + addY > -1)){
        let canMove = calcPlayerCollisions(player.cell, addX, addY);
        if(canMove){
            eraseObject(player);
            player.cell[0] += addX;
            player.cell[1] += addY;
            drawObject(placeList[0]);
            drawObject(player);
        };
    };
};

drawObject(player);
drawObject(targetList[0]);
drawObject(placeList[0]);

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

//Keyboard Listeners
document.addEventListener("keydown", (e) => {
    if(e.code == "KeyW" || e.code == "ArrowUp"){
        renderMove(0, -1);
    }
    else if(e.code == "KeyD" || e.code == "ArrowRight"){
        renderMove(1, 0);
    }
    else if(e.code == "KeyS" || e.code == "ArrowDown"){
        renderMove(0, 1);
    }
    else if(e.code == "KeyA" || e.code == "ArrowLeft"){
        renderMove(-1, 0);
    }
})