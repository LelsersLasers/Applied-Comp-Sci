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
        context.beginPath();
        context.rect(this.pt.x, this.pt.y, this.w, this.h);
        context.stroke();
    }
}

class Thing {
    constructor(pt, w, h) {
        this.pt = pt;
        this.w = w;
        this.h = h;
        this.active = true;
        this.hb = new HitBox(pt, w, h);
    }
    off() {
        this.active = false;
    }
    on() {
        this.active = true;
    }
}

class Trigger extends Thing {
    constructor(pt, w, h, txt) {
        super(pt, w, h);
        this.color = "#5e94d1";
        this.color2 = "#9ee092";
        this.txt = txt;
        this.down = false;
    }
    draw(keyDown) {
        context.fillStyle = this.down || keyDown ? this.color : this.color2;
        context.beginPath();
        context.fillRect(this.pt.x, this.pt.y, this.w, this.h);
        this.drawTxt();
    }
    drawTxt() {
        context.fillStyle = "#ffffff";
        context.font = carHeight/3 + "px " + font;
        context.fillText(this.txt, this.pt.x + this.w/2, this.pt.y + this.h/2);
    }
    checkDown(cursorHB, mouseDown) {
        if (cursorHB.checkCollide(this.hb) && mouseDown) {
            this.down = true;
            return true;
        }
        this.down = false;
        return false;
    }
}

class Ability extends Trigger {
    constructor(pt, w, h, wait, txt, sound) {
        super(pt, w, h, txt);
        this.timer = wait;
        this.wait = wait;
        this.sound = sound;
        this.backgroundColor = "#dadfe6";
        this.canUseColor = "#9ee092";
        this.rechargingColor = "#5e94d1"
    }
    draw() {
        context.fillStyle = this.backgroundColor;
        context.beginPath();
        context.fillRect(this.pt.x, this.pt.y, this.w, this.h);
        
        let delay = this.wait - this.timer >= 0 ? this.wait - this.timer : 0;
        let width = (this.wait - delay) * this.w/this.wait;

        context.beginPath();
        context.fillStyle = delay == 0 ? this.canUseColor : this.rechargingColor;
        context.fillRect(this.pt.x, this.pt.y, width, this.h);

        this.drawTxt();
        if (!paused && this.timer < this.wait) this.timer++;
    }
    use() {
        this.timer = 0;
        this.sound.currentTime = 0;
        this.sound.play();
    }
    canUse() {
        return this.timer >= this.wait;
    }
    restore(save) {
        this.wait = save.wait;
        this.timer = save.timer;
    }
}

class Buff extends Ability {
    constructor(pt, w, h, wait, drain, txt, sound) {
        super(pt, w, h, wait, txt, sound);
        this.drain = drain;
        this.active = false;
        this.doubleClickProtection = 0;
    }
    draw() {
        if (this.active) this.rechargingColor = "#e37e7b";
        else this.rechargingColor = "#5e94d1";

        super.draw();
        
        if (this.timer <= 0) this.active = false;
        if (this.active && !paused) this.timer -= this.drain;
        this.doubleClickProtection--;
    }
    use() {
        if (this.doubleClickProtection <= 0) {
            if (this.active) this.active = false;
            else if (this.timer >= this.drain){
                this.active = true;
                this.sound.currentTime = 0;
                this.sound.play();
            }
            this.doubleClickProtection = 40;
        }
    }
    restore(save) {
        this.wait = save.wait;
        this.timer = save.timer;
    }
}

class GameTxt extends Thing {
    constructor(pt, color, w, h, txt) {
        super(pt, w, h);
        this.color = color;
        this.txt = txt;
    }
    draw() {
        context.beginPath();
        context.fillStyle = this.color;
        context.fillRect(this.pt.x, this.pt.y, this.w, this.h);

        context.fillStyle = "#ffffff";
        context.font = carHeight/4.5 + "px " + font;
        context.fillText(this.txt, this.pt.x + this.w/2, this.pt.y + this.h/2);
    }
    setTxt(txt) {
        this.txt = txt;
        this.w = context.measureText(this.txt).width + 5;
    }
}

class Laser extends Thing {
    constructor(pt, dir, stunTime, friendly) {
        let ms = Math.sqrt((canvas.width * canvas.width + canvas.height * canvas.height)/52000);
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
        super(pt, w, h);
        this.friendly = friendly;
        this.color = friendly ? "#ff0055" : "#0000ff";
        this.stunTime = stunTime;
        this.ms = ms;
        this.dir = dir;
        this.angle = angle;
        this.moveVector = moveVector;
        this.hitSound = document.createElement("audio");
        this.hitSound.src = "laserHitSound.mp3";
        this.hitSound.volume = 0.6/soundOffset;
    }
    update() {
        if (this.active) {
            this.pt.apply(this.moveVector);
            let enemies = this.friendly ? [...cars, ...ufos] : [player];
            for (var i in enemies) {
                if (this.hb.checkCollide(enemies[i].hb)) {
                    this.off();
                    enemies[i].off();
                    enemies[i].stun += this.stunTime;
                    this.hitSound.play();
                }
            }
            for (var i in buildings) {
                if (this.hb.checkCollide(buildings[i].hb)) this.off();
            }
        }
        this.draw();
    }
    draw() {
        if (this.active) {
            if (["w", "a", "s", "d"].indexOf(this.dir) >= 0) this.drawNormalRect();
            else this.drawRotatedRect(this.angle);
            this.hb.draw("#ffffff");
        }
    }
    drawRotatedRect(angle) {
        angle *= Math.PI / 180;
        context.strokeStyle = this.color;
        context.lineWidth = this.w * 1.5;
        context.beginPath();
        context.moveTo(this.pt.x, this.pt.y);
        context.lineTo(this.pt.x + this.h * Math.cos(angle) * Math.sqrt(2), this.pt.y + this.h * Math.sin(angle) * Math.sqrt(2));
        context.stroke();
        context.lineWidth = 3;
    }
    drawNormalRect() {
        context.strokeStyle = this.color;
        context.fillStyle = this.color;
        context.beginPath();
        context.rect(this.pt.x, this.pt.y, this.w, this.h);
        context.fill();
        context.stroke();
    }
    restore(save) {
        this.active = save.active;
        this.dir = save.dir;
        this.stunTime = save.stunTime;
        this.ms = save.ms;
        this.angle = save.angle;
        this.moveVector.x = save.moveVector.x;
        this.moveVector.y = save.moveVector.y;
        this.pt.x = save.pt.x;
        this.pt.y = save.pt.y;
    }
}

class Player extends Thing {
    constructor(pt, w, h, msX, msY) {
        super(pt, w, h);
        this.msX = msX;
        this.msY = msY;
        this.teleportSpeed = 3;
        this.sprintSpeed = 1.5;
        this.animation = 0;
        this.lastDrawDir = 0;
        this.updateHB();
        this.afterImages = [];
        this.frame = 0;
    }
    updateHB() { // player sprite doesn't take up full rectangle
        this.hb = new HitBox(new Vector(this.pt.x + this.w * 1/5, this.pt.y + this.h * 1/10), this.w * 3/5, this.h * 4/5);
    }
    moveVertical(ms) {
        let ufoLasers = [];
        for (var i in ufos) ufoLasers = [...ufoLasers, ...ufos[i].lasers];
        let obstacles = [...landSlides, ...cars, ...buildings, ...lasers, ...bar, ...this.afterImages, ...ufos, ...ufoLasers];
        for (var i in obstacles) obstacles[i].pt.y += ms * (eAbility.active > 0 ? this.sprintSpeed : 1);
        for (var i in bar) bar[i].update();
    }
    move() {
        if (this.active) {
            if (wDown || sDown || aDown || dDown) {
                this.frame++;
                switch (lastDir) {
                    case "w":
                        this.moveVertical(this.msY/moveWait);
                        score += 1;
                        if (score > topScore) topScore = score;
                        break;
                    case "s":
                        this.moveVertical(-this.msY/moveWait);
                        score -= 1;
                        break;
                    case "a":
                        this.pt.x -= this.msX/moveWait * (eAbility.active > 0 ? this.sprintSpeed : 1);
                        break;
                    case "d":
                        this.pt.x += this.msX/moveWait * (eAbility.active > 0 ? this.sprintSpeed : 1);
                        break;
                }
                this.updateHB();
                for (var i in buildings) {
                    if (this.hb.checkCollide(buildings[i].hb)) { // if it is touching, undo the last movement
                        if (lastDir == "a") this.pt.x += this.msX/moveWait * (eAbility.active > 0 ? this.sprintSpeed : 1);
                        else if (lastDir == "d") this.pt.x -= this.msX/moveWait * (eAbility.active > 0 ? this.sprintSpeed : 1);
                        else if (lastDir == "w") this.moveVertical(-this.msY/moveWait);
                        else if (lastDir == "s") this.moveVertical(this.msY/moveWait);
                    }
                }
            }
            let animationWait = eAbility.active ? 7 : 11;
            if (this.frame % animationWait == 0 && alive) {
                this.animation++;
                this.frame++; // so if player stops on a %11, it doesn't freak out
                if (player.animation > 3) player.animation = 0;
            }
            if (qDown && qAbility.canUse()) { // teleport ability
                switch (lastDir) {
                    case "w":
                        for (var i = 0; i < this.teleportSpeed * 2 + 1; i++) {
                            this.afterImages.push(new AfterImage(new Vector(this.pt.x, this.pt.y - i * this.msY/2), this.w, this.h, Number(!alive), this.lastDrawDir, this.animation, 50 * i/2));
                        }
                        this.moveVertical(this.msY * this.teleportSpeed);
                        score += moveWait * this.teleportSpeed;
                        if (score > topScore) topScore = score;
                        break;
                    case "s":
                        for (var i = 0; i < this.teleportSpeed * 2 + 1; i++) {
                            this.afterImages.push(new AfterImage(new Vector(this.pt.x, this.pt.y + i * this.msY/2), this.w, this.h, Number(!alive), this.lastDrawDir, this.animation, 50 * i/2));
                        }
                        this.moveVertical(-this.msY * this.teleportSpeed);
                        score -= moveWait * this.teleportSpeed;
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
                player.updateHB();
                for (var i in buildings) {
                    if (this.hb.checkCollide(buildings[i].hb)) {
                        if (lastDir == "w") this.moveVertical(-(buildings[i].pt.y + buildings[i].h - this.pt.y));
                        else if (lastDir == "s") this.moveVertical(this.pt.y - buildings[i].pt.y + this.h);
                        else if (lastDir == "a") this.pt.x += buildings[i].pt.x + buildings[i].w - this.pt.x;
                        else if (lastDir == "d") this.pt.x -= this.pt.x - buildings[i].pt.x + this.w;
                    }
                }
                qAbility.use();
            }
            if (eDown) { // sprint ability
                eAbility.use();
            }
            if (rDown && rAbility.canUse()) { // laser ability
                let dirs = ["w", "a", "s", "d", "sd", "wd", "sa", "wa"];
                for (var i = 0; i < dirs.length; i++) {
                    var startPos = new Vector(this.pt.x + (this.w/2), this.pt.y + (this.h/2));
                    lasers.push(new Laser(startPos, dirs[i], 120, true));
                }
                rAbility.use();
            }
        }
        if (this.pt.x < 0) this.pt.x = 0;
        else if (this.pt.x + this.w > canvas.width) this.pt.x = canvas.width - this.w;
        player.updateHB();
    }
    draw() {
        for (var i in this.afterImages) this.afterImages[i].draw();
        if (alive && !paused) {
            let dirs = ["s", "w", "d", "a"];
            let dir = dirs.indexOf(lastDir);
            this.lastDrawDir = dir;
        }
        context.drawImage(texPlayer, posSourcePlayer[Number(!alive)][this.lastDrawDir][this.animation][0], posSourcePlayer[Number(!alive)][this.lastDrawDir][this.animation][1], 10, 11, this.pt.x, this.pt.y, this.w, this.h);
    }
    restore(save) {
        this.active = save.active;
        this.afterImages = [];
        this.animation = save.animation;
        this.frame = save.frame;
        this.lastDrawDir = save.lastDrawDir;
        this.msX = save.msX;
        this.msY = save.msY;
        this.pt.x = save.pt.x;
        this.pt.y = save.pt.y;
    }
}

class AfterImage extends Thing {
    constructor(pt, w, h, a, b, c, frames) {
        super(pt, w, h);
        this.a = a;
        this.b = b;
        this.c = c;
        this.frames = frames;
    }
    draw() {
        if (this.frames > 0) {
            context.globalAlpha = this.frames/300 * 0.6;
            context.drawImage(texPlayer, posSourcePlayer[this.a][this.b][this.c][0], posSourcePlayer[this.a][this.b][this.c][1], 10, 11, this.pt.x, this.pt.y, this.w, this.h);
            context.globalAlpha = 1;
            if (!paused) this.frames--;
        }
    }
}

class Enemy extends Thing {
    constructor(pt, w, h, ms, soundFilename) {
        super(pt, w, h);
        this.frame = 0;
        this.stun = 0;
        this.ms = ms;
        this.deathSound = document.createElement("audio");
        this.deathSound.src = soundFilename;
        this.animation = getRandomInt(0, 2);
    }
    updateStun() {
        this.stun--;
        if (this.stun <= 0) {
            this.on();
            this.stun = 0;
        }
    }
    updateAnimation() {
        if (this.active) {
            this.frame++;
            var animationWait = this.getAnimationWait();
            animationWait = animationWait > 0 ? animationWait : 30;
            if (this.frame % animationWait == 0) this.animation = Number(!this.animation);
        }
    }
    getAnimationWait() {
        return Math.abs(parseInt(30/this.ms));
    }
}

class Car extends Enemy {
    constructor(y, ms) {
        let w = carWidth;
        let type = getRandomInt(1, 8) == 1 ? 1 : 0;
        if (type == 1) w *= 1.2;
        let h = carHeight;

        let badX = true;
        while (badX) {
            badX = false;
            var x = getRandomInt(0, canvas.width - w);
            let tempHB = new HitBox(new Vector(x - 10, y), w + 20, h);
            for (var i in buildings) {
                if (tempHB.checkCollide(buildings[i].hb)) badX = true;
            }
        }
        let pt = new Vector(x, y);

        super(pt, w, h, ms, "carHitSound.mp3");
        this.deathSound.volume = 2.0/soundOffset;
        if (type == 1) this.ms *= 1.2;
        this.offScreen = false;
        this.type = type;
    }
    update() {
        this.updateStun();
        this.updateAnimation();
        if (this.active) this.pt.x += this.ms;
        if (this.hb.outOfBounds()) this.ms *= -1.001;
        for (var i in buildings) {
            if (this.hb.checkCollide(buildings[i].hb)) this.ms *= -1;
        }
        if (this.pt.y > canvas.height && !this.offScreen) {
            let y = this.pt.y - (1.5 * carHeight) * 10;

            if (this.type == 1) var newMs = this.ms * 5/6 * 1.01;
            else var newMs = this.ms * 1.01;
            cars.push(new Car(y, newMs)); // always spawn new car

            if (getRandomInt(1, 15) * Math.pow(1.0001, score) >= 14) { // spawn ufo scale on score
                ufos.push(new Ufo(y));
            }

            if (Math.random() < buildingBlockCount/10 && !justPlaced) {
                buildings.push(new Building(y - (1.5 * carHeight) * 2));
                justPlaced = true;
            }
            else justPlaced = false;

            if (Math.random() < 1/20 && landSlideWait < 0) {
                landSlides.push(new LandSlide(y + 1.5 * carHeight));
                landSlideWait = 20;
            }
            else landSlideWait--;

            this.offScreen = true;
        }
    }
    draw() {
        let dir = this.ms > 0 ? 0 : 1;
        if (this.type == 1) {
            context.drawImage(texBus, posSourceBus[Number(!this.active)][dir][this.animation][0], posSourceCar[Number(!this.active)][dir][this.animation][1], 35, 17, this.pt.x, this.pt.y, this.w, this.h);
        }
        else {
            context.drawImage(texCar, posSourceCar[Number(!this.active)][dir][this.animation][0], posSourceCar[Number(!this.active)][dir][this.animation][1], 34, 17, this.pt.x, this.pt.y, this.w, this.h);
        }
    }
    restore(save) {
        this.ms = save.ms;
        this.type = save.type;
        this.offset = save.offset;
        this.animation = save.animation;
        this.frame = save.frame;
        this.stun = save.stun;
        this.active = save.active;
        this.offScreen = save.offScreen;
        this.w = save.w;
        this.hb.w = save.hb.w;
        this.pt.x = save.pt.x;
        this.pt.y = save.pt.y;
    }
}

class Ufo extends Enemy {
    constructor(y) {
        let w = ufoWidth;
        let h = ufoHeight;
        let pt = new Vector(getRandomInt(0, canvas.width - w), y);
        let ms = score/5000 * (canvas.width * canvas.width + canvas.height * canvas.height)/(800 * 800) + 1;
        super(pt, w, h, ms, "ufoHitSound.mp3");
        this.deathSound.volume = soundOffset/soundOffset;

        if (getRandomInt(1, 3) == 1) {
            this.move = new Vector(player.pt.x + player.w/2 - this.pt.x + this.w/2, player.pt.y + player.h/2 - this.pt.y + this.h/2); // punish player for not moving
        }
        else {
            this.move = new Vector(getRandomInt(-12, 12), getRandomInt(3, 5));
        }
        this.move.scale(this.ms);
        this.canShoot = score > 100;
        if (this.canShoot) this.lasers = [];
    }
    getAnimationWait() {
        return Math.abs(parseInt(30/((this.ms/1.5))));
    }
    update() {
        this.updateStun();
        this.updateAnimation();
        if (this.active) this.pt.apply(this.move);
        this.updateHB();
        if (this.hb.outOfBounds()) this.move.x *= -1;

        if (this.canShoot) {
            this.frame++;
            var animationWait = this.getAnimationWait() * 4;
            animationWait = animationWait > 0 ? animationWait : 30;
            if (this.frame % animationWait == 0) {
                this.lasers.push(new Laser(new Vector(this.pt.x + this.w/2, this.pt.y + this.h/2), "w", 60, false));
                this.lasers[this.lasers.length - 1].moveVector = new Vector(player.pt.x + player.w/2 - this.pt.x + this.w/2, player.pt.y + player.h/2 - this.pt.y + this.h/2);
                this.lasers[this.lasers.length - 1].moveVector.scale(this.lasers[this.lasers.length - 1].ms);
            }
        }
    }
    draw() {
        context.drawImage(texUfo, posSourceUfo[Number(!this.active)][this.animation][0], posSourceUfo[Number(!this.active)][this.animation][1], 20, 19, this.pt.x, this.pt.y, this.w, this.h);
        for (var i in this.lasers) this.lasers[i].update();
        
        context.fillStyle = "#ff0000";
        context.fillRect(player.pt.x + player.w/2 - 4, player.pt.y + player.h/2 - 4, 8, 8);
        context.fillRect(this.pt.x + this.w/2 - 4, this.pt.y + this.h/2 - 4, 8, 8);
        
        context.beginPath();
        context.moveTo(this.pt.x + this.w/2, this.pt.y + this.h/2);
        context.lineTo(player.pt.x + player.w/2, player.pt.y + player.h/2);
        context.stroke();

        for (var i in this.lasers) {
            if (this.lasers[i].active) {
                context.beginPath();
                context.moveTo(this.pt.x + this.w/2, this.pt.y + this.h/2);
                context.lineTo(this.lasers[i].pt.x, this.lasers[i].pt.y);
                context.stroke();
            }
        }
    }
    updateHB() {
        this.hb = new HitBox(new Vector(this.pt.x + this.w * 1/5, this.pt.y + this.h * 1/10), this.w * 3/5, this.h * 4/5);
    }
    restore(save) {
        this.active = save.active;
        this.animation = save.animation;
        this.frame = save.frame;
        this.move.x = save.move.x;
        this.move.y = save.move.y;
        this.stun = save.stun;
        this.pt.x = save.pt.x;
        this.pt.y = save.pt.y;
        this.friendly = save.friendly;
    }
}

class Block extends Thing { // "Arrows" on the side
    constructor(pt, i, w, h) {
        super(pt, w, h);
        this.animation = i % 2;
    }
    draw() {
        context.drawImage(texBar, posSourceBar[this.animation][0], posSourceBar[this.animation][1], 14, 11, this.pt.x, this.pt.y, this.w, this.h);
    }
    update() {
        if (this.pt.y < -this.h) this.pt.y = this.pt.y + (this.h * canvas.height/barHeight);
        if (this.pt.y > canvas.height) this.pt.y = this.pt.y - (this.h * canvas.height/barHeight);
    }
    restore(save) {
        this.animation = save.animation;
        this.w = save.w;
        this.h = save.h;
        this.pt.x = save.pt.x;
        this.pt.y = save.pt.y;
    }
}

class Building extends Thing {
    constructor(y) {
        let h = carHeight * 2.5;
        let widthOfOne = (26 * h/40);
        let maxW = Math.floor((carWidth * 1.5)/widthOfOne);
        let buildingCount = getRandomInt(1, maxW + 1);
        let w = buildingCount * widthOfOne;

        let badX = true;
        while (badX) {
            badX = false;
            var x = getRandomInt(0, canvas.width - w);
            let tempHB = new HitBox(new Vector(x - 10, y), w + 20, h);
            for (var i in cars) {
                if (tempHB.checkCollide(cars[i].hb)) badX = true;
            }
        }
        let pt = new Vector(x, y);
        super(pt, w, h);

        this.buildings = [];
        for (var i = 0; i < buildingCount; i++) {
            let src = getRandomInt(0, 3);
            this.buildings.push(posSourceBuilding[src]);
        }
        this.widthOfOne = widthOfOne;
    }
    draw() {
        for (var i = 0; i < this.buildings.length; i++) {
            context.drawImage(texBuilding, this.buildings[i][0], this.buildings[i][1], 26, 40, this.pt.x + i * this.widthOfOne, this.pt.y, this.widthOfOne, this.h);
        }
    }
    restore(save) {
        this.buildings = save.buildings;
        this.widthOfOne = save.widthOfOne;
        this.w = save.w;
        this.hb.w = this.w;
        this.pt.x = save.pt.x;
        this.pt.y = save.pt.y;
    }
}

class ButtonMenu extends Thing {
    constructor(pt, w, h, text, textSize) {
        super(pt, w, h);
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

class LandSlide extends Enemy {
    constructor(y) {
        let w = canvas.width;
        let h = carHeight * 8.5;

        let Xs = [0 - w, canvas.width]
        let MSs = [w/200, -w/200];
        let dir = getRandomInt(0, 2);

        super(new Vector(Xs[dir], y), w, h, MSs[dir] * (1 + score/5000), "TODO.mp3");
        this.deathSound.volume = 2.0/soundOffset;
        this.deathSound.play();
    }
    update() {
        this.updateAnimation();
        this.pt.x += this.ms;
        let obstacles = [...cars, player];
        for (var i in obstacles) {
            if (this.hb.checkCollide(obstacles[i].hb)) {
                obstacles[i].pt.x += this.ms/4;
                player.updateHB();
                for (var j in buildings) {
                    if (obstacles[i].hb.checkCollide(buildings[j].hb)) {
                        obstacles[i].pt.x = this.ms > 0 ? buildings[j].pt.x - obstacles[i].hb.w : buildings[j].pt.x + buildings[j].hb.w;
                        obstacles[i].pt.x -= (obstacles[i].w - obstacles[i].hb.w)/2; // for player
                    }
                }
                if (obstacles[i].hb.outOfBounds()) {
                    obstacles[i].pt.x = this.ms > 0 ? canvas.width - obstacles[i].w : 0;
                }
            }
        }
    }
    draw() {
        context.fillStyle = "#FFA500";
        context.beginPath();
        context.fillRect(this.pt.x, this.pt.y, this.w, this.h);
    }
    restore(save) {
        this.pt.x = save.pt.x;
        this.pt.y = save.pt.y;
        this.ms = save.ms;
        this.animation = save.animation;
        this.frame = save.frame;
    }
}