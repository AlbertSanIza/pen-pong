export class Point {
    private _x: number
    private _y: number
    private _past: {
        x: number
        y: number
    }

    constructor(x: number, y: number) {
        this._x = x
        this._y = y
        this._past = { x, y }
    }

    get x() {
        return this._x
    }

    get y() {
        return this._y
    }

    get past() {
        return this._past
    }

    set x(value: number) {
        this._past = { x: value, y: this._y }
        this._x = value
    }

    set y(value: number) {
        this._past = { x: this._x, y: value }
        this._y = value
    }
}
