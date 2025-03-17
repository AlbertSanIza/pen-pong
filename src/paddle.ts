import { Position } from './position'
import { Coordinates } from './types'

export class Paddle {
    position: Position
    width: number
    height: number
    speed: number

    constructor(coordinates: Coordinates, width: number, height: number, speed: number) {
        this.position = new Position(coordinates)
        this.width = width
        this.height = height
        this.speed = speed
    }
}
