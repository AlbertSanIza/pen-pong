import { Ball } from './ball'
import { Paddle } from './paddle'
import { ParticleSystem } from './particle-system'
import { State } from './state'
import './style.css'

const PADDlE_WIDTH = 20
const BALL_RADIUS = 20
const BALL_SPEED = 8
const AUTO_PLAY = true

class Game {
    state: State
    canvas: HTMLCanvasElement = document.getElementById('game-canvas') as HTMLCanvasElement
    ctx: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D
    paddleHeight!: number
    playerPaddle!: Paddle
    aiPaddle!: Paddle
    ball!: Ball
    particles!: ParticleSystem

    constructor() {
        this.state = new State()
        this.init()
        this.setupEventListeners()
    }

    init() {
        this.resize()
        this.playerPaddle = new Paddle({ x: 0, y: this.canvas.height / 2 - this.paddleHeight / 2 }, PADDlE_WIDTH, this.paddleHeight, 2)
        this.aiPaddle = new Paddle(
            { x: this.canvas.width - PADDlE_WIDTH, y: this.canvas.height / 2 - this.paddleHeight / 2 },
            PADDlE_WIDTH,
            this.paddleHeight,
            2
        )
        this.resetBall()
        this.particles = new ParticleSystem(this.ctx)
    }

    resize() {
        const { width, height } = this.canvas.getBoundingClientRect()
        this.canvas.width = width
        this.canvas.height = height
        this.paddleHeight = Math.max(120, height * 0.2)
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize())
        this.state.onStart(() => this.gameLoop())
    }

    resetBall() {
        this.ball = new Ball(
            { x: this.canvas.width / 2, y: this.canvas.height / 2 },
            BALL_RADIUS,
            Math.random() > 0.5 ? 1 : -1,
            (Math.random() * 2 - 1) * 0.5,
            AUTO_PLAY ? BALL_SPEED * 2 : BALL_SPEED
        )
    }

    update() {
        this.ball.move()

        for (let i = 0; i < 3; i++) {
            this.particles.particles.push(this.particles.createParticle(this.ball.position, -this.ball.dx, -this.ball.dy))
        }
        this.particles.update()

        // Wall X collision
        const collideLeft = this.ball.collideX(0)
        if (collideLeft || this.ball.collideX(this.canvas.width)) {
            if (collideLeft) {
                this.state.aiScore++
                if (AUTO_PLAY) {
                    this.playerPaddle.increaseSpeed()
                }
            } else {
                this.state.playerScore++
                this.aiPaddle.increaseSpeed()
            }
            this.particles.createExplosion(this.ball.position)
            this.resetBall()
        }

        if (this.ball.collideWallTop(0)) {
            this.ball.bounceDown()
        }
        if (this.ball.collideWallBottom(this.canvas.height)) {
            this.ball.bounceUp()
        }

        if (
            this.ball.collideLine(
                { x: this.playerPaddle.width, y: this.playerPaddle.position.y },
                { x: this.playerPaddle.width, y: this.playerPaddle.position.y + this.paddleHeight }
            )
        ) {
            this.ball.bounceX()
            this.ball.position.x = this.playerPaddle.width + this.ball.radius
            this.ball.dy += ((this.ball.position.y - (this.playerPaddle.position.y + this.paddleHeight / 2)) / (this.paddleHeight / 2)) * 0.5
        }

        if (
            this.ball.collideLine(
                { x: this.canvas.width - this.aiPaddle.width, y: this.aiPaddle.position.y },
                { x: this.canvas.width - this.aiPaddle.width, y: this.aiPaddle.position.y + this.paddleHeight }
            )
        ) {
            this.ball.bounceX()
            this.ball.position.x = this.canvas.width - this.aiPaddle.width - this.ball.radius
            this.ball.dy += ((this.ball.position.y - (this.aiPaddle.position.y + this.paddleHeight / 2)) / (this.paddleHeight / 2)) * 0.5
        }

        // Player paddle movement
        if (AUTO_PLAY) {
            const playerDiff = this.ball.position.y - this.playerPaddle.center
            if (Math.abs(playerDiff) > 10) {
                this.playerPaddle.position.y += Math.sign(playerDiff) * Math.min(this.playerPaddle.speed, Math.abs(playerDiff))
                this.playerPaddle.position.y = Math.max(Math.min(this.playerPaddle.position.y, this.canvas.height - this.paddleHeight), 0)
            }
        }

        // AI paddle movement
        const aiDiff = this.ball.position.y - this.aiPaddle.center
        if (Math.abs(aiDiff) > 10) {
            this.aiPaddle.position.y += Math.sign(aiDiff) * Math.min(this.aiPaddle.speed, Math.abs(aiDiff))
            this.aiPaddle.position.y = Math.max(Math.min(this.aiPaddle.position.y, this.canvas.height - this.paddleHeight), 0)
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        // Draw center line
        this.ctx.setLineDash([5, 3])
        this.ctx.strokeStyle = 'oklch(0.623 0.214 259.815)'
        this.ctx.beginPath()
        this.ctx.moveTo(this.canvas.width / 2, 0)
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height)
        this.ctx.stroke()
        this.ctx.setLineDash([])

        // Draw paddles
        this.ctx.fillStyle = '#155dfc'
        this.ctx.fillRect(0, this.playerPaddle.position.y, this.playerPaddle.width, this.playerPaddle.height)
        this.ctx.fillRect(this.canvas.width - this.aiPaddle.width, this.aiPaddle.position.y, this.aiPaddle.width, this.aiPaddle.height)

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
        if (this.state.running && !this.state.paused && !this.state.finished) {
            this.update()
            this.draw()
            requestAnimationFrame(() => this.gameLoop())
        }
    }
}

new Game()
