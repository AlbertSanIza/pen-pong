export class Position {
    private _x: number
    private _y: number

    constructor(x: number = 0, y: number = 0) {
        this._x = x
        this._y = y
    }

    get x(): number {
        return this._x
    }
    get y(): number {
        return this._y
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
