export class Position {
    x: number
    y: number

    constructor(coordinates: { x: number; y: number }) {
        this.x = coordinates.x
        this.y = coordinates.y
    }

    get coordinates() {
        return { x: this.x, y: this.y }
    }
}
