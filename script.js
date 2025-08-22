// Game Logic
class GunWaterSnakeGame {
    constructor() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.drawScore = 0;
        this.choices = {
            water: { value: -1, icon: 'fas fa-tint', beats: 'gun' },
            gun: { value: 0, icon: 'fas fa-gun', beats: 'snake' },
            snake: { value: 1, icon: 'fas fa-snake', beats: 'water' }
        };
        this.init();
    }

    init() {
        this.initParticles();
        this.bindEvents();
        this.updateScoreboard();
    }

    initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: {
                        value: 80,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: '#ffffff'
                    },
                    shape: {
                        type: 'circle',
                        stroke: {
                            width: 0,
                            color: '#000000'
                        }
                    },
                    opacity: {
                        value: 0.5,
                        random: false,
                        anim: {
                            enable: false,
                            speed: 1,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: {
                            enable: false,
                            speed: 40,
                            size_min: 0.1,
                            sync: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#ffffff',
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false,
                        attract: {
                            enable: false,
                            rotateX: 600,
                            rotateY: 1200
                        }
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: {
                            enable: true,
                            mode: 'grab'
                        },
                        onclick: {
                            enable: true,
                            mode: 'push'
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 140,
                            line_linked: {
                                opacity: 1
                            }
                        },
                        push: {
                            particles_nb: 4
                        }
                    }
                },
                retina_detect: true
            });
        }
    }

    bindEvents() {
        // Choice buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const choice = e.currentTarget.dataset.choice;
                this.playGame(choice);
            });
        });

        // Play again button
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.resetRound();
        });

        // Reset scores button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });

        // Add hover effects to choice buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                this.playHoverSound();
            });
        });
    }

    playGame(playerChoice) {
        const computerChoice = this.getComputerChoice();
        const result = this.determineWinner(playerChoice, computerChoice);
        
        this.hideInstructions();
        this.displayBattle(playerChoice, computerChoice, result);
        this.updateScores(result);
        this.updateScoreboard();
        this.playResultSound(result);
    }

    getComputerChoice() {
        const choices = Object.keys(this.choices);
        return choices[Math.floor(Math.random() * choices.length)];
    }

    determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return 'draw';
        }
        
        if (this.choices[playerChoice].beats === computerChoice) {
            return 'win';
        } else {
            return 'lose';
        }
    }

    hideInstructions() {
        const instructions = document.getElementById('instructions');
        instructions.style.display = 'none';
    }

    displayBattle(playerChoice, computerChoice, result) {
        // Hide choice section and show result
        document.querySelector('.choice-section').style.display = 'none';
        document.getElementById('gameResult').style.display = 'block';

        // Display player choice
        const playerIcon = document.getElementById('playerIcon');
        const playerText = document.getElementById('playerText');
        playerIcon.className = this.choices[playerChoice].icon;
        playerText.textContent = this.capitalizeFirst(playerChoice);

        // Display computer choice with animation delay
        setTimeout(() => {
            const computerIcon = document.getElementById('computerIcon');
            const computerText = document.getElementById('computerText');
            computerIcon.className = this.choices[computerChoice].icon;
            computerText.textContent = this.capitalizeFirst(computerChoice);

            // Show result message
            setTimeout(() => {
                this.displayResultMessage(result, playerChoice, computerChoice);
            }, 500);
        }, 300);
    }

    displayResultMessage(result, playerChoice, computerChoice) {
        const resultMessage = document.getElementById('resultMessage');
        let message = '';
        let className = '';

        switch (result) {
            case 'win':
                message = '🎉 You Win! 🎉';
                className = 'win';
                break;
            case 'lose':
                message = '💀 You Lose! 💀';
                className = 'lose';
                break;
            case 'draw':
                message = '🤝 It\'s a Draw! 🤝';
                className = 'draw';
                break;
        }

        resultMessage.textContent = message;
        resultMessage.className = `result-message ${className}`;

        // Add explanation
        const explanation = this.getResultExplanation(result, playerChoice, computerChoice);
        if (explanation) {
            setTimeout(() => {
                const explanationEl = document.createElement('div');
                explanationEl.className = 'result-explanation';
                explanationEl.style.cssText = `
                    font-size: 1.2rem;
                    color: rgba(255, 255, 255, 0.9);
                    margin-top: 15px;
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                `;
                explanationEl.textContent = explanation;
                resultMessage.appendChild(explanationEl);
            }, 800);
        }
    }

    getResultExplanation(result, playerChoice, computerChoice) {
        if (result === 'draw') return null;
        
        const winnerChoice = result === 'win' ? playerChoice : computerChoice;
        const loserChoice = result === 'win' ? computerChoice : playerChoice;
        
        const explanations = {
            'water-gun': 'Water rusts the Gun!',
            'gun-snake': 'Gun shoots the Snake!',
            'snake-water': 'Snake drinks the Water!'
        };
        
        return explanations[`${winnerChoice}-${loserChoice}`] || '';
    }

    updateScores(result) {
        switch (result) {
            case 'win':
                this.playerScore++;
                break;
            case 'lose':
                this.computerScore++;
                break;
            case 'draw':
                this.drawScore++;
                break;
        }
    }

    updateScoreboard() {
        document.getElementById('playerScore').textContent = this.playerScore;
        document.getElementById('computerScore').textContent = this.computerScore;
        document.getElementById('drawScore').textContent = this.drawScore;
    }

    resetRound() {
        document.querySelector('.choice-section').style.display = 'block';
        document.getElementById('gameResult').style.display = 'none';
        document.getElementById('instructions').style.display = 'block';
    }

    resetGame() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.drawScore = 0;
        this.updateScoreboard();
        this.resetRound();
        
        // Show confirmation
        this.showNotification('Game Reset! 🔄', 'success');
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    playHoverSound() {
        // Placeholder for sound effect
        // You can add Web Audio API sound effects here
    }

    playResultSound(result) {
        // Placeholder for result sound effects
        // You can add different sounds for win/lose/draw
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#4ade80' : '#3b82f6'};
            color: white;
            border-radius: 10px;
            font-weight: 600;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideInRight 0.5s ease;
        `;
        notification.textContent = message;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.5s ease reverse';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new GunWaterSnakeGame();
    
    // Add some fun interactive elements
    addFloatingElements();
    addKeyboardSupport(game);
});

// Add floating emoji elements for visual appeal
function addFloatingElements() {
    const emojis = ['💧', '🔫', '🐍', '⚡', '💫', '🎮'];
    
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance every interval
            createFloatingElement(emojis[Math.floor(Math.random() * emojis.length)]);
        }
    }, 2000);
}

function createFloatingElement(emoji) {
    const element = document.createElement('div');
    element.textContent = emoji;
    element.style.cssText = `
        position: fixed;
        font-size: 2rem;
        pointer-events: none;
        z-index: 1000;
        animation: float 4s ease-in-out forwards;
        left: ${Math.random() * window.innerWidth}px;
        top: ${window.innerHeight + 50}px;
    `;

    // Add floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            to {
                transform: translateY(-${window.innerHeight + 100}px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(element);

    // Remove element after animation
    setTimeout(() => {
        document.body.removeChild(element);
    }, 4000);
}

// Add keyboard support
function addKeyboardSupport(game) {
    document.addEventListener('keydown', (e) => {
        switch (e.key.toLowerCase()) {
            case 'w':
                if (document.querySelector('.choice-section').style.display !== 'none') {
                    game.playGame('water');
                }
                break;
            case 'g':
                if (document.querySelector('.choice-section').style.display !== 'none') {
                    game.playGame('gun');
                }
                break;
            case 's':
                if (document.querySelector('.choice-section').style.display !== 'none') {
                    game.playGame('snake');
                }
                break;
            case ' ': // Spacebar for play again
                if (document.getElementById('gameResult').style.display !== 'none') {
                    e.preventDefault();
                    game.resetRound();
                }
                break;
            case 'r': // R for reset
                game.resetGame();
                break;
        }
    });

    // Show keyboard shortcuts notification on first load
    setTimeout(() => {
        game.showNotification('💡 Tip: Use W (Water), G (Gun), S (Snake), Space (Play Again), R (Reset)', 'info');
    }, 2000);
}

// Add some Easter eggs
document.addEventListener('keydown', (e) => {
    // Konami code easter egg
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    if (!window.konamiProgress) window.konamiProgress = 0;
    
    if (e.code === konamiCode[window.konamiProgress]) {
        window.konamiProgress++;
        if (window.konamiProgress === konamiCode.length) {
            document.body.style.animation = 'rainbow 2s infinite';
            const style = document.createElement('style');
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
            window.konamiProgress = 0;
            
            setTimeout(() => {
                document.body.style.animation = '';
            }, 10000);
        }
    } else {
        window.konamiProgress = 0;
    }
});
