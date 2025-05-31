const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let gameOver = false;
let score = 0;

function draw() {
    ctx.fillStyle = '#2196f3'; // blue background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = '#fff'; // white snake
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Draw food
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // Draw score
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

function update() {
    if (gameOver) return;

    // Move snake
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver = true;
        alert('Game Over! Your score: ' + score);
        return;
    }

    // Check self collision
    for (let part of snake) {
        if (part.x === head.x && part.y === head.y) {
            gameOver = true;
            alert('Game Over! Your score: ' + score);
            return;
        }
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
    } else {
        snake.pop();
    }
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    // Avoid placing food on the snake
    for (let part of snake) {
        if (part.x === food.x && part.y === food.y) {
            placeFood();
            return;
        }
    }
}

function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        setTimeout(gameLoop, 100);
    }
}

document.addEventListener('keydown', e => {
    if (gameOver && (e.key === 'r' || e.key === 'R')) {
        // Reset game state
        snake = [{ x: 10, y: 10 }];
        direction = { x: 0, y: 0 };
        food = { x: 15, y: 15 };
        gameOver = false;
        score = 0;
        draw();
        // Start moving after first key press again
        window.addEventListener('keydown', startGameOnce);
        return;
    }
    switch (e.key) {
        case 'ArrowUp': if (direction.y !== 1) direction = { x: 0, y: -1 }; break;
        case 'ArrowDown': if (direction.y !== -1) direction = { x: 0, y: 1 }; break;
        case 'ArrowLeft': if (direction.x !== 1) direction = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (direction.x !== -1) direction = { x: 1, y: 0 }; break;
    }
});

function startGameOnce() {
    if (direction.x !== 0 || direction.y !== 0) return;
    direction = { x: 1, y: 0 };
    gameLoop();
    window.removeEventListener('keydown', startGameOnce);
}


draw();
// Start moving after first key press
window.addEventListener('keydown', function startGameOnce() {
    if (direction.x !== 0 || direction.y !== 0) return;
    direction = { x: 1, y: 0 };
    gameLoop();
    window.removeEventListener('keydown', startGameOnce);
});