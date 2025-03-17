export class Position {
    x: number
    y: number

    constructor({ x, y }: { x: number; y: number }) {
        this.x = x
        this.y = y
    }

    move({ dx, dy }: { dx: number; dy: number }) {
        this.x += dx
        this.y += dy
    }
}
