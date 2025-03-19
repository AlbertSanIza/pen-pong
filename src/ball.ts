import { Point } from './types'

export class Ball {
    position: Point
    radius: number
    dx: number
    dy: number
    speed: number

    constructor(position: Point, radius: number, dx: number = 0, dy: number = 0, speed: number = 0) {
        this.position = position
        this.radius = radius
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

    collideWallTop(y: number): boolean {
        return this.position.y - this.radius <= y
    }

    collideWallBottom(y: number): boolean {
        return this.position.y + this.radius >= y
    }

    collideLine(pointA: Point, pointB: Point): boolean {
        // Step 1: Calculate the coefficients of the quadratic equation
        const dx = pointB.x - pointA.x
        const dy = pointB.y - pointA.y
        const A = dx * dx + dy * dy
        const B = 2 * (dx * (pointA.x - this.position.x) + dy * (pointA.y - this.position.y))
        const C =
            (pointA.x - this.position.x) * (pointA.x - this.position.x) +
            (pointA.y - this.position.y) * (pointA.y - this.position.y) -
            this.radius * this.radius

        // Step 2: Calculate the discriminant
        const discriminant = B * B - 4 * A * C

        // Step 3: Check the discriminant
        if (discriminant < 0) {
            // No intersection
            return false
        }
        // Step 4: Solve the quadratic equation for t
        const sqrtDiscriminant = Math.sqrt(discriminant)
        const t1 = (-B + sqrtDiscriminant) / (2 * A)
        const t2 = (-B - sqrtDiscriminant) / (2 * A)

        // Step 5: Check if either t1 or t2 is within the range [0, 1]
        if ((t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1)) {
            // The line segment intersects the circle
            return true
        }

        return false
    }

    bounceUp() {
        this.dy = -Math.abs(this.dy)
    }

    bounceDown() {
        this.dy = Math.abs(this.dy)
    }

    bounceLeft() {
        this.dx = -Math.abs(this.dx)
    }

    bounceRight() {
        this.dx = Math.abs(this.dx)
    }

    bounceX() {
        this.dx *= -1
    }
}
