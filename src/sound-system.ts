import * as Tone from 'tone'

export class SoundSystem {
    synth: Tone.Synth<Tone.SynthOptions>
    initialized: boolean

    constructor() {
        this.synth = new Tone.Synth().toDestination()
        this.initialized = false
    }

    async init() {
        if (!this.initialized) {
            await Tone.start()
            this.initialized = true
        }
    }

    paddleHit() {
        this.synth.triggerAttackRelease('C4', '32n')
    }

    wallHit() {
        this.synth.triggerAttackRelease('G3', '32n')
    }

    score() {
        this.synth.triggerAttackRelease('E4', '8n')
    }

    pause() {
        this.synth.triggerAttackRelease('A4', '8n')
    }

    unpause() {
        this.synth.triggerAttackRelease('B4', '8n')
    }
}
