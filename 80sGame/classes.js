class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    print() {
        console.log(this.x, this.y);
    }
    apply(vOther) {
        this.x += vOther.x;
        this.y += vOther.y;
    }
    setBoth(values) {
        this.x = values[0];
        this.y = values[1];
    }
}

class Thing {
    constructor(pt, color) { // w, h, radius, etc per child
        this.pt = pt;
        this.color = color;
        this.width = 3;
        this.active = true;
    }

    off() {
        this.active = false;
    }
    on() {
        this.active = true;
    }
    toggle() {
        this.active = !this.active;
    }

    // draw to be per child
    // draw() {
    //     context.strokeStyle = this.color;
    //     context.fillStyle = this.color;
    //     context.lineWidth = this.width;
    //     context.beginPath();
    //     context.rect(this.pt.x, this.pt.y, this.w, this.h);
    //     if (this.active) {
    //         context.fill();
    //     }
    //     context.stroke();
    // }
}

class Player extends Thing {
    constructor(pt, color, w, h) {
        super(pt, color);
        this.w = w;
        this.h = h;
        this.hb = new HitBox(pt, w, h);
    }
    draw() {
        context.strokeStyle = this.color;
        context.fillStyle = this.color;
        context.lineWidth = this.width;
        context.beginPath();
        context.rect(this.pt.x, this.pt.y, this.w, this.h);
        if (this.active) {
            context.fill();
        }
        context.stroke();
    }

    move() {
        if (alive) {
            if (up) {
                this.pt.y -= 3;
            }
            if (down) {
                this.pt.y += 3;
            }
            if (left) {
                this.pt.x -= 3;
            }
            if (right) {
                this.pt.x += 3;
            }
        }
    }
}

class Car extends Thing {
    constructor(pt, color, w, h, ms) {
        super(pt, color);
        this.w = w;
        this.h = h;
        this.ms = ms;
        this.hb = new HitBox(pt, w, h);
    }
    draw() {
        context.strokeStyle = this.color;
        context.fillStyle = this.color;
        context.lineWidth = this.width;
        context.beginPath();
        context.rect(this.pt.x, this.pt.y, this.w, this.h);
        if (this.active) {
            context.fill();
        }
        context.stroke();
    }

    update() {
        this.pt.x += this.ms;
        if (this.pt.x < 0 || this.pt.x > canvas.width - this.w) {
            this.ms = this.ms * -1;
        }
    }
}


class HitBox {
    constructor(pt, w, h) {
        this.pt = pt;
        this.w = w;
        this.h = h;
    }
    checkCollide(boxOther) {
        // if (boxOther.pt.x > this.pt.x && boxOther.pt.x < this.pt.x - this.w && boxOther.pt.y > this.pt.y && boxOther.pt.y < this.pt.y - this.h) {
        //     console.log("HIT");
        // }
        if (this.pt.x < boxOther.pt.x + boxOther.w && boxOther.pt.x < this.pt.x + this.w) {
            if (this.pt.y < boxOther.pt.y + boxOther.h && boxOther.pt.y < this.pt.y + this.h) {
                return true;
            }
        }
        return false;
    }
}