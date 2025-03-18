export class State {
    started: boolean
    paused: boolean
    finished: boolean
    private _playerScore: number
    private _aiScore: number
    private _playerScoreElement: HTMLElement
    private _aiScoreElement: HTMLElement

    constructor() {
        this.started = false
        this.paused = false
        this.finished = false
        this._playerScore = 0
        this._aiScore = 0
        this._playerScoreElement = document.getElementById('player-score') as HTMLElement
        this._aiScoreElement = document.getElementById('ai-score') as HTMLElement
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

    increaseAiScore() {
        this._aiScore++
    }

    start() {
        this.started = true
        this.paused = false
        this.finished = false
    }

    pause() {
        this.paused = true
    }

    unpause() {
        this.paused = false
    }

    reset() {
        this.started = false
        this.paused = false
        this.finished = false
        this.resetScores()
    }

    resetScores() {
        this.playerScore = 0
        this.aiScore = 0
    }
}
