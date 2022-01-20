class HitBox {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    checkCollide(boxOther) {
        if (this.x < boxOther.x + boxOther.w && boxOther.x < this.x + this.w) {
            if (this.y < boxOther.y + boxOther.h && boxOther.y < this.y + this.h) {
                return true;
            }
        }
        return false;
    }
    draw(color) {
        context.strokeStyle = "#0000ff";
        context.lineWidth = 1;
        context.beginPath();
        context.rect(this.pt.x, this.pt.y, this.w, this.h);
        context.stroke();
    }
}

class Coin {
    constructor() {
        this.x = getRandomInt(settings.coinSize/2, canvas.width - settings.coinSize/2); // center of circle
        this.y = getRandomInt(settings.coinSize/2, canvas.height - settings.coinSize/2); // center of circle
        this.color = "#00ff00";
        this.hb = new HitBox(this.x - settings.coinSize/2, this.y - settings.coinSize/2, settings.coinSize, settings.coinSize);
        let collides = false;
        for (let i = 0; i < lines.length; i++) {
            if (this.hb.checkCollide(lines[i].hb)) {
                collides = true;
            }
        }
        if (collides) {
            this.color = "#ff0000";
            fails++;
        }
    }
    draw() {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, settings.coinSize/2, 0, 2 * Math.PI);
        context.fill();
    }
}

class Line {
    constructor(x) {
        this.x = x;
        this.hb = new HitBox(this.x, 0, settings.lineWidth, canvas.height);
    }
    draw() {
        context.strokeStyle = "#ffffff";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(this.x, 0);
        context.lineTo(this.x, canvas.height);
        context.stroke();
    }
}