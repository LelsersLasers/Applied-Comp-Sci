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
        var currentLen = Math.sqrt(this.x * this.x + this.y * this.y);
        this.x = this.x * (len/currentLen);
        this.y = this.y * (len/currentLen);
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
    outOfBoundsY() {
        if (this.pt.y < 0 || this.pt.y + this.h > canvas.height) {
            return true;
        }
        return false;
    }
    outOfBoundsX() {
        if (this.pt.x < 0) {
            return 0;
        }
        else if (this.pt.x + this.w > canvas.width) {
            return 1;
        }
        return false, -1;
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

class Thing {
    constructor(pt, color, w, h) {
        this.pt = pt;
        this.color = color;
        this.w = w;
        this.h = h;
        this.width = 1;
        this.active = true;
        this.hb = new HitBox(pt, w, h);
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

        // context.strokeStyle = "#ffffff";
        // context.beginPath();
        // context.rect(this.hb.pt.x, this.hb.pt.y, this.hb.w, this.hb.h);
        // context.stroke();
    }
}

class Ball extends Thing {
    constructor(pt, r) {
        var color = "#ffffff";
        var w = r * 2;
        var h = r * 2;
        super(pt, color, w, h);
        this.move = new Vector(getRandomInt(-1000, 1000)/1, getRandomInt(-1000, 1000)/1);
        this.move.scale(5);
    }
    draw() {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.pt.x + this.w/2, this.pt.y + this.h/2, this.w/2, 0, 2 * Math.PI);
        context.fill();
    }
    update() {
        this.pt.apply(this.move);
        if (this.hb.outOfBoundsY()) {
            this.move.y *= -1;
        }
        if (this.hb.outOfBoundsX() != -1) {
            this.move.x *= -1;
        }
    }
}


class Paddle extends Thing {
    constructor(pt, w, h, ms) {
        var color = "#ffffff";
        super(pt, color, w, h);
        this.ms = ms;
    }
    update() {
        if (ball.pt.y > this.pt.y + this.h/2) {
            this.pt.y += this.ms; 
        }
        else {
            this.pt.y -= this.ms;
        }
        if (this.hb.checkCollide(ball.hb)) {
            ball.move.x *= -1;
        }
    }
}