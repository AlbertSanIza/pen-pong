export class Position {
    private _x: number
    private _y: number

    get x(): number {
        return this._x
    }

    get y(): number {
        return this._y
    }

    constructor(x: number = 0, y: number = 0) {
        this._x = x
        this._y = y
    }

    update(x: number, y: number) {
        this._x = x
        this._y = y
    }

    move(x: number, y: number) {
        this._x += x
        this._y += y
    }
}
