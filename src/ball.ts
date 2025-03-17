export class Ball {
    radius: number
    position: { x: number; y: number }
    dx: number
    dy: number
    speed: number

    constructor(radius: number = 10, x: number = 0, y: number = 0, dx: number = 0, dy: number = 0, speed: number = 0) {
        this.radius = radius
        this.position = { x, y }
        this.dx = dx
        this.dy = dy
        this.speed = speed
    }

    move() {
        this.position.x += this.dx * this.speed
        this.position.y += this.dy * this.speed
    }

    collideX(x: number): boolean {
        return this.position.x + this.radius >= x && this.position.x - this.radius <= x
    }

    collideY(y: number): boolean {
        return this.position.y + this.radius >= y && this.position.y - this.radius <= y
    }

    bounceY() {
        this.dy *= -1
    }

    bounceX() {
        this.dx *= -1
    }
}
