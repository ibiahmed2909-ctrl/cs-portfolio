// Snake Game Implementation

let snakeGame = null;
let snakeInterval = null;

class SnakeGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { alpha: false });
        
        // Responsive canvas sizing
        const size = Math.min(canvas.parentElement.clientWidth - 32, 500);
        canvas.width = size;
        canvas.height = size;
        
        this.gridSize = 20;
        this.cellSize = canvas.width / this.gridSize;
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.food = this.generateFood();
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameOver = false;
        this.speed = 120;
        
        // Performance optimization
        this.ctx.imageSmoothingEnabled = false;
        
        this.setupControls();
        this.updateScore();
    }

    setupControls() {
        this.keyHandler = (e) => {
            const key = e.key;
            
            // Prevent default arrow key scrolling
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
                e.preventDefault();
            }

            if (key === 'ArrowUp' && this.direction.y === 0) {
                this.nextDirection = { x: 0, y: -1 };
            } else if (key === 'ArrowDown' && this.direction.y === 0) {
                this.nextDirection = { x: 0, y: 1 };
            } else if (key === 'ArrowLeft' && this.direction.x === 0) {
                this.nextDirection = { x: -1, y: 0 };
            } else if (key === 'ArrowRight' && this.direction.x === 0) {
                this.nextDirection = { x: 1, y: 0 };
            }
        };

        document.addEventListener('keydown', this.keyHandler);
    }

    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }

    update() {
        if (this.gameOver) return;

        this.direction = { ...this.nextDirection };

        const head = {
            x: this.snake[0].x + this.direction.x,
            y: this.snake[0].y + this.direction.y
        };

        // Check wall collision
        if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
            this.endGame();
            return;
        }

        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.endGame();
            return;
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.food = this.generateFood();
            this.playEatSound();
            
            // Increase speed slightly
            if (this.speed > 50) {
                this.speed -= 2;
                this.restart();
            }
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    draw() {
        // Clear canvas with solid color (faster than gradients)
        this.ctx.fillStyle = '#0a0a0f';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw minimal grid (performance optimization)
        this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.gridSize; i += 2) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.canvas.height);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.cellSize);
            this.ctx.lineTo(this.canvas.width, i * this.cellSize);
            this.ctx.stroke();
        }

        // Draw snake (optimized for performance)
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Head - bright cyan with glow
                this.ctx.fillStyle = '#00ffff';
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#00ffff';
            } else {
                // Body - gradient from cyan to purple
                const opacity = 1 - (index / this.snake.length) * 0.4;
                const ratio = index / this.snake.length;
                const r = Math.floor(0 + (176 * ratio));
                const g = Math.floor(240 - (240 * ratio));
                const b = 255;
                this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                this.ctx.shadowBlur = 5;
                this.ctx.shadowColor = ratio > 0.5 ? '#b000ff' : '#00f0ff';
            }
            
            this.ctx.fillRect(
                segment.x * this.cellSize + 1,
                segment.y * this.cellSize + 1,
                this.cellSize - 2,
                this.cellSize - 2
            );
        });

        this.ctx.shadowBlur = 0;

        // Draw food with simple pulsing effect (optimized)
        const time = Date.now() / 300;
        const pulse = Math.sin(time) * 0.2 + 1;
        
        this.ctx.fillStyle = '#d000ff';
        this.ctx.shadowBlur = 15 * pulse;
        this.ctx.shadowColor = '#d000ff';
        
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.cellSize + this.cellSize / 2,
            this.food.y * this.cellSize + this.cellSize / 2,
            (this.cellSize / 2 - 1) * pulse,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        this.ctx.shadowBlur = 0;
    }

    updateScore() {
        document.getElementById('snakeScore').textContent = this.score;
        document.getElementById('snakeHigh').textContent = this.highScore;
    }

    endGame() {
        this.gameOver = true;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.updateScore();
        }

        // Draw game over screen
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#00f0ff';
        this.ctx.font = 'bold 48px Orbitron';
        this.ctx.textAlign = 'center';
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#00f0ff';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 30);
        
        this.ctx.fillStyle = '#b000ff';
        this.ctx.font = 'bold 24px Orbitron';
        this.ctx.shadowColor = '#b000ff';
        this.ctx.fillText(`SCORE: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        
        this.ctx.shadowBlur = 0;
        this.ctx.textAlign = 'left';
    }

    playEatSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    restart() {
        clearInterval(snakeInterval);
        snakeInterval = setInterval(() => this.update(), this.speed);
    }

    destroy() {
        document.removeEventListener('keydown', this.keyHandler);
        clearInterval(snakeInterval);
    }
}

function initSnake() {
    const canvas = document.getElementById('snakeGame');
    snakeGame = new SnakeGame(canvas);
    snakeInterval = setInterval(() => snakeGame.update(), snakeGame.speed);
}

function stopSnake() {
    if (snakeGame) {
        snakeGame.destroy();
        snakeGame = null;
    }
}

function restartSnake() {
    stopSnake();
    initSnake();
}