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

class Spaceship {
    constructor(pt, len) {
        this.pt = pt;
        this.angle = 0;
        this.len = len;

        this.turnSpeed = 3;
        this.thrustSpeed = 0.01;
        this.maxThrust = 0.02;
        this.maxSpeed = 4.0;
 
        this.moveVector = new Vector(0, 0);

        this.color = "#ffffff";
        this.hb = new HitBox(pt, this.len/2, this.len);
    }
    move() {
        if (wDown) {
            this.thrustSpeed += 0.001;
        }
        if (sDown) {
            this.thrustSpeed -= 0.001;
        }
        if (dDown) {
            this.angle -= this.turnSpeed;
        }
        if (aDown) {
            this.angle += this.turnSpeed;
        }

        if (this.thrustSpeed < 0) this.thrustSpeed = 0; // no reverse
        else if (this.thrustSpeed > this.maxThrust) this.thrustSpeed = this.maxThrust;

        this.moveVector.apply(new Vector(-Math.sin(degToRad(this.angle)) * this.thrustSpeed, -Math.cos(degToRad(this.angle)) * this.thrustSpeed));
        let currentSpeed = this.moveVector.calcLen();
        if (currentSpeed > this.maxSpeed) this.moveVector.scale(this.maxSpeed);
        // this.pt.apply(this.moveVector);
        
        for (var i = 0; i < asteroids.length; i++) {
            asteroids[i].pt.apply(this.moveVector);
        }
    }
    draw() {
        context.fillStyle = this.color;

        context.beginPath();
        context.moveTo(this.pt.x, this.pt.y);
        context.lineTo(this.pt.x + Math.sin(degToRad(this.angle)) * this.len, this.pt.y + Math.cos(degToRad(this.angle)) * this.len);
        context.lineTo(this.pt.x + Math.sin(degToRad(this.angle)) * this.len + Math.sin(degToRad(90 + this.angle)) * this.len/2, this.pt.y + Math.cos(degToRad(this.angle)) * this.len + Math.cos(degToRad(90 + this.angle)) * this.len/2);
        context.lineTo(this.pt.x + Math.sin(degToRad(90 + this.angle)) * this.len/2, this.pt.y + Math.cos(degToRad(90 + this.angle)) * this.len/2);
        context.fill();

        // this.hb.draw("#00ff00");
        this.drawThrustBar();
    }
    drawThrustBar() {
        let x = 0;
        let w = 50;
        let maxHeight = 200;
        let y = canvas.height - maxHeight;

        context.fillStyle = "grey";
        context.beginPath();
        context.rect(x, y, w, maxHeight);
        context.fill();

        context.fillStyle = "#00ff00";
        context.beginPath();
        let percent = this.thrustSpeed/this.maxThrust;
        context.rect(x, canvas.height - maxHeight * percent, w, maxHeight * percent);
        context.fill();
    }

    // checkHit(hb) {
        
    // }
}


class Asteroid {
    constructor() {
        this.w = 50;
        this.h = 50;

        let badPt = true;
        this.pt = new Vector(-1, -1);
        while (badPt) {
            badPt = false;
            this.pt = new Vector(getRandomInt(0, canvas.width - this.w), getRandomInt(0, canvas.height - this.h));
            for (var i = 0; i < asteroids.length; i++) {
                if (new HitBox(this.pt, this.w, this.h).checkCollide(asteroids[i].hb)) {
                    badPt = true;
                }
                // if (new HitBox(tempPt, this.w, this.h).checkCollide(PLAYER.HB))
            }
        }
        this.color = "#ff0000";
        this.hb = new HitBox(this.pt, this.w, this.h);

        console.log("Asteroid created... (" + this.pt.x + "," + this.pt.y + ")");
    }
    draw() {
        context.fillStyle = this.color;
        context.beginPath();
        context.rect(this.pt.x, this.pt.y, this.w, this.h);
        context.fill();
    }
}