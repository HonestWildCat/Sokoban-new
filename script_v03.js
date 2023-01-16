// Calculating screen width, height and cell size;
const screenWidth = document.documentElement.clientWidth;
const screenHeight = document.documentElement.clientHeight;
const isVertical = screenWidth < screenHeight;
const isComputer = navigator.userAgent.includes("Win");

let cellSize = calculateCellSize(50);
let maxWidth = screenWidth * 0.98 - ((screenWidth * 0.98) % cellSize);
let maxHeight = (isComputer) ? screenHeight * 0.97 - ((screenHeight * 0.97) % cellSize) : screenHeight * 0.97 - ((screenHeight * 0.97) % cellSize);


function calculateCellSize(cells){
    let cellSize;
    if(screenWidth < screenHeight){
        cellSize = Math.floor(screenHeight * 0.97 / cells);
    }
    else{
        cellSize = Math.floor(screenWidth * 0.99 / cells);
    };
    return cellSize;
};

// Setting canvas width, height
let canvasEl = document.querySelector("canvas"); // Getting canvas
canvasEl.width = maxWidth;
canvasEl.height = maxHeight;
let canvas = canvasEl.getContext('2d'); // Getting canvas image

// Setting button container position
function setBtnContainerPos(){
    let btnContainer = document.querySelector(".container");
    let btnContainerRect = btnContainer.getBoundingClientRect()

    if(isVertical){
        btnContainer.style.left = screenWidth / 2 - btnContainerRect.width + "px";
        btnContainer.style.top = maxHeight - btnContainerRect.height - 5 + "px";
    }
    else{
        btnContainer.style.left = maxWidth - btnContainerRect.width - (maxWidth * 0.1) + "px";
        btnContainer.style.top = maxHeight - btnContainerRect.height - 5 + "px";
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

// Setting buttons size
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

// Creating coordinates array, objects Array, drawing cells
canvas.strokeStyle = "rgb(220, 212, 200)" //"darkorange"
let coordinatesArr = [];
let objArr = [];
for(let i = 0; i < Math.floor(maxHeight / cellSize); i++){
    coordinatesArr.push([]);
    objArr.push([]);
    for(let j = 0; j < Math.floor(maxWidth / cellSize); j++){
        coordinatesArr[i].push([j * cellSize, i * cellSize]);
        objArr[i].push([0]);
        canvas.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
    };
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
    };
});