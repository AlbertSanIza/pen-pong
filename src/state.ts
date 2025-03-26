export class State {
    private _buttonElement: HTMLElement
    private _resetButtonElement: HTMLElement
    private _pausedElement: HTMLElement
    private _resultElement: HTMLElement
    private _playerScoreElement: HTMLElement
    private _aiScoreElement: HTMLElement
    private _running: boolean
    private _paused: boolean
    private _finished: boolean
    private _maxScore: number
    private _playerScore: number
    private _aiScore: number
    private _startCallback!: () => void
    private _resetCallback!: () => void

    constructor(maxScore: number = 10) {
        this._buttonElement = document.getElementById('state-button') as HTMLElement
        this._resetButtonElement = document.getElementById('state-reset-button') as HTMLElement
        this._pausedElement = document.getElementById('state-paused') as HTMLElement
        this._resultElement = document.getElementById('state-result') as HTMLElement
        this._playerScoreElement = document.getElementById('state-player-score') as HTMLElement
        this._aiScoreElement = document.getElementById('state-ai-score') as HTMLElement
        this._maxScore = maxScore
        this._running = false
        this._paused = false
        this._finished = false
        this._playerScore = 0
        this._aiScore = 0
        this.setupEventListeners()
    }

    get running() {
        return this._running
    }

    set running(value: boolean) {
        this._running = value
        if (value) {
            this._buttonElement.classList.add('hidden')
            this._resetButtonElement.classList.remove('hidden')
        } else {
            this._buttonElement.classList.remove('hidden')
            this._resetButtonElement.classList.add('hidden')
        }
    }

    get paused() {
        return this._paused
    }

    set paused(value: boolean) {
        this._paused = value
        if (value) {
            this._pausedElement.classList.remove('hidden')
        } else {
            this._pausedElement.classList.add('hidden')
        }
    }

    get finished() {
        return this._finished
    }

    set finished(value: boolean) {
        this._finished = value
        if (value) {
            this._resultElement.classList.remove('hidden')
            this._resultElement.classList.add('flex')
            const resultLetterElement = this._resultElement.querySelector('#state-result-letter') as HTMLElement
            const resultMessageElement = this._resultElement.querySelector('#state-result-message') as HTMLElement
            resultLetterElement.innerText = this._playerScore >= this._maxScore ? 'You win!' : 'AI wins!'
            resultMessageElement.innerText = this._playerScore >= this._maxScore ? 'Congratulations!' : 'Better luck next time!'
        } else {
            this._resultElement.classList.add('hidden')
            this._resultElement.classList.remove('flex')
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
        if (score >= this._maxScore) {
            this.finish()
        }
    }

    get aiScore() {
        return this._aiScore
    }

    set aiScore(score: number) {
        this._aiScore = score
        this._aiScoreElement.textContent = score.toString()
        if (score >= this._maxScore) {
            this.finish()
        }
    }

    setupEventListeners() {
        this._buttonElement.addEventListener('click', () => this.start())
        this._resetButtonElement.addEventListener('click', () => this.reset())
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.togglePause()
            }
        })
    }

    start() {
        this.running = true
        this.paused = false
        this._startCallback?.()
    }

    togglePause() {
        if (!this.running || this.finished) {
            return
        }
        this.paused = !this.paused
        if (!this.paused && this._startCallback) {
            this._startCallback()
        }
    }

    reset() {
        this.running = false
        this.paused = false
        this.finished = false
        this.resetScores()
        this._resetCallback?.()
    }

    finish() {
        this.running = false
        this.paused = false
        this.finished = true
    }

    resetScores() {
        this.playerScore = 0
        this.aiScore = 0
    }

    onStart(callback: () => void) {
        this._startCallback = callback
    }

    onReset(callback: () => void) {
        this._resetCallback = callback
    }
}
