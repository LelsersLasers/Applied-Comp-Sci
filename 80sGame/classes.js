class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    print() {
        console.log("(" + this.x + ", " + this.y + ")");
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
    constructor(pt, color, w, h) { // w, h, radius, etc per child
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
    updateHB() {
        this.hb = new HitBox(this.pt, this.w, this.h);
    }
}

class Laser extends Thing {
    constructor(pt, dir, ms) {
        var color = "#ff0055";
        if (dir == "w") {
            var moveVector = new Vector(0, -ms);
            var h = ms * 2;
            var w = ms;
        }
        else if (dir == "s") {
            var moveVector = new Vector(0, ms);
            var h = ms * 2;
            var w = ms;
        }
        else if (dir == "a") {
            var moveVector = new Vector(-ms, 0);
            var h = ms;
            var w = ms * 2;
        }
        else if (dir == "d") {
            var moveVector = new Vector(ms, 0);
            var h = ms;
            var w = ms * 2;
        }
        super(pt, color, w, h);
        this.stunTime = 60;
        this.ms = ms;
        this.moveVector = moveVector;
    }
    update() {
        if (this.active) {
            this.pt.apply(this.moveVector);
            for (var i = 0; i < cars.length; i++) {
                if (this.hb.checkCollide(cars[i].hb)) {
                    this.off();
                    cars[i].off();
                    cars[i].stun = this.stunTime;
                }
            }
            this.draw();
        }
    }
}

class Player extends Thing {
    constructor(pt, w, h, ms) {
        var color = "#00ff00";
        super(pt, color, w, h);
        this.ms = ms;
        this.teleportSpeed = 3;
    }
    moveUp() {
        obstacles = [...cars, ...waters];
        for (var i = 0; i < obstacles.length; i++) {
            obstacles[i].pt.y += this.ms;
        }  
        for (var i = 0; i < bar.length; i++) {
            bar[i].toggle();
        }
        score += 1;
        if (score > topScore) {
            topScore = score;
        }
    }
    moveDown() {
        obstacles = [...cars, ...waters];
        for (var i = 0; i < obstacles.length; i++) {
            obstacles[i].pt.y -= this.ms;
        }  
        for (var i = 0; i < bar.length; i++) {
            bar[i].toggle();
        }
        score -= 1;
    }
    move() {
        if (this.active && frame > moveLockWait) {
            if (up) {
                this.moveUp();
            }
            else if (down) {
                this.moveDown();
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
        if (this.active && qTimer > qWait) { // teleport ability
            if (qDown) {
                if (lastDir == "w") {
                    for (var i = 0; i < this.teleportSpeed; i++) {
                        this.moveUp();
                    }
                }
                else if (lastDir == "s") {
                    for (var i = 0; i < this.teleportSpeed; i++) {
                        this.moveDown();
                    }
                }
                else if (lastDir == "a") {
                    this.pt.x -= this.ms * this.teleportSpeed;
                }
                else if (lastDir == "d") {
                    this.pt.x += this.ms * this.teleportSpeed;
                }
                qTimer = 0;
            }
        }
        if (this.active && eTimer > eWait) { // laser ability
            if (eDown) {
                var startPos = new Vector(this.pt.x + (this.w/2), this.pt.y + (this.h/2)); // why is it a reference??
                lasers.push(new Laser(startPos, lastDir, 5));
                eTimer = 0;
            }
        }
    }
}

class Car extends Thing {
    constructor(pt, w, h, ms) {
        var color = "#ff0000";
        super(pt, color, w, h);
        this.ms = ms;
        this.stun = 0;
        this.offScreen = false;
        this.deathMessage = "Road Kill";
        this.deathColor = "#e37e7b";
    }
    update() {
        this.stun--;
        if (this.stun <= 0) {
            this.on();
        }
        if (this.active) {
            this.pt.x += this.ms;
        }
        if (this.pt.x < 0 || this.pt.x > canvas.width - this.w) {
            this.ms = this.ms * -1;
            this.ms = this.ms * 1.01;
        }
        if (this.pt.y > canvas.height && !this.offScreen) {
            var pos = new Vector(getRandomInt(0, canvas.width - carWidth), this.pt.y - (1.5 * carHeight) * 10);
            cars.push(new Car(pos, carWidth, carHeight, this.ms * 1.05));
            this.offScreen = true;
        }
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

class Water extends Thing {
    constructor(y) {
        var color = "#0000ff";
        var w = getRandomInt(carHeight * 0.75, carHeight * 2);
        var h = carHeight;
        var badX = true;
        while (badX) {
            badX = false;
            var x = getRandomInt(0, canvas.width - w);
            var tempHB = new HitBox(new Vector(x,y), w, h);
            for (var i = 0; i < cars.length; i++) {
                if (tempHB.checkCollide(cars[i].hb)) {
                    badX = true;
                }
            }
        }
        var pt = new Vector(x, y);
        super(pt, color, w, h);
        this.offScreen = false;
        this.deathMessage = "Drowned";
        this.deathColor = "#7bb6e3";
    }

    update() {
        if (this.pt.y > canvas.height && !this.offScreen) {
            var y = this.pt.y - (1.5 * carHeight) * 10;
            waters.push(new Water(y));
            this.offScreen = true;
        }
    }
}