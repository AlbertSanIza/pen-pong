export class Position {
    x: number
    y: number

    constructor(coordinates: { x: number; y: number }) {
        this.x = coordinates.x
        this.y = coordinates.y
    }

    move(delta: { x: number; y: number }) {
        this.x += delta.x
        this.y += delta.y
    }
}
