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

class ButtonMenu {
    constructor(pt, w, h, text, textSize) {
        this.pt = pt;
        this.w = w;
        this.h = h;
        this.hb = new HitBox(pt, w, h);
        this.text = text;
        this.textSize = textSize;
        this.clicked = 0;
    }
    draw() {
        context.font = this.textSize + "px " + font;;
        if (this.clicked > 0) {
            this.hb.draw("#000000");
            context.fillStyle = "#ffffff";
            context.fillRect(this.pt.x, this.pt.y, this.w, this.h);
            context.fillStyle = "#000000";
            context.fillText(this.text, canvas.width/2, this.pt.y + this.h/2);
        }
        else {
            this.hb.draw("#ffffff");
            context.fillStyle = "#ffffff";
            context.fillText(this.text, canvas.width/2, this.pt.y + this.h/2);
        }
        this.clicked--;
    }
}

class ButtonExtra extends Thing {
    constructor(w, h) {
        super(new Vector(canvas.width - w, 0), w, h);
    }
    draw() {
        context.globalAlpha = 0.8;
        context.drawImage(texPause, posSourcePause[Number(!paused)][0], posSourcePause[Number(!paused)][1], 14, 14, this.pt.x, this.pt.y, this.w, this.h);
        context.globalAlpha = 1;
    }
}