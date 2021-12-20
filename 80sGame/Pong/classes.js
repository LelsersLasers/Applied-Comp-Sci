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
            return 1;
        }
        else if (this.pt.x + this.w > canvas.width) {
            return 0;
        }
        return -1;
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
        this.width = 3;
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
    }
}

class Ball extends Thing {
    constructor(r) {
        var color = "#ffffff";
        var w = r * 2;
        var h = r * 2;
        var pt = new Vector(canvas.width/2 - r, canvas.height/2 - r);
        super(pt, color, w, h);
        this.move = new Vector(getRandomInt(1,3) == 1 ? 1 : -1, 0);
        this.ms = r;
        this.move.scale(r);
        this.pts = [];
    }
    draw() {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.pt.x + this.w/2, this.pt.y + this.h/2, this.w/2, 0, 2 * Math.PI);
        context.fill();
    }
    update() {
        this.pts.push(new Vector(this.pt.x + this.w/2, this.pt.y + this.h/2));
        this.move.scale(this.ms);
        this.pt.apply(this.move);
        if (this.hb.outOfBoundsY()) {
            this.move.y *= -1;
        }
        if (this.hb.outOfBoundsX() != -1) {
            if (this.hb.outOfBoundsX() == 0 && paddle2.active) {
                paddle2.off();
                paddle2.ms *= 1.2;
                ball.ms *= 0.75;
                score[this.hb.outOfBoundsX()]++;
                this.move.x *= -1;
            }
            else if (this.hb.outOfBoundsX() == 1 && paddle1.active) {
                paddle1.off();
                paddle1.ms *= 1.2;
                ball.ms *= 0.75;
                score[this.hb.outOfBoundsX()]++;
                this.move.x *= -1;
            }
        }
        if (this.pt.x > (canvas.width - this.w)/2) {
            paddle1.on();
            paddle1.canHit = true;
        }
        else {
            paddle2.on();
            paddle2.canHit = true;
        }
        context.lineWidth = 1;
        context.strokeStyle = "#ffffff";
        context.fillStyle = "#666666";
        context.beginPath();
        context.moveTo(this.pts[0].x, this.pts[0].y);
        for (var i = 1; i < this.pts.length; i++) {
            context.lineTo(this.pts[i].x, this.pts[i].y);
        }
        // context.fill();
        context.stroke();
    }
}


class Paddle extends Thing {
    constructor(x, w, h, ms) {
        var color = "#ffffff";
        var pt = new Vector(x, (canvas.height - h)/2);
        super(pt, color, w, h);
        this.ms = ms;
        this.canHit = true;
        this.mode = false;
        this.keys = [false, false];
        this.side = this.pt.x < canvas.width/2 ? "left" : "right";
    }
    update() {
        if (!this.mode) {
            let tempBallPt = new Vector(ball.pt.x, ball.pt.y);
            if (this.side == "left") {
                while (ball.pt.x >= this.pt.x + this.w) {
                    ball.update();
                }
            }
            else {
                while (ball.pt.x <= this.pt.x) {
                    ball.update();
                }
            }
            let target = ball.pt;
            ball.pt.x = tempBallPt.x;
            ball.pt.y = tempBallPt.y;
            context.beginPath();
            context.rect(target.x, target.y, 20, 20);
            context.fill();
            if (target.y > this.pt.y + this.h/2) {
                if (this.pt.y <= canvas.height - this.h) this.pt.y += this.ms; 
            }
            else {
                if (this.pt.y >= 0) this.pt.y -= this.ms;
            }
        }
        else {
            if (this.keys[1]) {
                if (this.pt.y <= canvas.height - this.h) this.pt.y += this.ms;  
            }
            if (this.keys[0]) {
                if (this.pt.y >= 0) this.pt.y -= this.ms;
            }
        }
        if (this.active && this.canHit) {
            if (this.hb.checkCollide(ball.hb)) {
                var dir = ball.move.x > 0 ? -1 : 1;
                ball.move = new Vector(getRandomInt(6, 10), getRandomInt(-6, 6));
                ball.move.x *= dir;
                ball.ms *= 1.05;
                this.canHit = false;
            }
        }
    }
}