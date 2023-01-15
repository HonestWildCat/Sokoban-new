// Getting canvas
let canvas = document.querySelector("canvas");
let maxWidth = window.screen.width * 0.96;
let maxHeight = window.screen.height * 0.75;
canvas.width = maxWidth;
canvas.height = maxHeight;
let img = canvas.getContext('2d');

// Getting buttons
let up = document.getElementById("up");
let left = document.getElementById("left");
let right = document.getElementById("right");
let down = document.getElementById("down");

// X and Y - starting values
let player = {
    x1: 15,
    y1: 15,
    x2: () => this.x1 + this.width,
    y2: () => this.y1 + this.height,
    width: 50,
    height: 50,
};
let x = 15;
let y = 15;

// Drawing square first time
img.fillStyle = "rgba(2,25,200,0.7)"
img.fillRect(x, y, 50, 50);

// Drawing target
img.fillStyle = "rgba(255,255,0,0.7)"
img.fillRect(115, 115, 50, 50);
let target = [115, 115];

// Drawing place
img.fillStyle = "rgba(255,25,65,0.7)"
img.fillRect(315, 315, 50, 50);
img.fillStyle = "orange"
img.fillRect(319, 319, 42, 42);

// Touchstart listeners
up.addEventListener("touchstart", e => {
    up.classList.add("active");
    movePlayer(0, -50);
});

right.addEventListener("touchstart", e => {
    right.classList.add("active");
    movePlayer(50, 0);
    calculateCollision()
});

down.addEventListener("touchstart", e => {
    down.classList.add("active");
    movePlayer(0, 50);
});

left.addEventListener("touchstart", e => {
    left.classList.add("active");
    movePlayer(-50, 0);
});

// Touchend listeners
up.addEventListener("touchend", e => {
    up.classList.remove("active");
});

right.addEventListener("touchend", e => {
    right.classList.remove("active");
});

down.addEventListener("touchend", e => {
    down.classList.remove("active");
});

left.addEventListener("touchend", e => {
    left.classList.remove("active");
});

// Square moving function
function movePlayer(xAdd, yAdd){
    if((x + 50 + xAdd) < maxWidth && (x + xAdd) > 0 && (y + 50 + yAdd) < maxHeight && (y + yAdd) > 0){
        img.clearRect(x - 1, y - 1, 53, 53);
        x += xAdd;
        y += yAdd;
        img.fillStyle = "rgba(2,25,200,0.7)"
        img.fillRect(x, y, 50, 50);
    };
    
};

function calculateCollision(x1, y1){
    if(x >= target[0] && y == target[1]){
        target[0] += 50
        img.fillStyle = "rgba(255,255,0,0.7)"
        img.fillRect(target[0], target[1], 50, 50);
    };
};