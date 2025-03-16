import { ParticleSystem } from './particle-system'
import { SoundSystem } from './sound-system'
import './style.css'

export class PongGame {
    canvas: HTMLCanvasElement = document.getElementById('game') as HTMLCanvasElement
    ctx: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D
    stateStartButton: HTMLElement = document.getElementById('state-start') as HTMLElement
    stateResetButton: HTMLElement = document.getElementById('state-reset') as HTMLElement
    playerScoreElement: HTMLElement = document.getElementById('score-a') as HTMLElement
    aiScoreElement: HTMLElement = document.getElementById('score-b') as HTMLElement
    paddleWidth: number = 30
    paddleHeight!: number
    gameStarted!: boolean
    particles!: ParticleSystem
    playerPaddle!: { y: number; speed: number }
    aiPaddle!: { y: number; speed: number }
    ball!: { x: number; y: number; speed: number; dx: number; dy: number }
    ballRadius: number = 14
    soundSystem: SoundSystem = new SoundSystem()
    autoPlay: boolean = false

    constructor() {
        this.resize()
        this.init()
        this.setupEventListeners()
        this.soundSystem.init()
        this.draw()
    }

    resize() {
        const { width, height } = this.canvas.getBoundingClientRect()
        this.canvas.width = width
        this.canvas.height = height
        this.paddleHeight = Math.max(120, height * 0.2)
    }

    init() {
        this.gameStarted = false
        this.playerScoreElement.textContent = '0'
        this.aiScoreElement.textContent = '0'
        this.particles = new ParticleSystem(this.ctx)
        this.playerPaddle = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            speed: 2
        }
        this.aiPaddle = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            speed: 2
        }
        this.resetBall()
    }

    resetBall() {
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            speed: this.autoPlay ? 18 : 9,
            dx: Math.random() > 0.5 ? 1 : -1,
            dy: (Math.random() * 2 - 1) * 0.5
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize())
        this.stateStartButton.addEventListener('click', () => this.startGame())
        this.stateResetButton.addEventListener('click', () => this.startGame())
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
        this.gameStarted = !this.gameStarted
        if (this.gameStarted) {
            this.stateStartButton.classList.add('hidden')
            this.stateResetButton.classList.remove('hidden')
            this.gameLoop()
        } else {
            this.stateStartButton.classList.remove('hidden')
            this.stateResetButton.classList.add('hidden')
            this.init()
            this.draw()
        }
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
        if (this.gameStarted) {
            this.update()
            this.draw()
            requestAnimationFrame(() => this.gameLoop())
        }
    }
}

new PongGame()
