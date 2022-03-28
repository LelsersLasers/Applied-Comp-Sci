var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.apply = function (vOther) {
        this.x += vOther.x;
        this.y += vOther.y;
    };
    Vector.prototype.add = function (vOther) {
        return new Vector(this.x + vOther.x, this.y + vOther.y);
    };
    Vector.prototype.subtract = function (vOther) {
        return new Vector(this.x - vOther.x, this.y - vOther.y);
    };
    Vector.prototype.scale = function (len) {
        var currentLen = this.calcLen();
        this.x = this.x * (len / currentLen);
        this.y = this.y * (len / currentLen);
    };
    Vector.prototype.scalar = function (s) {
        this.x *= s;
        this.y *= s;
    };
    Vector.prototype.calcLen = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    return Vector;
}());
var HitBox = /** @class */ (function () {
    function HitBox(pt, w, h) {
        this.pt = pt;
        this.w = w;
        this.h = h;
    }
    HitBox.prototype.checkCollide = function (boxOther) {
        return (this.pt.x < boxOther.pt.x + boxOther.w && boxOther.pt.x < this.pt.x + this.w
            && this.pt.y < boxOther.pt.y + boxOther.h && boxOther.pt.y < this.pt.y + this.h);
    };
    HitBox.prototype.outOfBounds = function () {
        return (this.pt.x < 0 || this.pt.x + this.w > canvas.width);
    };
    HitBox.prototype.draw = function (color) {
        context.strokeStyle = color;
        context.strokeRect(this.pt.x, this.pt.y, this.w, this.h);
    };
    HitBox.prototype.calcCenter = function () {
        return new Vector(this.pt.x + this.w / 2, this.pt.y + this.h / 2);
    };
    return HitBox;
}());
