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
    getAngle() {
        return radToDeg(Math.atan(this.y/this.x));
    }
    setAngle(angle) {
        var currentLen = this.calcLen();
        this.x = 1;
        this.y = Math.tan(angle);
        this.scale(currentLen);
    }
    calcLen() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    draw() {
        context.strokeStyle = "#ffffff";
        context.beginPath();
        context.moveTo(canvas.width/2, canvas.height/2);
        context.lineTo(canvas.width/2 + this.x, canvas.height/2 + this.y);
        context.lineTo(canvas.width/2 + this.x, canvas.height/2);
        context.lineTo(canvas.width/2, canvas.height/2);
        context.stroke();
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

class Ship {
    constructor(pt, len) {
        this.pt = pt;
        this.angle = 0;
        this.len = len;

        this.turnSpeed = 3;
        this.thrust = 0.002;
        this.vel = 0.0;
 
        this.moveVector = new Vector(0, 0);

        this.color = "#ffffff";
        this.hb = new HitBox(pt, this.len/2, this.len);
    }
    move() {
        if (wDown) {
            this.vel += this.thrust;
        }
        else {
            this.vel -= this.thrust / 0.5;
        }
        if (dDown) {
            this.angle += this.turnSpeed;
        }
        if (aDown) {
            this.angle -= this.turnSpeed;
        }
        this.moveVector.apply(new Vector(Math.cos(degToRad(this.angle)) * this.vel, Math.sin(degToRad(this.angle)) * this.vel));
        this.pt.apply(this.moveVector);
    }
    draw() {
        context.fillStyle = this.color;
        context.strokeStyle = this.color;
        context.beginPath();
        context.moveTo(this.pt.x, this.pt.y);
        context.lineTo(this.pt.x + Math.cos(degToRad(this.angle)) * (this.vel + 0.5) * 200, this.pt.y + Math.sin(degToRad(this.angle)) * (this.vel + 0.5) * 200);
        context.stroke();
    }

    // checkHit(hb) {
        
    // }
}