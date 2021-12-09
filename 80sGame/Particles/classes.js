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
    outOfBounds() {
        if (this.pt.x < 0 || this.pt.x + this.w > canvas.width) {
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

class Thing {
    constructor(pt, color, w, h, type) {
        this.pt = pt;
        this.color = color;
        this.w = w;
        this.h = h;
        this.width = 1;
        this.active = true;
        this.hb = new HitBox(pt, w, h);
        this.type = type;
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

class Particle extends Thing {
    constructor(pt, w, h) {
        var color = "#ffffff";
        super(pt, color, w, h, -1);
        this.move = new Vector(getRandomInt(-1000, 1000)/1, getRandomInt(-1000, 1000)/1);
        this.move.scale(2);
        this.pts = [];
    }

    update() {
        this.pt.apply(this.move);
        for (var i = 0; i < walls.length; i++) {
            if (this.hb.checkCollide(walls[i].hb)) {
                if (walls[i].type == 2) {
                    this.move.x = -this.move.x;
                }
                else {
                    this.move.y = -this.move.y;
                }
            }
        }
        if (this.active) this.pts.push(new Vector(this.pt.x, this.pt.y));
        if (this.hb.checkCollide(endBlock.hb) || !this.active) {
            endBlock.color = "#ffffff";
            this.drawLine();
        }
    }
    drawLine() {
        context.strokeStyle = "#00ff00";
        context.color = "#00ff00";
        context.beginPath();
        context.moveTo(this.pts[0].x, this.pts[0].y);
        for (var i = 1; i < this.pts.length; i++) {
            context.lineTo(this.pts[i].x, this.pts[i].y);
        }
        context.stroke();
        this.off();
        alive = false;
    }
}