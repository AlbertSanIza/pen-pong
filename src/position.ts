export class Position {
    private x: number
    private y: number

    constructor(x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }

    update(x: number, y: number) {
        this.x = x
        this.y = y
    }

    move(x: number, y: number) {
        this.x += x
        this.y += y
    }

    get() {
        return { x: this.x, y: this.y }
    }
}
