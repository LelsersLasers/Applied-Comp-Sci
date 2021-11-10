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
    constructor(pt, color, w, h) { // w, h, radius, etc per child
        this.pt = pt;
        this.color = color;
        this.w = w;
        this.h = h;
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
}

class Player extends Thing {
    constructor(pt, color, w, h, ms) {
        super(pt, color, w, h);
        this.hb = new HitBox(pt, w, h);
        this.ms = ms;
    }
    move() {
        if (this.active && frame > moveLockWait) {
            if (up) {
                for (var i = 0; i < cars.length; i++) {
                    cars[i].pt.y += this.ms;
                }
                for (var i = 0; i < bar.length; i++) {
                    bar[i].toggle();
                }
                score += 1;
                if (score > topScore) {
                    topScore = score;
                }
            }
            else if (down) {
                for (var i = 0; i < cars.length; i++) {
                    cars[i].pt.y -= this.ms;
                }
                for (var i = 0; i < bar.length; i++) {
                    bar[i].toggle();
                }
                score -= 1;
            }
            else if (left) {
                this.pt.x -= this.ms;
            }
            else if (right) {
                this.pt.x += this.ms;
            }
            if (up || down || left || right) {
                frame = 0;
            }
        }
    }
}

class Car extends Thing {
    constructor(pt, color, w, h, ms) {
        super(pt, color, w, h);
        this.ms = ms;
        this.hb = new HitBox(pt, w, h);
    }
    update() {
        this.pt.x += this.ms;
        if (this.pt.x < 0 || this.pt.x > canvas.width - this.w) {
            this.ms = this.ms * -1;
            this.ms = this.ms * 1.02;
        }
        if (this.pt.y > canvas.height) {
            this.pt.y = this.pt.y - (1.5 * carHeight) * 10; // 10 cars, no break
            this.ms = this.ms * 1.1;
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
        if (this.pt.x < boxOther.pt.x + boxOther.w && boxOther.pt.x < this.pt.x + this.w) {
            if (this.pt.y < boxOther.pt.y + boxOther.h && boxOther.pt.y < this.pt.y + this.h) {
                return true;
            }
        }
        return false;
    }
    outOfBounds() {
        if (this.pt.x < 0 || this.pt.x + this.w > canvas.width) {
            return true;
        }
        return false;
    }
}

class Block extends Thing {
    constructor(pt, color, color2, w, h) {
        super(pt, color, w, h);
        this.color2 = color2;
    }
    draw() {
        // context.strokeStyle = this.color;
        context.fillStyle = this.active ? this.color2 : this.color;
        context.lineWidth = this.width;
        context.beginPath();
        context.rect(this.pt.x, this.pt.y, this.w, this.h);
        context.fill();
    }
}