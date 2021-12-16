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
    getAngle() {
        return radToDeg(Math.atan(this.y/this.x));
    }
    setAngle(angle) {
        var currentLen = Math.sqrt(this.x * this.x + this.y * this.y);
        this.x = 1;
        this.y = Math.tan(angle);
        this.scale(currentLen);
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

class Car {
    constructor(pt, len) {
        this.pt = pt;
        this.angle = 0;
        this.len = len;

        this.speed = 0;
        this.turnSpeed = 4;
        this.grip = 100;

        let resistanceGround = -0.05;
        let resistanceAir = -0.05;
        this.forces = [resistanceGround, resistanceAir];
    }
    move() {
        for (let i = 0; i < this.forces.length; i++) {
            this.speed += this.forces[i];
        }
        if (wDown) {
            this.speed += 0.2;
        }
        if (sDown) {
            this.speed -= 0.1;
        }
        if (this.speed > 0) {
            if (dDown) {
                this.angle -= this.turnSpeed * this.grip/100;
            }
            if (aDown) {
                this.angle += this.turnSpeed * this.grip/100;
            }
        }
        this.grip = 100 * Math.pow(0.95, this.speed);
        if (this.speed < 0) this.speed = 0;
        this.pt.apply(new Vector(Math.sin(degToRad(this.angle)) * this.speed, Math.cos(degToRad(this.angle)) * this.speed));
    }
    draw() {
        context.strokeStyle = "#ffffff";
        context.lineWidth = this.len/2;
        context.beginPath();
        context.moveTo(this.pt.x, this.pt.y);
        context.lineTo(this.pt.x + Math.sin(degToRad(this.angle)) * this.len, this.pt.y + Math.cos(degToRad(this.angle)) * this.len);
        context.stroke();
    }
}