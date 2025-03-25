import { Point } from './point'

export class Paddle {
    position: Point
    width: number
    height: number
    private _speed: number

    constructor(position: Point, width: number, height: number, speed: number) {
        this.position = position
        this.width = width
        this.height = height
        this._speed = speed
    }

    get speed() {
        return this._speed
    }

    get center() {
        return this.position.y + this.height / 2
    }

    increaseSpeed() {
        this._speed += 0.2
    }
}
