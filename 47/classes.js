class Vector { // vectors can also be used as points
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
    }
    checkCollide(boxOther) {
        if (this.pt.x < boxOther.pt.x + boxOther.w && boxOther.pt.x < this.pt.x + this.w) {
            if (this.pt.y < boxOther.pt.y + boxOther.h && boxOther.pt.y < this.pt.y + this.h) {
                return true;
            }
        }
        return false;
    }
}

class Coin {
    constructor() {
        this.pt = new Vector(
            getRandomInt(settings.coinSize/2, canvas.width - settings.coinSize/2),
            getRandomInt(settings.coinSize/2, canvas.height - settings.coinSize/2)
        );
        this.color = "#ff0000";
        this.hb = new HitBox(new Vector(this.pt.x - settings.coinSize/2, this.pt.y - settings.coinSize/2), settings.coinSize, settings.coinSize);
        let collides = false;
        for (let i = 0; i < lines.length; i++) {
            if (this.hb.checkCollide(lines[i].hb)) {
                collides = true;
            }
        }
        if (!collides) {
            this.color = "#00ff00";
            noTouching++;
        }
    }
    draw() {
        context.fillStyle = this.color;
        context.strokeStyle = "#ffffff";
        context.lineWidth = settings.coinOutline;
        context.beginPath();
        context.arc(this.pt.x, this.pt.y, settings.coinSize/2, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
    }
}

class Line {
    constructor(x) {
        this.x = x;
        this.hb = new HitBox(new Vector(x, 0), settings.lineWidth, canvas.height);
    }
    draw() {
        context.strokeStyle = settings.drawnLineColor;
        context.lineWidth = settings.drawnLineWidth;
        context.beginPath();
        context.moveTo(this.x, 0);
        context.lineTo(this.x, canvas.height);
        context.stroke();
    }
}