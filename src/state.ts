export class State {
    started: boolean
    paused: boolean
    finished: boolean
    playerScore: number
    aiScore: number

    constructor() {
        this.started = false
        this.paused = false
        this.finished = false
        this.playerScore = 0
        this.aiScore = 0
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
