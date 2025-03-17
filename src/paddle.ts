import { Point } from './types'

export class Paddle {
    position: Point
    width: number
    height: number
    speed: number

    constructor(position: Point, width: number, height: number, speed: number) {
        this.position = position
        this.width = width
        this.height = height
        this.speed = speed
    }
}
