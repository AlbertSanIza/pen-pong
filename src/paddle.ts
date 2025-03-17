import { Position } from './types'

export class Paddle {
    position: Position
    width: number
    height: number
    speed: number

    constructor(position: Position, width: number, height: number, speed: number) {
        this.position = position
        this.width = width
        this.height = height
        this.speed = speed
    }
}
