import { Coordinates } from './types'

export class Position {
    x: number
    y: number

    constructor(coordinates: Coordinates) {
        this.x = coordinates.x
        this.y = coordinates.y
    }

    get coordinates(): Coordinates {
        return { x: this.x, y: this.y }
    }
}
