

// 2nd way 

let board;
let context;
let blockSize = 20;
let cols = 30;
let rows = 20;

let appleAudio;
let gameOverAudio;

let snakeX = 0;
let snakeY = 0;
let tail = [];

let foodX;
let foodY;

let score = 0;

let velocityX = 1;
let velocityY = 0;

let gameOver = false;
let gameStarted = false;
let gameOverSoundPlayed = false;

let intervalId; // variable to store the interval id
let intervalDuration = 150; // Initial interval duration in milliseconds
let speedIncreaseFactor = 0.9; // Factor by which interval duration decreases when food is eaten



window.onload = () => {
    board = document.getElementById("board");
    context = board.getContext("2d");

    appleAudio = new Audio('./assets/apple_sound.mp3');
    gameOverAudio = new Audio('./assets/game_over_sound.mp3');

    board.width = cols * blockSize;
    board.height = rows * blockSize;

    document.getElementById("startButton").addEventListener('click', startGame);
    document.addEventListener('keyup', changeDirection);
}

function startGame() {
    if (intervalId) {
        clearInterval(intervalId); // clear existing interval
    }
    gameStarted = true;
    gameOver = false;
    gameOverSoundPlayed = false;
    tail = [];
    snakeX = 0;
    snakeY = 0;
    score = 0;
    velocityX = 1;
    velocityY = 0;

    //Hit Enter to restart the game
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && gameOver) {
          startGame(); // Call the startGame function to restart the game
        }
      });
   
    document.getElementById("startButton").style.display = "none";
    foodPlace();
    intervalId = setInterval(update, 1000 / 10); // store the new interval id
}

function update() {
    // Clear screen
    context.clearRect(0, 0, board.width, board.height);

    if (gameOver) {
        endGame();
        return;
    }

    // Write score
    createText(`Score: ${score}`, 30, 40);

    // Create first food
    createRect(foodX, foodY, blockSize, blockSize, "lime");

    // Did it eat
    if (snakeX == foodX && snakeY == foodY) {
        tail.push([foodX, foodY]);
        score += 10;
        appleAudio.play();
        foodPlace();

        // Decrease interval duration to increase speed
        intervalDuration *= speedIncreaseFactor;
        clearInterval(intervalId);
        intervalId = setInterval(update, intervalDuration);
    }

    // Snake tail
    for (let i = tail.length - 1; i > 0; i--) {
        tail[i] = tail[i - 1];
    }

    if (tail.length) {
        tail[0] = [snakeX, snakeY];
    }

    // Snake position
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    createRect(snakeX, snakeY, blockSize, blockSize, 'lime');

    for (let i = 0; i < tail.length; i++) { 
        createRect(tail[i][0], tail[i][1], blockSize, blockSize, 'lime');
    }

    // Hit the wall
    if (snakeX < 0 || snakeX > cols * blockSize || snakeY < 0 || snakeY > rows * blockSize) {
        gameOverEvent();
    }

    // Shot herself
    for (let i = 0; i < tail.length; i++) {
        if (snakeX == tail[i][0] && snakeY == tail[i][1]) {
            gameOverEvent();
        }
    }
}

function endGame() {
    if (!gameOverSoundPlayed) {
        gameOverAudio.play();
        gameOverSoundPlayed = true;
    }
    gameOver = true;
    context.clearRect(0, 0, board.width, board.height); // Clear the canvas
    createText(`Game Over`, board.width / 2, board.height / 2 - 80, 'center','bottom');
    createText(`Score: ${score}`, board.width / 2, board.height / 2 - 50, 'center', 'bottom');
    document.getElementById("startButton").style.display = "block";
}


function foodPlace() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function changeDirection(e) {
    if (e.code == "ArrowUp") {
        velocityX = 0;
        velocityY = -1;
    } else if (e.code == "ArrowDown") {
        velocityX = 0;
        velocityY = 1;
    } else if (e.code == "ArrowLeft") {
        velocityX = -1;
        velocityY = 0;
    } else if (e.code == "ArrowRight") {
        velocityX = 1;
        velocityY = 0;
    }
}

function gameOverEvent() {
    gameOver = true;
}

function createRect(x, y, width, height, color = "black") {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function createText(text, x, y, textAlign = "start", fontSize = 20 ) {
    context.fillStyle = "lime";
    context.font = `${fontSize}px Roboto Mono`;
    context.textAlign = textAlign;
    context.fillText(text, x, y)
}