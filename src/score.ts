export class Score {
    player: number
    ai: number
    max: number

    constructor(max: number) {
        this.player = 0
        this.ai = 0
        this.max = max
    }

    incrementPlayerScore() {
        return ++this.player
    }

    incrementAIScore() {
        return ++this.ai
    }

    resetScore() {
        this.player = 0
        this.ai = 0
    }

    isMaxReached() {
        return this.player >= this.max || this.ai >= this.max
    }

    getLetterScore() {
        const delta = this.player - this.ai
        if (delta <= 0) {
            return { letter: 'F', message: 'I got no words...', color: 'red' }
        }
        const messages = ['Keep trying!', 'You need to practice more!', 'Not bad, but you can do better!', 'Almost there!', 'Good job!', 'Perfect!']
        const score = Math.floor((delta / this.max) * 100)
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
