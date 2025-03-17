export class Position {
    private _x: number
    private _y: number

    constructor({ x = 0, y = 0 }: { x?: number; y?: number }) {
        this._x = x
        this._y = y
    }

    get x(): number {
        return this._x
    }

    set x(value: number) {
        this._x = value
    }

    get y(): number {
        return this._y
    }

    set y(value: number) {
        this._y = value
    }

    move({ x = 0, y = 0 }: { x?: number; y?: number }) {
        this._x += x
        this._y += y
    }
}
