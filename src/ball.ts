import { Position } from './position'

export class Ball {
    position: Position
    radius: number
    dx: number
    dy: number
    speed: number

    constructor(x: number = 0, y: number = 0, radius: number = 10, dx: number = 0, dy: number = 0, speed: number = 0) {
        this.position = new Position({ x, y })
        this.radius = radius
        this.dx = dx
        this.dy = dy
        this.speed = speed
    }

    move() {
        this.position.move({ dx: this.dx * this.speed, dy: this.dy * this.speed })
    }

    collideX(x: number): boolean {
        return this.position.x + this.radius >= x && this.position.x - this.radius <= x
    }

    collideY(y: number): boolean {
        return this.position.y + this.radius - 1 >= y && this.position.y - this.radius + 1 <= y
    }

    collideLine(x1: number, y1: number, x2: number, y2: number) {
        // Step 1: Calculate the coefficients of the quadratic equation
        const dx = x2 - x1
        const dy = y2 - y1
        const A = dx * dx + dy * dy
        const B = 2 * (dx * (x1 - this.position.x) + dy * (y1 - this.position.y))
        const C = (x1 - this.position.x) * (x1 - this.position.x) + (y1 - this.position.y) * (y1 - this.position.y) - this.radius * this.radius

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

    bounceY() {
        this.dy *= -1
    }

    bounceX() {
        this.dx *= -1
    }
}
