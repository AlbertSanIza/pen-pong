export class Position {
    x: number
    y: number

    constructor(coordinates: { x: number; y: number }) {
        this.x = coordinates.x
        this.y = coordinates.y
    }

    move({ dx, dy }: { dx: number; dy: number }) {
        this.x += dx
        this.y += dy
    }
}
