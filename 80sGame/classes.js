class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    apply(vOther) {
        this.x += vOther.x;
        this.y += vOther.y;
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
    updateHB() {
        this.hb = new HitBox(this.pt, this.w, this.h);
    }
}

class Ability extends Thing {
    constructor(pt, w, h, timer, wait, txt) {
        var color = "#dadfe6";
        super(pt, color, w, h);
        this.timer = timer;
        this.wait = wait;
        this.txt = txt;
    }
    draw() {
        context.fillStyle = this.color;
        context.beginPath();
        context.rect(this.pt.x, this.pt.y, this.w, this.h);
        context.fill();
        
        var delay = this.wait - this.timer >= 0 ? this.wait - this.timer : 0;
        var width = (this.wait - delay) * this.w/this.wait;

        context.beginPath();
        context.fillStyle = delay == 0 ? "#9ee092" : "#5e94d1";
        context.rect(this.pt.x, this.pt.y, width, this.h);
        context.fill();

        context.textAlign = "center";
        context.fillStyle = "#ffffff";
        context.font = carHeight/3 + "px serif";
        context.textBaseline = "middle";
        context.fillText(this.txt, this.pt.x + this.w/2, this.pt.y + this.h/2);

        this.timer++;
    }
}

class GameTxt extends Thing {
    constructor(pt, color, w, h, txt) {
        super(pt, color, w, h);
        this.txt = txt;
    }
    draw() {
        context.beginPath();
        context.fillStyle = this.color;
        context.rect(this.pt.x, this.pt.y, this.w, this.h);
        context.fill();

        context.textAlign = "center";
        context.fillStyle = "#ffffff";
        context.font = carHeight/4.5 + "px serif";
        context.textBaseline = "middle";
        context.fillText(this.txt, this.pt.x + this.w/2, this.pt.y + this.h/2);
    }
    setTxt(txt) {
        this.txt = txt;
        this.w = context.measureText(this.txt).width + 5;
    }
}

class Laser extends Thing {
    constructor(pt, dir, stunTime) {
        var ms = Math.sqrt((canvas.width * canvas.width + canvas.height * canvas.height)/52000);
        var color = "#ff0055";
        switch (dir) {
            case "w":
                var moveVector = new Vector(0, -ms);
                var h = ms * 2;
                var w = ms;
                pt.x -= w/2;
                break;
            case "s":
                var moveVector = new Vector(0, ms);
                var h = ms * 2;
                var w = ms;
                pt.x -= w/2;
                break;
            case "a":
                var moveVector = new Vector(-ms, 0);
                var h = ms;
                var w = ms * 2;
                pt.y -= h/2;
                break
            case "d":
                var moveVector = new Vector(ms, 0);
                var h = ms;
                var w = ms * 2;
                pt.y -= h/2;
                break;
            case "sd":
                var moveVector = new Vector(ms * Math.sqrt(2) * 0.5, ms * Math.sqrt(2) * 0.5);
                var h = ms * 2;
                var w = ms;
                var angle = 45;
                break;
            case "wd":
                var moveVector = new Vector(ms * Math.sqrt(2) * 0.5, -ms * Math.sqrt(2) * 0.5);
                var h = ms * 2;
                var w = ms;
                var angle = -45;
                break;
            case "sa":
                var moveVector = new Vector(-ms * Math.sqrt(2) * 0.5, ms * Math.sqrt(2) * 0.5);
                var h = ms * 2;
                var w = ms;
                var angle = 135;
                break;
            case "wa":
                var moveVector = new Vector(-ms * Math.sqrt(2) * 0.5, -ms * Math.sqrt(2) * 0.5);
                var h = ms * 2;
                var w = ms;
                var angle = -135;
                break;
        }
        super(pt, color, w, h);
        this.stunTime = stunTime;
        this.ms = ms;
        this.dir = dir;
        this.angle = angle;
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
                    laserHitSound.currentTime = 0;
                    laserHitSound.play();
                }
            }
            if (["w", "a", "s", "d"].indexOf(this.dir) >= 0) {
                this.draw();
            }
            else {
                this.drawRotatedRect(this.angle);
            }
        }
    }
    drawRotatedRect(angle) {
        angle *= Math.PI / 180;
        context.lineWidth = this.w * 1.5;
        context.beginPath();
        context.moveTo(this.pt.x, this.pt.y);
        context.lineTo(this.pt.x + this.h * Math.cos(angle) * Math.sqrt(2), this.pt.y + this.h * Math.sin(angle) * Math.sqrt(2));
        context.stroke();
    }
}

class Player extends Thing {
    constructor(pt, w, h, msX, msY) {
        var color = "#00ff00";
        super(pt, color, w, h);
        this.msX = msX;
        this.msY = msY;
        this.teleportSpeed = 3;
        this.animation = 0;
        this.lastDrawDir = -1;
        this.updateHB();
        this.afterImages = [];
        this.frame = 0;
    }
    updateHB() { // player sprite doesn't take up full rectangle
        this.hb = new HitBox(new Vector(this.pt.x + this.w * 1/5, this.pt.y + this.h * 1/10), this.w * 3/5, this.h * 4/5);
    }
    moveUp(ms) {
        var obstacles = [...cars, ...waters, ...lasers, ...bar, ...this.afterImages];
        for (var i = 0; i < obstacles.length; i++) {
            obstacles[i].pt.y += ms;
        }  
        for (var i = 0; i < bar.length; i++) {
            bar[i].update();
        }
    }
    moveDown(ms) {
        var obstacles = [...cars, ...waters, ...lasers, ...bar, ...this.afterImages];
        for (var i = 0; i < obstacles.length; i++) {
            obstacles[i].pt.y -= ms;
        }  
        for (var i = 0; i < bar.length; i++) {
            bar[i].update();
        }
    }
    move() {
        if (this.active) {
            if (wDown || sDown || aDown || dDown) {
                this.frame++;
                switch (lastDir) {
                    case "w":
                        this.moveUp(this.msY/moveWait);
                        score += 1;
                        if (score > topScore) {
                            topScore = score;
                        }
                        break;
                    case "s":
                        this.moveDown(this.msY/moveWait);
                        score -= 1;
                        break;
                    case "a":
                        this.pt.x -= this.msX/moveWait;
                        break;
                    case "d":
                        this.pt.x += this.msX/moveWait;
                        break
                }
            }
            if (this.frame % 11 == 0 && alive) {
                this.animation++;
                this.frame++; // so if player stops on a %11, it doesn't freak out
                if (player.animation > 3) player.animation = 0;
            }
            if (qDown && qAbility.timer > qAbility.wait) { // teleport ability
                switch (lastDir) {
                    case "w":
                        for (var i = 0; i < this.teleportSpeed * 2 + 1; i++) {
                            this.afterImages.push(new AfterImage(new Vector(this.pt.x, this.pt.y - i * this.msY/2), this.w, this.h, Number(!alive), this.lastDrawDir, this.animation, 50 * i/2));
                        }
                        for (var i = 0; i < this.teleportSpeed; i++) {
                            this.moveUp(this.msY);
                            score += moveWait;
                            if (score > topScore) {
                                topScore = score;
                            }
                        }
                        break;
                    case "s":
                        for (var i = 0; i < this.teleportSpeed * 2 + 1; i++) {
                            this.afterImages.push(new AfterImage(new Vector(this.pt.x, this.pt.y + i * this.msY/2), this.w, this.h, Number(!alive), this.lastDrawDir, this.animation, 50 * i/2));
                        }
                        for (var i = 0; i < this.teleportSpeed; i++) {
                            this.moveDown(this.msY);
                            score -= moveWait;
                        }
                        break;
                    case "a":
                        for (var i = 0; i < this.teleportSpeed * 2 + 1; i++) {
                            this.afterImages.push(new AfterImage(new Vector(this.pt.x - i * this.msX/2, this.pt.y), this.w, this.h, Number(!alive), this.lastDrawDir, this.animation, 50 * i/2));
                        }
                        this.pt.x -= this.msX * this.teleportSpeed;
                        break;
                    case "d":
                        for (var i = 0; i < this.teleportSpeed * 2 + 1; i++) {
                            this.afterImages.push(new AfterImage(new Vector(this.pt.x + i * this.msX/2, this.pt.y), this.w, this.h, Number(!alive), this.lastDrawDir, this.animation, 50 * i/2));
                        }
                        this.pt.x += this.msX * this.teleportSpeed;
                        break
                }
                qAbility.timer = 0;
                teleportSound.currentTime = 0;
                teleportSound.play();
            }
            if (eDown && eAbility.timer > eAbility.wait) { // laser ability
                var startPos = new Vector(this.pt.x + (this.w/2), this.pt.y + (this.h/2));
                lasers.push(new Laser(startPos, lastDir, 60));
                eAbility.timer = 0;
                laserSound.currentTime = 0;
                laserSound.play();
            }
            if (rDown && rAbility.timer > rAbility.wait) { // laser grenade ability
                var dirs = ["w", "a", "s", "d", "sd", "wd", "sa", "wa"];
                for (var i = 0; i < dirs.length; i++) {
                    var startPos = new Vector(this.pt.x + (this.w/2), this.pt.y + (this.h/2));
                    lasers.push(new Laser(startPos, dirs[i], 120));
                }
                rAbility.timer = 0;
                multipleLaserSound.currentTime = 0;
                multipleLaserSound.play();
            }
        }
    }
    draw() {
        for (var i = 0; i < this.afterImages.length; i++) {
            this.afterImages[i].draw();
        }
        if (alive) {
            var dirs = ["s", "w", "d", "a"];
            var dir = dirs.indexOf(lastDir);
            this.lastDrawDir = dir;
        }
        context.drawImage(texPlayer, posSourceAnimation[Number(!alive)][this.lastDrawDir][this.animation][0], posSourceAnimation[Number(!alive)][this.lastDrawDir][this.animation][1], 10, 11, this.pt.x, this.pt.y, this.w, this.h);
    }
}

class AfterImage extends Thing {
    constructor(pt, w, h, a, b, c, frames) {
        var color = "#000000";
        super(pt, color, w, h);
        this.a = a;
        this.b = b;
        this.c = c;
        this.frames = frames;
    }
    draw() {
        if (this.frames > 0) {
            context.globalAlpha = this.frames/300 * 0.6;
            context.drawImage(texPlayer, posSourceAnimation[this.a][this.b][this.c][0], posSourceAnimation[this.a][this.b][this.c][1], 10, 11, this.pt.x, this.pt.y, this.w, this.h);
            context.globalAlpha = 1;
            this.frames--;
        }
    }
}

class Car extends Thing {
    constructor(pt, ms) {
        var color = "#ff0000";
        var w = carWidth;
        var h = carHeight;
        super(pt, color, w, h);
        this.ms = ms;
        this.stun = 0;
        this.offScreen = false;
        this.deathMessage = "Road Kill";
        this.deathColor = "#e37e7b";
        this.deathSound = document.getElementById("thunkSound");
        this.animation = 1;
        this.frame = 0;
    }
    update() {
        this.stun--;
        if (this.stun <= 0) {
            this.on();
        }
        if (this.active) {
            this.frame++;
            this.pt.x += this.ms;
            var animationWait = Math.abs(parseInt(30/this.ms));
            animationWait = animationWait > 0 ? animationWait : 30;
            if (this.frame % animationWait == 0) {
                this.animation = Number(!this.animation);
            }
        }
        if (this.hb.outOfBounds()) {
            this.ms = this.ms * -1;
            this.ms = this.ms * 1.001;
        }
        if (this.pt.y > canvas.height && !this.offScreen) {
            var pos = new Vector(getRandomInt(0, canvas.width - carWidth), this.pt.y - (1.5 * carHeight) * 10);
            cars.push(new Car(pos, this.ms * 1.01));
            this.offScreen = true;
        }
    }
    draw() {
        var dir = this.ms > 0 ? 0 : 1; 
        context.drawImage(texCar, posSourceCar[Number(!this.active)][dir][this.animation][0], posSourceCar[Number(!this.active)][dir][this.animation][1], 34, 17, this.pt.x, this.pt.y, this.w, this.h);
    }
}

class Block extends Thing {
    constructor(pt, color, color2, w, h) {
        super(pt, color, w, h);
        this.color2 = color2;
    }
    draw() {
        context.fillStyle = this.active ? this.color2 : this.color;
        context.beginPath();
        context.rect(this.pt.x, this.pt.y, this.w, this.h);
        context.fill();
    }
    update() {
        if (this.pt.y < -this.h) {
            this.pt.y = this.pt.y + (this.h * 10);
        }
        if (this.pt.y > canvas.height) {
            this.pt.y = this.pt.y - (this.h * 10);
        }
    }
}

class Water extends Thing {
    constructor(y) {
        var color = "#0000ff";
        var w = getRandomInt(carHeight * 0.5, carWidth * 1.5);
        var h = carHeight;
        var badX = true;
        while (badX) {
            badX = false;
            var x = getRandomInt(0, canvas.width - w);
            var tempHB = new HitBox(new Vector(x - 10, y - 10), w + 20, h + 20);
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
        this.deathSound = document.getElementById("splashSound");
    }

    update() {
        if (this.pt.y > canvas.height && !this.offScreen) {
            var y = this.pt.y - (1.5 * carHeight) * 10;
            waters.push(new Water(y));
            this.offScreen = true;
        }
    }
}