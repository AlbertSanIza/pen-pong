export class State {
    started: boolean
    paused: boolean
    finished: boolean
    playerScore: number
    aiScore: number
    playerScoreElement: HTMLElement
    aiScoreElement: HTMLElement

    constructor() {
        this.started = false
        this.paused = false
        this.finished = false
        this.playerScore = 0
        this.aiScore = 0
        this.playerScoreElement = document.getElementById('player-score') as HTMLElement
        this.aiScoreElement = document.getElementById('ai-score') as HTMLElement
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
