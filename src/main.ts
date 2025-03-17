import { ParticleSystem } from './particle-system'
import { SoundSystem } from './sound-system'
import './style.css'

export class PongGame {
    canvas: HTMLCanvasElement = document.getElementById('game-canvas') as HTMLCanvasElement
    ctx: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D
    stateElement: HTMLElement = document.getElementById('state') as HTMLElement
    pausedIndicatorElement: HTMLElement = document.getElementById('paused-indicator') as HTMLElement
    gradeElement: HTMLElement = document.getElementById('grade') as HTMLElement
    gradeLetterElement: HTMLElement = document.getElementById('grade-letter') as HTMLElement
    gradeMessageElement: HTMLElement = document.getElementById('grade-message') as HTMLElement
    stateButton: HTMLElement = document.getElementById('state-button') as HTMLElement
    soundSystem: SoundSystem = new SoundSystem()
    paddleHeight!: number
    gameStarted!: boolean
    gamePaused!: boolean
    gameOver!: boolean
    playerScoreElement: HTMLElement = document.getElementById('score-a') as HTMLElement
    aiScoreElement: HTMLElement = document.getElementById('score-b') as HTMLElement
    playerPaddle!: { y: number; speed: number }
    aiPaddle!: { y: number; speed: number }
    ball!: { x: number; y: number; speed: number; dx: number; dy: number }
    autoPlay: boolean = false
    particles!: ParticleSystem
    resetButton: HTMLElement = document.getElementById('reset-button') as HTMLElement
    paddleWidth: number = 30
    ballRadius: number = 14
    maxPoints: number = 20

    constructor() {
        this.init()
        this.setupEventListeners()
        this.soundSystem.init()
    }

    init() {
        this.resize()
        this.gameStarted = false
        this.gamePaused = false
        this.gameOver = false
        this.playerScoreElement.textContent = '0'
        this.aiScoreElement.textContent = '0'
        this.playerPaddle = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            speed: 2
        }
        this.aiPaddle = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            speed: 2
        }
        this.resetBall()
        this.particles = new ParticleSystem(this.ctx)
        this.draw()
    }

    resize() {
        const { width, height } = this.canvas.getBoundingClientRect()
        this.canvas.width = width
        this.canvas.height = height
        this.paddleHeight = Math.max(120, height * 0.2)
    }

    resetBall() {
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            speed: this.autoPlay ? 18 : 8,
            dx: Math.random() > 0.5 ? 1 : -1,
            dy: (Math.random() * 2 - 1) * 0.5
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize())
        window.addEventListener('keydown', (event) => {
            if (this.gameStarted && !this.gameOver && event.key === 'Escape') {
                this.pauseGame()
            }
        })
        this.stateButton.addEventListener('click', () => this.startGame())
        this.resetButton.addEventListener('click', () => this.resetGame())
        this.canvas.addEventListener('touchmove', (event) => {
            if (this.autoPlay) {
                return
            }
            event.preventDefault()
            const touch = event.touches[0]
            const rect = this.canvas.getBoundingClientRect()
            const relativeY = touch.clientY - rect.top
            this.playerPaddle.y = Math.max(0, Math.min(relativeY - this.paddleHeight / 2, this.canvas.height - this.paddleHeight))
        })
        this.canvas.addEventListener('mousemove', (event) => {
            if (this.autoPlay) {
                return
            }
            const rect = this.canvas.getBoundingClientRect()
            const relativeY = event.clientY - rect.top
            this.playerPaddle.y = Math.max(0, Math.min(relativeY - this.paddleHeight / 2, this.canvas.height - this.paddleHeight))
        })
    }

    startGame() {
        this.gameStarted = true
        this.gamePaused = false
        this.gameOver = false
        this.pausedIndicatorElement.classList.add('hidden')
        this.stateButton.textContent = 'Start'
        this.stateElement.classList.add('hidden')
        this.resetButton.classList.remove('hidden')
        this.gameLoop()
    }

    resetGame() {
        this.gradeElement.classList.remove('flex')
        this.gradeElement.classList.add('hidden')
        this.pausedIndicatorElement.classList.add('hidden')
        this.stateButton.textContent = 'Start'
        this.stateButton.classList.remove('hidden')
        this.stateElement.classList.remove('hidden')
        this.resetButton.classList.add('hidden')
        this.init()
    }

    pauseGame() {
        this.gamePaused = !this.gamePaused
        if (this.gamePaused) {
            this.pausedIndicatorElement.classList.remove('hidden')
            this.stateButton.textContent = 'Resume'
            this.stateElement.classList.remove('hidden')
        } else {
            this.startGame()
        }
    }

    finishGame() {
        this.gameOver = true
        this.stateButton.classList.add('hidden')
        this.stateElement.classList.remove('hidden')
        this.gradeElement.classList.remove('hidden')
        this.gradeElement.classList.add('flex')
        const { letter, message } = calculateGrade(
            parseInt(this.playerScoreElement.textContent || '0') - parseInt(this.aiScoreElement.textContent || '0'),
            this.maxPoints
        )
        this.gradeLetterElement.textContent = letter
        this.gradeMessageElement.textContent = message
    }

    update() {
        // Update ball position
        this.ball.x += this.ball.dx * this.ball.speed
        this.ball.y += this.ball.dy * this.ball.speed

        for (let i = 0; i < 3; i++) {
            this.particles.particles.push(this.particles.createParticle(this.ball.x, this.ball.y, -this.ball.dx, -this.ball.dy))
        }
        this.particles.update()

        // Top collision
        if (this.ball.y - this.ballRadius + 1 <= 0) {
            this.ball.dy = Math.abs(this.ball.dy)
            this.soundSystem.wallHit()
        }
        // Bottom collision
        if (this.ball.y + this.ballRadius - 1 >= this.canvas.height) {
            this.ball.dy = -Math.abs(this.ball.dy)
            this.soundSystem.wallHit()
        }

        // Left paddle collision
        if (
            this.ball.x - this.ballRadius + 1 <= this.paddleWidth &&
            this.ball.y >= this.playerPaddle.y &&
            this.ball.y <= this.playerPaddle.y + this.paddleHeight
        ) {
            this.ball.dx *= -1
            this.ball.dy += ((this.ball.y - (this.playerPaddle.y + this.paddleHeight / 2)) / (this.paddleHeight / 2)) * 0.5
            this.soundSystem.paddleHit()
        }

        // Right paddle collision
        if (
            this.ball.x + this.ballRadius - 1 >= this.canvas.width - this.paddleWidth &&
            this.ball.y >= this.aiPaddle.y &&
            this.ball.y <= this.aiPaddle.y + this.paddleHeight
        ) {
            this.ball.dx *= -1
            this.ball.dy += ((this.ball.y - (this.aiPaddle.y + this.paddleHeight / 2)) / (this.paddleHeight / 2)) * 0.5
            this.soundSystem.paddleHit()
        }

        // Scoring and explosions
        if (this.ball.x >= this.canvas.width) {
            this.particles.createExplosion(this.ball.x, this.ball.y)
            this.playerScoreElement.textContent = `${parseInt(this.playerScoreElement.textContent || '0') + 1}`
            if (Number(this.playerScoreElement.textContent) == this.maxPoints) {
                this.finishGame()
                return
            }
            if (this.autoPlay) {
                this.playerPaddle.speed += 0.1
            }
            this.aiPaddle.speed += 0.2
            this.soundSystem.score()
            this.aiPaddle.y = this.canvas.height / 2 - this.paddleHeight / 2
            this.resetBall()
        }
        if (this.ball.x <= 0) {
            this.particles.createExplosion(this.ball.x, this.ball.y)
            this.aiScoreElement.textContent = `${parseInt(this.aiScoreElement.textContent || '0') + 1}`
            if (Number(this.aiScoreElement.textContent) == this.maxPoints) {
                this.finishGame()
                return
            }
            this.aiPaddle.speed += 0.1
            if (this.autoPlay) {
                this.playerPaddle.speed += 0.2
            }
            this.soundSystem.score()
            this.resetBall()
        }

        if (this.autoPlay) {
            const playerCenter = this.playerPaddle.y + this.paddleHeight / 2
            if (this.ball.y > playerCenter + 10) {
                this.playerPaddle.y = Math.min(this.playerPaddle.y + this.playerPaddle.speed, this.canvas.height - this.paddleHeight)
            }
            if (this.ball.y < playerCenter - 10) {
                this.playerPaddle.y = Math.max(this.playerPaddle.y - this.playerPaddle.speed, 0)
            }
        }

        const aiCenter = this.aiPaddle.y + this.paddleHeight / 2
        if (this.ball.y > aiCenter + 10) {
            this.aiPaddle.y = Math.min(this.aiPaddle.y + this.aiPaddle.speed, this.canvas.height - this.paddleHeight)
        } else if (this.ball.y < aiCenter - 10) {
            this.aiPaddle.y = Math.max(this.aiPaddle.y - this.aiPaddle.speed, 0)
        }
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        // Draw center line
        this.ctx.setLineDash([5, 3])
        this.ctx.beginPath()
        this.ctx.moveTo(this.canvas.width / 2, 0)
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height)
        this.ctx.strokeStyle = 'oklch(0.623 0.214 259.815)'
        this.ctx.stroke()
        this.ctx.setLineDash([])

        // Draw paddles
        this.ctx.fillStyle = '#155dfc'
        this.ctx.fillRect(0, this.playerPaddle.y, this.paddleWidth, this.paddleHeight)
        this.ctx.fillRect(this.canvas.width - this.paddleWidth, this.aiPaddle.y, this.paddleWidth, this.paddleHeight)

        // Draw particles
        this.particles.draw()

        // Draw ball with glow effect
        this.ctx.save()
        this.ctx.shadowBlur = 50
        this.ctx.shadowColor = '#155dfc'
        this.ctx.beginPath()
        this.ctx.arc(this.ball.x, this.ball.y, this.ballRadius, 0, Math.PI * 2)
        this.ctx.fillStyle = '#155dfc'
        this.ctx.fill()
        this.ctx.closePath()
        this.ctx.restore()
    }

    gameLoop() {
        if (this.gameStarted && !this.gamePaused && !this.gameOver) {
            this.update()
            this.draw()
            requestAnimationFrame(() => this.gameLoop())
        }
    }
}

new PongGame()

function calculateGrade(delta: number, maxScoreDelta: number): { letter: string; message: string } {
    if (delta <= 0) {
        return { letter: 'F', message: 'I got no words...' }
    }
    const messages = ['Keep trying!', 'You need to practice more.', 'Not bad, but you can do better.', 'Almost there!', 'Good job!', 'Perfect!']
    const score = Math.floor((delta / maxScoreDelta) * 100)
    if (score < 40) {
        return { letter: 'E', message: messages[0] }
    } else if (score < 60) {
        return { letter: 'D', message: messages[1] }
    } else if (score < 80) {
        return { letter: 'C', message: messages[2] }
    } else if (score < 90) {
        return { letter: 'B', message: messages[3] }
    } else if (score < 100) {
        return { letter: 'A-', message: messages[4] }
    } else {
        return { letter: 'A+', message: messages[5] }
    }
}
