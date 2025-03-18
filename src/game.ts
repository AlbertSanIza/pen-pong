import { Ball } from './ball'
import { Paddle } from './paddle'
import { State } from './state'
import './style.css'

const PADDlE_WIDTH = 20
const BALL_RADIUS = 20
const BALL_SPEED = 8

class Game {
    state: State
    canvas: HTMLCanvasElement = document.getElementById('game-canvas') as HTMLCanvasElement
    ctx: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D
    paddleHeight!: number
    playerPaddle!: Paddle
    aiPaddle!: Paddle
    ball!: Ball

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
            BALL_SPEED
        )
    }

    update() {
        this.ball.move()
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
