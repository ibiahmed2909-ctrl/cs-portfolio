// Memory Card Game Implementation

let memoryGame = null;
let memoryTimer = null;

class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.time = 0;
        this.gameStarted = false;
        this.isProcessing = false;
        
        // Card symbols with cyberpunk theme
        this.symbols = ['⚡', '🔮', '💎', '🌟', '🔥', '⚙️', '🎯', '👾'];
        
        this.init();
    }

    init() {
        const gameGrid = document.getElementById('memoryGame');
        gameGrid.innerHTML = '';
        
        // Create card pairs
        const cardPairs = [...this.symbols, ...this.symbols];
        this.shuffle(cardPairs);
        
        // Create card elements
        cardPairs.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.symbol = symbol;
            card.dataset.index = index;
            
            const cardFront = document.createElement('div');
            cardFront.className = 'memory-card-front';
            cardFront.innerHTML = '?';
            
            const cardBack = document.createElement('div');
            cardBack.className = 'memory-card-back';
            cardBack.innerHTML = symbol;
            
            card.appendChild(cardFront);
            card.appendChild(cardBack);
            
            card.addEventListener('click', () => this.flipCard(card));
            
            gameGrid.appendChild(card);
            this.cards.push(card);
        });
        
        this.updateStats();
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    flipCard(card) {
        if (this.isProcessing) return;
        if (card.classList.contains('flipped')) return;
        if (card.classList.contains('matched')) return;
        if (this.flippedCards.length >= 2) return;
        
        // Start timer on first move
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.startTimer();
        }
        
        card.classList.add('flipped');
        this.flippedCards.push(card);
        this.playFlipSound();
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateStats();
            this.checkMatch();
        }
    }

    checkMatch() {
        this.isProcessing = true;
        const [card1, card2] = this.flippedCards;
        const symbol1 = card1.dataset.symbol;
        const symbol2 = card2.dataset.symbol;
        
        if (symbol1 === symbol2) {
            // Match found!
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                this.matchedPairs++;
                this.playMatchSound();
                
                if (this.matchedPairs === this.symbols.length) {
                    this.gameWon();
                }
                
                this.flippedCards = [];
                this.isProcessing = false;
            }, 600);
        } else {
            // No match
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                this.flippedCards = [];
                this.isProcessing = false;
            }, 1000);
        }
    }

    startTimer() {
        memoryTimer = setInterval(() => {
            this.time++;
            this.updateStats();
        }, 1000);
    }

    updateStats() {
        document.getElementById('memoryMoves').textContent = this.moves;
        const minutes = Math.floor(this.time / 60);
        const seconds = this.time % 60;
        document.getElementById('memoryTime').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    gameWon() {
        clearInterval(memoryTimer);
        
        setTimeout(() => {
            const gameGrid = document.getElementById('memoryGame');
            gameGrid.innerHTML = '';
            
            const winMessage = document.createElement('div');
            winMessage.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                gap: 1rem;
                font-family: 'Orbitron', sans-serif;
                text-align: center;
            `;
            
            const title = document.createElement('h3');
            title.textContent = 'VICTORY!';
            title.style.cssText = `
                font-size: 3rem;
                color: #00f0ff;
                text-shadow: 0 0 20px rgba(0, 240, 255, 0.8);
                margin: 0;
            `;
            
            const stats = document.createElement('p');
            stats.innerHTML = `
                <span style="color: #b000ff;">MOVES:</span> ${this.moves}<br>
                <span style="color: #b000ff;">TIME:</span> ${document.getElementById('memoryTime').textContent}
            `;
            stats.style.cssText = `
                font-size: 1.5rem;
                color: #fff;
                line-height: 2;
            `;
            
            const emoji = document.createElement('div');
            emoji.textContent = '🎉';
            emoji.style.cssText = `
                font-size: 4rem;
                animation: bounce 1s infinite;
            `;
            
            winMessage.appendChild(emoji);
            winMessage.appendChild(title);
            winMessage.appendChild(stats);
            gameGrid.appendChild(winMessage);
            
            this.playWinSound();
        }, 500);
    }

    playFlipSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 600;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    }

    playMatchSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 1000;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }

    playWinSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        [800, 1000, 1200].forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = freq;
            oscillator.type = 'sine';

            const startTime = audioContext.currentTime + (index * 0.1);
            gainNode.gain.setValueAtTime(0.3, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    }

    destroy() {
        clearInterval(memoryTimer);
    }
}

function initMemory() {
    memoryGame = new MemoryGame();
}

function stopMemory() {
    if (memoryGame) {
        memoryGame.destroy();
        memoryGame = null;
    }
}

function restartMemory() {
    stopMemory();
    initMemory();
}