class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    apply(vOther) {
        this.x += vOther.x;
        this.y += vOther.y;
    }
    scale(len) {
        var currentLen = this.calcLen();
        this.x = this.x * (len/currentLen);
        this.y = this.y * (len/currentLen);
    }
    calcLen() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

class HitBox {
    constructor(pt, w, h) {
        this.pt = pt;
        this.w = w;
        this.h = h;
        this.width = 3;
    }
    checkCollide(boxOther) {
        if (this.pt.x < boxOther.pt.x + boxOther.w && boxOther.pt.x < this.pt.x + this.w) {
            if (this.pt.y < boxOther.pt.y + boxOther.h && boxOther.pt.y < this.pt.y + this.h) {
                return true;
            }
        }
        return false;
    }
    outOfBoundsX() {
        if (this.pt.x < 0 || this.pt.x + this.w > canvas.width) {
            return true;
        }
        return false;
    }
    outOfBoundsY() {
        if (this.pt.y < 0 || this.pt.y + this.h > canvas.height) {
            return true;
        }
        return false;
    }
    outOfBounds() {
        if (this.outOfBoundsX() || this.outOfBoundsY()) {
            return true;
        }
        return false;
    }
    draw(color) {
        context.strokeStyle = color;
        context.fillStyle = color;
        context.lineWidth = this.width;
        context.beginPath();
        context.rect(this.pt.x, this.pt.y, this.w, this.h);
        context.stroke();
    }
}

class Light {
    constructor(pt, strength) {
        this.pt = pt;
        this.strength = strength;
    }
    calcDist(px) {
        let xDif = this.pt.x - px.x;
        let yDif = this.pt.y - px.y;
        return this.strength - Math.sqrt(xDif * xDif + yDif * yDif);
    }
}