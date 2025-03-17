export class Ball {
    x: number
    y: number
    radius: number
    dx: number
    dy: number
    speed: number

    constructor(x: number = 0, y: number = 0, radius: number = 10, dx: number = 0, dy: number = 0, speed: number = 0) {
        this.x = x
        this.y = y
        this.radius = radius
        this.dx = dx
        this.dy = dy
        this.speed = speed
    }

    move() {
        this.x += this.dx * this.speed
        this.y += this.dy * this.speed
    }
}
