import { State } from './state'
import './style.css'

class Game {
    state: State
    canvas: HTMLCanvasElement = document.getElementById('game-canvas') as HTMLCanvasElement
    ctx: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D

    constructor() {
        this.state = new State()
        this.init()
        this.setupEventListeners()
    }

    init() {
        this.resize()
    }

    resize() {
        const { width, height } = this.canvas.getBoundingClientRect()
        this.canvas.width = width
        this.canvas.height = height
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize())
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.state.togglePause()
            }
        })
    }
}

new Game()
