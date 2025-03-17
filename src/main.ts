import { Ball } from './ball'
import { Paddle } from './paddle'
import { ParticleSystem } from './particle-system'
import { SoundSystem } from './sound-system'
import './style.css'

const BALL_RADIUS = 40
const BALL_SPEED = 8

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
    playerPaddle!: Paddle
    aiPaddle!: Paddle
    ball!: Ball
    autoPlay: boolean = false
    particles!: ParticleSystem
    resetButton: HTMLElement = document.getElementById('reset-button') as HTMLElement
    paddleWidth: number = 30
    maxPoints: number = 5

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
        this.playerPaddle = new Paddle({ x: 0, y: this.canvas.height / 2 - this.paddleHeight / 2 }, this.paddleWidth, this.paddleHeight, 2)
        this.aiPaddle = new Paddle(
            { x: this.canvas.width - this.paddleWidth, y: this.canvas.height / 2 - this.paddleHeight / 2 },
            this.paddleWidth,
            this.paddleHeight,
            2
        )
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
        this.ball = new Ball(
            { x: this.canvas.width / 2, y: this.canvas.height / 2 },
            BALL_RADIUS,
            Math.random() > 0.5 ? 1 : -1,
            (Math.random() * 2 - 1) * 0.5,
            this.autoPlay ? BALL_SPEED : BALL_SPEED
        )
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
            this.playerPaddle.position.y = Math.max(0, Math.min(relativeY - this.paddleHeight / 2, this.canvas.height - this.paddleHeight))
        })
        this.canvas.addEventListener('mousemove', (event) => {
            if (this.autoPlay) {
                return
            }
            const rect = this.canvas.getBoundingClientRect()
            const relativeY = event.clientY - rect.top
            this.playerPaddle.position.y = Math.max(0, Math.min(relativeY - this.paddleHeight / 2, this.canvas.height - this.paddleHeight))
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
            this.soundSystem.pause()
            this.pausedIndicatorElement.classList.remove('hidden')
            this.stateButton.textContent = 'Resume'
            this.stateElement.classList.remove('hidden')
        } else {
            this.soundSystem.unpause()
            this.startGame()
        }
    }

    finishGame() {
        this.gameOver = true
        const { letter, message, color } = calculateGrade(
            parseInt(this.playerScoreElement.textContent || '0') - parseInt(this.aiScoreElement.textContent || '0'),
            this.maxPoints
        )
        this.stateButton.classList.add('hidden')
        this.stateElement.classList.remove('hidden')
        this.gradeElement.style.color = color
        this.gradeElement.classList.remove('hidden')
        this.gradeElement.classList.add('flex')
        this.gradeLetterElement.textContent = letter
        this.gradeMessageElement.textContent = message
        if (letter === 'F') {
            this.soundSystem.defeat()
        } else {
            this.soundSystem.victory()
        }
    }

    update() {
        this.ball.move()

        for (let i = 0; i < 3; i++) {
            this.particles.particles.push(this.particles.createParticle(this.ball.position, -this.ball.dx, -this.ball.dy))
        }
        this.particles.update()

        // Wall X collision
        const collideLeft = this.ball.collideX(0)
        const collideRight = this.ball.collideX(this.canvas.width)
        if (collideLeft || collideRight) {
            if (collideLeft) {
                this.aiScoreElement.textContent = `${parseInt(this.aiScoreElement.textContent || '0') + 1}`
            } else {
                this.playerScoreElement.textContent = `${parseInt(this.playerScoreElement.textContent || '0') + 1}`
                this.aiPaddle.increaseSpeed()
            }
            if (Number(this.playerScoreElement.textContent) == this.maxPoints || Number(this.aiScoreElement.textContent) == this.maxPoints) {
                this.finishGame()
                return
            }
            this.soundSystem.score()
            this.particles.createExplosion(this.ball.position)
            this.resetBall()
        }

        // Wall Y collision
        if (this.ball.collideY(0) || this.ball.collideY(this.canvas.height)) {
            this.soundSystem.wallHit()
            this.ball.bounceY()
        }

        // Paddle collision
        if (
            this.ball.collideLine(
                { x: this.paddleWidth, y: this.playerPaddle.position.y },
                { x: this.paddleWidth, y: this.playerPaddle.position.y + this.paddleHeight }
            )
        ) {
            this.soundSystem.paddleHit()
            this.ball.bounceX()
            this.ball.position.x = this.paddleWidth + this.ball.radius
            this.ball.dy += ((this.ball.position.y - (this.playerPaddle.position.y + this.paddleHeight / 2)) / (this.paddleHeight / 2)) * 0.5
        }
        if (
            this.ball.collideLine(
                { x: this.canvas.width - this.paddleWidth, y: this.aiPaddle.position.y },
                { x: this.canvas.width - this.paddleWidth, y: this.aiPaddle.position.y + this.paddleHeight }
            )
        ) {
            this.soundSystem.paddleHit()
            this.ball.bounceX()
            this.ball.position.x = this.canvas.width - this.paddleWidth - this.ball.radius
            this.ball.dy += ((this.ball.position.y - (this.aiPaddle.position.y + this.paddleHeight / 2)) / (this.paddleHeight / 2)) * 0.5
        }

        if (this.autoPlay) {
            const playerCenter = this.playerPaddle.position.y + this.paddleHeight / 2
            if (this.ball.position.y > playerCenter) {
                this.playerPaddle.position.y = Math.min(this.playerPaddle.position.y + this.playerPaddle.speed, this.canvas.height - this.paddleHeight)
            }
            if (this.ball.position.y < playerCenter) {
                this.playerPaddle.position.y = Math.max(this.playerPaddle.position.y - this.playerPaddle.speed, 0)
            }
        }

        const aiCenter = this.aiPaddle.position.y + this.paddleHeight / 2
        if (this.ball.position.y > aiCenter) {
            this.aiPaddle.position.y = Math.min(this.aiPaddle.position.y + this.aiPaddle.speed, this.canvas.height - this.paddleHeight)
        } else if (this.ball.position.y < aiCenter) {
            this.aiPaddle.position.y = Math.max(this.aiPaddle.position.y - this.aiPaddle.speed, 0)
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
        this.ctx.fillRect(0, this.playerPaddle.position.y, this.paddleWidth, this.paddleHeight)
        this.ctx.fillRect(this.canvas.width - this.paddleWidth, this.aiPaddle.position.y, this.paddleWidth, this.paddleHeight)

        // Draw particles
        this.particles.draw()

        // Draw ball with glow effect
        this.ctx.save()
        this.ctx.shadowBlur = 50
        this.ctx.shadowColor = '#155dfc'
        this.ctx.beginPath()
        this.ctx.arc(this.ball.position.x, this.ball.position.y, this.ball.radius, 0, Math.PI * 2)
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

function calculateGrade(delta: number, maxScoreDelta: number): { letter: string; message: string; color: string } {
    if (delta <= 0) {
        return { letter: 'F', message: 'I got no words...', color: 'red' }
    }
    const messages = ['Keep trying!', 'You need to practice more!', 'Not bad, but you can do better!', 'Almost there!', 'Good job!', 'Perfect!']
    const score = Math.floor((delta / maxScoreDelta) * 100)
    if (score < 20) {
        return { letter: 'E', message: messages[0], color: 'oklch(0.646 0.222 41.116)' }
    } else if (score < 40) {
        return { letter: 'D', message: messages[1], color: 'oklch(0.666 0.179 58.318)' }
    } else if (score < 60) {
        return { letter: 'C', message: messages[2], color: 'oklch(0.795 0.184 86.047)' }
    } else if (score < 80) {
        return { letter: 'B', message: messages[3], color: 'oklch(0.905 0.182 98.111)' }
    } else if (score < 100) {
        return { letter: 'A-', message: messages[4], color: 'oklch(0.841 0.238 128.85)' }
    } else {
        return { letter: 'A+', message: messages[5], color: 'oklch(0.723 0.219 149.579)' }
    }
}
