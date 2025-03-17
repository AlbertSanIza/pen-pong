export class Ball {
    position: { x: number; y: number }
    radius: number
    dx: number
    dy: number
    speed: number

    constructor(x: number = 0, y: number = 0, radius: number = 10, dx: number = 0, dy: number = 0, speed: number = 0) {
        this.position = { x, y }
        this.radius = radius
        this.dx = dx
        this.dy = dy
        this.speed = speed
    }

    move() {
        this.position.x += this.dx * this.speed
        this.position.y += this.dy * this.speed
    }
}
