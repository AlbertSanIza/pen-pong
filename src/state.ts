export class State {
    private _buttonElement: HTMLElement
    private _resetButtonElement: HTMLElement
    private _pausedElement: HTMLElement
    private _playerScoreElement: HTMLElement
    private _aiScoreElement: HTMLElement
    private _running: boolean
    private _paused: boolean
    finished: boolean
    private _maxScore: number
    private _playerScore: number
    private _aiScore: number

    constructor(maxScore: number = 10) {
        this._buttonElement = document.getElementById('state-button') as HTMLElement
        this._resetButtonElement = document.getElementById('state-reset-button') as HTMLElement
        this._pausedElement = document.getElementById('state-paused') as HTMLElement
        this._playerScoreElement = document.getElementById('state-player-score') as HTMLElement
        this._aiScoreElement = document.getElementById('state-ai-score') as HTMLElement
        this._maxScore = maxScore
        this._running = false
        this._paused = false
        this.finished = false
        this._playerScore = 0
        this._aiScore = 0
        this.setupEventListeners()
    }

    get paused() {
        return this._paused
    }

    set paused(value: boolean) {
        this._paused = value
        if (value) {
            this._pausedElement.classList.remove('hidden')
            this._buttonElement.textContent = 'RESUME'
        } else {
            this._pausedElement.classList.add('hidden')
            this._buttonElement.textContent = 'START'
        }
    }

    get maxScore() {
        return this._maxScore
    }

    get playerScore() {
        return this._playerScore
    }

    set playerScore(score: number) {
        this._playerScore = score
        this._playerScoreElement.textContent = score.toString()
    }

    get aiScore() {
        return this._aiScore
    }

    set aiScore(score: number) {
        this._aiScore = score
        this._aiScoreElement.textContent = score.toString()
    }

    setupEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.togglePause()
            }
        })
    }

    start() {
        this._running = true
        this.paused = false
        this.finished = false
    }

    togglePause() {
        if (!this._running || this.finished) {
            // return
        }
        this.paused = !this.paused
    }

    reset() {
        this._running = false
        this.paused = false
        this.finished = false
        this.resetScores()
    }

    resetScores() {
        this.playerScore = 0
        this.aiScore = 0
    }
}
