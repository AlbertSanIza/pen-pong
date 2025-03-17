import { Point } from './types'

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

    increaseSpeed() {
        this._speed += 0.2
    }

    decreaseSpeed() {
        this._speed -= 0.2
    }
}
