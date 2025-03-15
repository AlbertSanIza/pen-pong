import { ParticleSystem } from './particle-system'
import './style.css'

export class PongGame {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    startButton: HTMLElement
    playerScoreElement: HTMLElement
    aiScoreElement: HTMLElement
    paddleHeight: number
    paddleWidth: number
    ballSize: number = 10
    particles: ParticleSystem
    playerScore: number = 0
    aiScore: number = 0
    gameStarted: boolean = false
    playerPaddle: { y: number; speed: number } = { y: 0, speed: 0 }
    aiPaddle: { y: number; speed: number } = { y: 0, speed: 0 }
    ball: { x: number; y: number; speed: number; dx: number; dy: number } = { x: 0, y: 0, speed: 0, dx: 0, dy: 0 }

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
        this.startButton = document.getElementById('startButton') as HTMLElement
        this.playerScoreElement = document.getElementById('playerScore') as HTMLElement
        this.aiScoreElement = document.getElementById('aiScore') as HTMLElement
        this.resize()
        window.addEventListener('resize', () => this.resize())
        this.paddleHeight = this.canvas.height * 0.2
        this.paddleWidth = 20
        this.particles = new ParticleSystem(this.ctx)
        this.initialize()
        this.setupEventListeners()
    }

    initialize() {
        this.playerScore = 0
        this.aiScore = 0
        this.gameStarted = false
        this.playerPaddle = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            speed: 0
        }
        this.aiPaddle = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            speed: 1
        }
        this.resetBall()
    }

    resetBall() {
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            speed: 6,
            dx: Math.random() > 0.5 ? 1 : -1,
            dy: (Math.random() * 2 - 1) * 0.5
        }
    }

    resize() {
        const { width, height } = (document.getElementById('gameCanvas') as HTMLCanvasElement).getBoundingClientRect()
        this.canvas.width = width
        this.canvas.height = height
        this.paddleHeight = this.canvas.height * 0.2
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame())
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault()
            const touch = e.touches[0]
            const rect = this.canvas.getBoundingClientRect()
            const relativeY = touch.clientY - rect.top
            this.playerPaddle.y = Math.max(0, Math.min(relativeY - this.paddleHeight / 2, this.canvas.height - this.paddleHeight))
        })
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect()
            const relativeY = e.clientY - rect.top
            this.playerPaddle.y = Math.max(0, Math.min(relativeY - this.paddleHeight / 2, this.canvas.height - this.paddleHeight))
        })
    }

    startGame() {
        if (!this.gameStarted) {
            this.gameStarted = true
            this.startButton.innerHTML = 'Restart'
            // audioManager.init()
            this.gameLoop()
        } else {
            this.gameStarted = false
            this.startButton.innerHTML = 'Start'
            this.initialize()
            this.draw()
        }
    }

    update() {
        // Previous ball position
        const prevX = this.ball.x
        const prevY = this.ball.y

        // Update ball position
        this.ball.x += this.ball.dx * this.ball.speed
        this.ball.y += this.ball.dy * this.ball.speed

        // Add fire particles
        for (let i = 0; i < 3; i++) {
            this.particles.particles.push(this.particles.createParticle(this.ball.x, this.ball.y, -this.ball.dx, -this.ball.dy))
        }

        // Update particles
        this.particles.update()

        // Ball collision with top and bottom walls
        if (this.ball.y <= 0 || this.ball.y >= this.canvas.height) {
            this.ball.dy *= -1
            // audioManager.playWallHit()
        }

        // Ball collision with paddles
        if (this.ball.x <= this.paddleWidth && this.ball.y >= this.playerPaddle.y && this.ball.y <= this.playerPaddle.y + this.paddleHeight) {
            this.ball.dx *= -1
            this.ball.dy += ((this.ball.y - (this.playerPaddle.y + this.paddleHeight / 2)) / (this.paddleHeight / 2)) * 0.5
            // audioManager.playPaddleHit()
        }

        if (this.ball.x >= this.canvas.width - this.paddleWidth && this.ball.y >= this.aiPaddle.y && this.ball.y <= this.aiPaddle.y + this.paddleHeight) {
            this.ball.dx *= -1
            this.ball.dy += ((this.ball.y - (this.aiPaddle.y + this.paddleHeight / 2)) / (this.paddleHeight / 2)) * 0.5
            // audioManager.playPaddleHit()
        }

        // Scoring and explosions
        if (this.ball.x <= 0) {
            this.particles.createExplosion(this.ball.x, this.ball.y)
            this.aiScore++
            this.aiScoreElement.textContent = this.aiScore
            // audioManager.playScore()
            this.resetBall()
        }
        if (this.ball.x >= this.canvas.width) {
            this.particles.createExplosion(this.ball.x, this.ball.y)
            this.playerScore++
            this.playerScoreElement.textContent = this.playerScore
            // audioManager.playScore()
            this.resetBall()
        }

        // AI paddle movement
        const aiCenter = this.aiPaddle.y + this.paddleHeight / 2
        if (this.ball.y > aiCenter + 10) {
            this.aiPaddle.y = Math.min(this.aiPaddle.y + this.aiPaddle.speed, this.canvas.height - this.paddleHeight)
        } else if (this.ball.y < aiCenter - 10) {
            this.aiPaddle.y = Math.max(this.aiPaddle.y - this.aiPaddle.speed, 0)
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#EFF6FF'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        // Draw center line
        this.ctx.setLineDash([5, 3])
        this.ctx.beginPath()
        this.ctx.moveTo(this.canvas.width / 2, 0)
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height)
        this.ctx.strokeStyle = '#155dfc'
        this.ctx.stroke()
        this.ctx.setLineDash([])

        // Draw paddles
        this.ctx.fillStyle = '#1447e6'
        this.ctx.fillRect(0, this.playerPaddle.y, this.paddleWidth, this.paddleHeight)
        this.ctx.fillRect(this.canvas.width - this.paddleWidth, this.aiPaddle.y, this.paddleWidth, this.paddleHeight)

        // Draw particles
        this.particles.draw()

        // Draw ball with glow effect
        this.ctx.save()
        this.ctx.shadowBlur = 20
        this.ctx.shadowColor = '#ff6600'
        this.ctx.beginPath()
        this.ctx.arc(this.ball.x, this.ball.y, this.ballSize, 0, Math.PI * 2)
        this.ctx.fillStyle = '#ff8833'
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
