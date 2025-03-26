import { Ball } from './ball'
import { Paddle } from './paddle'
import { ParticleSystem } from './particle-system'
import { Point } from './point'
import { SoundSystem } from './sound-system'
import { State } from './state'
import './style.css'

const PADDlE_WIDTH = 20
const BALL_RADIUS = 20
const BALL_SPEED = 8
const AUTO_PLAY = false

class Game {
    state: State
    canvas: HTMLCanvasElement = document.getElementById('game-canvas') as HTMLCanvasElement
    ctx: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D
    paddleHeight!: number
    playerPaddle!: Paddle
    aiPaddle!: Paddle
    ball!: Ball
    particles!: ParticleSystem
    soundSystem: SoundSystem = new SoundSystem()

    constructor() {
        this.state = new State(1)
        this.init()
        this.setupEventListeners()
        this.draw()
    }

    init() {
        this.resize()
        this.playerPaddle = new Paddle(new Point(0, this.canvas.height / 2 - this.paddleHeight / 2), PADDlE_WIDTH, this.paddleHeight, 2)
        this.aiPaddle = new Paddle(
            new Point(this.canvas.width - PADDlE_WIDTH, this.canvas.height / 2 - this.paddleHeight / 2),
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
        this.canvas.addEventListener('mousemove', (event) => {
            if (AUTO_PLAY) {
                return
            }
            const rect = this.canvas.getBoundingClientRect()
            const relativeY = event.clientY - rect.top
            this.playerPaddle.position.y = Math.max(0, Math.min(relativeY - this.playerPaddle.height / 2, this.canvas.height - this.playerPaddle.height))
        })
        this.canvas.addEventListener('touchmove', (event) => {
            if (AUTO_PLAY) {
                return
            }
            event.preventDefault()
            const touch = event.touches[0]
            const rect = this.canvas.getBoundingClientRect()
            const relativeY = touch.clientY - rect.top
            this.playerPaddle.position.y = Math.max(0, Math.min(relativeY - this.playerPaddle.height / 2, this.canvas.height - this.playerPaddle.height))
        })
        this.state.onStart(() => {
            this.soundSystem.init()
            this.gameLoop()
        })
        this.state.onPause(() => {
            this.soundSystem.pause()
        })
        this.state.onReset(() => {
            this.init()
            this.draw()
        })
        this.state.onFinish(() => {
            if (this.state.playerScore > this.state.aiScore) {
                this.soundSystem.victory()
            } else {
                this.soundSystem.defeat()
            }
            this.draw()
        })
    }

    resetBall() {
        this.ball = new Ball(
            new Point(this.canvas.width / 2, this.canvas.height / 2),
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

        // Wall Y Collision
        if (this.ball.collideWallTop(0)) {
            this.ball.position.y = this.ball.radius
            this.ball.dy = Math.abs(this.ball.dy)
            this.soundSystem.wallHit()
        }
        if (this.ball.collideWallBottom(this.canvas.height)) {
            this.ball.position.y = this.canvas.height - this.ball.radius
            this.ball.dy = -Math.abs(this.ball.dy)
            this.soundSystem.wallHit()
        }

        // Paddle Collision
        if (
            this.ball.collideLine(
                new Point(this.playerPaddle.width, this.playerPaddle.position.y),
                new Point(this.playerPaddle.width, this.playerPaddle.position.y + this.playerPaddle.height)
            )
        ) {
            this.ball.bounceX()
            this.ball.position.x = this.playerPaddle.width + this.ball.radius
            this.ball.dy += ((this.ball.position.y - (this.playerPaddle.position.y + this.playerPaddle.height / 2)) / (this.playerPaddle.height / 2)) * 0.5
            this.soundSystem.paddleHit()
        }
        if (
            this.ball.collideLine(
                new Point(this.canvas.width - this.aiPaddle.width, this.aiPaddle.position.y),
                new Point(this.canvas.width - this.aiPaddle.width, this.aiPaddle.position.y + this.aiPaddle.height)
            )
        ) {
            this.ball.bounceX()
            this.ball.position.x = this.canvas.width - this.aiPaddle.width - this.ball.radius
            this.ball.dy += ((this.ball.position.y - (this.aiPaddle.position.y + this.aiPaddle.height / 2)) / (this.aiPaddle.height / 2)) * 0.5
            this.soundSystem.paddleHit()
        }

        // Wall X Collision
        if (this.ball.collideWallLeft(0)) {
            this.state.aiScore++
            if (AUTO_PLAY) {
                this.playerPaddle.increaseSpeed()
            }
            this.particles.createExplosion(this.ball.position)
            this.resetBall()
            this.soundSystem.score()
        }
        if (this.ball.collideWallRight(this.canvas.width)) {
            this.state.playerScore++
            this.aiPaddle.increaseSpeed()
            this.particles.createExplosion(this.ball.position)
            this.resetBall()
            this.soundSystem.score()
        }

        // Player paddle movement
        if (AUTO_PLAY) {
            const playerDiff = this.ball.position.y - this.playerPaddle.center
            if (Math.abs(playerDiff) > 10) {
                this.playerPaddle.position.y += Math.sign(playerDiff) * Math.min(this.playerPaddle.speed, Math.abs(playerDiff))
                this.playerPaddle.position.y = Math.max(Math.min(this.playerPaddle.position.y, this.canvas.height - this.playerPaddle.height), 0)
            }
        }

        // AI paddle movement
        const aiDiff = this.ball.position.y - this.aiPaddle.center
        if (Math.abs(aiDiff) > 10) {
            this.aiPaddle.position.y += Math.sign(aiDiff) * Math.min(this.aiPaddle.speed, Math.abs(aiDiff))
            this.aiPaddle.position.y = Math.max(Math.min(this.aiPaddle.position.y, this.canvas.height - this.aiPaddle.height), 0)
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
