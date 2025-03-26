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
            const score = this.getLetterScore()
            resultLetterElement.innerText = score.letter
            resultMessageElement.innerText = score.message
            this._resultElement.style.color = score.color
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
        this.finished = false
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

    private getLetterScore() {
        const delta = this.playerScore - this.aiScore
        if (delta <= 0) {
            return { letter: 'F', message: 'I got no words...', color: 'red' }
        }
        const messages = ['Keep trying!', 'You need to practice more!', 'Not bad, but you can do better!', 'Almost there!', 'Good job!', 'Perfect!']
        const score = Math.floor((delta / this.maxScore) * 100)
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
}
