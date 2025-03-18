import { Paddle } from './paddle'
import { State } from './state'
import './style.css'

const PADDlE_WIDTH = 20

class Game {
    state: State
    canvas: HTMLCanvasElement = document.getElementById('game-canvas') as HTMLCanvasElement
    ctx: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D
    paddleHeight!: number
    playerPaddle!: Paddle
    aiPaddle!: Paddle

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
    }

    resize() {
        const { width, height } = this.canvas.getBoundingClientRect()
        this.canvas.width = width
        this.canvas.height = height
        this.paddleHeight = Math.max(120, height * 0.2)
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize())
        this.state.onStart(() => {
            console.log('Game started')
        })
    }
}

new Game()
