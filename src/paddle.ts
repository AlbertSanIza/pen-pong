import { Position } from './position'

export class Paddle {
    position: Position
    width: number
    height: number
    speed: number

    constructor(coordinates: { x: number; y: number }, width: number, height: number, speed: number) {
        this.position = new Position(coordinates)
        this.width = width
        this.height = height
        this.speed = speed
    }
}
