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
    constructor(pt, w, h) {
        this.pt = pt;
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
        context.rect(this.pt.x, this.pt.y, this.w, this.h);
        context.fill();
        this.drawTxt();
    }
    drawTxt() {
        context.textAlign = "center";
        context.fillStyle = "#ffffff";
        context.font = carHeight/3 + "px " + font;
        context.textBaseline = "middle";
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
    constructor(pt, w, h, timer, wait, txt, sound) {
        super(pt, w, h, txt);
        this.color = "#dadfe6";
        this.timer = timer;
        this.wait = wait;
        this.sound = sound;
    }
    draw() {
        context.fillStyle = this.color;
        context.beginPath();
        context.rect(this.pt.x, this.pt.y, this.w, this.h);
        context.fill();
        
        let delay = this.wait - this.timer >= 0 ? this.wait - this.timer : 0;
        let width = (this.wait - delay) * this.w/this.wait;

        context.beginPath();
        context.fillStyle = delay == 0 ? "#9ee092" : "#5e94d1";
        context.rect(this.pt.x, this.pt.y, width, this.h);
        context.fill();

        this.drawTxt();

        this.timer++;
    }
    use() {
        this.timer = 0;
        this.sound.currentTime = 0;
        this.sound.play();
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
        context.rect(this.pt.x, this.pt.y, this.w, this.h);
        context.fill();

        context.textAlign = "center";
        context.fillStyle = "#ffffff";
        context.font = carHeight/4.5 + "px " + font;
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
        this.color = "#ff0055";
        this.stunTime = stunTime;
        this.ms = ms;
        this.dir = dir;
        this.angle = angle;
        this.moveVector = moveVector;
        this.hitSound = document.createElement("audio");
        this.hitSound.src = "laserHit.mp3";
    }
    update() {
        if (this.active) {
            this.pt.apply(this.moveVector);
            obstacles = [...cars, ...ufos];
            for (var i = 0; i < obstacles.length; i++) {
                if (this.hb.checkCollide(obstacles[i].hb)) {
                    this.off();
                    obstacles[i].off();
                    obstacles[i].stun += this.stunTime;
                    this.hitSound.play();
                }
            }
            for (var i = 0; i < buildings.length; i++) {
                if (this.hb.checkCollide(buildings[i].hb)) {
                    this.off();
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
        super(pt, w, h);
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
        let obstacles = [...cars, ...buildings, ...lasers, ...bar, ...this.afterImages, ...ufos];
        for (var i = 0; i < obstacles.length; i++) {
            obstacles[i].pt.y += ms;
        }  
        for (var i = 0; i < bar.length; i++) {
            bar[i].update();
        }
    }
    moveDown(ms) {
        let obstacles = [...cars, ...buildings, ...lasers, ...bar, ...this.afterImages, ...ufos];
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
                this.updateHB();
                for (var i = 0; i < buildings.length; i++) {
                    if (this.hb.checkCollide(buildings[i].hb)) { // if it is touching, undo the last movement
                        if (lastDir == "a") this.pt.x += this.msX/moveWait;
                        else if (lastDir == "d") this.pt.x -= this.msX/moveWait;
                        else if (lastDir == "w") this.moveDown(this.msY/moveWait);
                        else if (lastDir == "s") this.moveUp(this.msY/moveWait);
                    }
                }
                if (this.pt.x < 0) this.pt.x = 0;
                else if (this.pt.x + this.w > canvas.width) this.pt.x = canvas.width - this.w;
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
                        this.moveUp(this.msY * this.teleportSpeed);
                        score += moveWait * this.teleportSpeed;
                        if (score > topScore) {
                            topScore = score;
                        }
                        break;
                    case "s":
                        for (var i = 0; i < this.teleportSpeed * 2 + 1; i++) {
                            this.afterImages.push(new AfterImage(new Vector(this.pt.x, this.pt.y + i * this.msY/2), this.w, this.h, Number(!alive), this.lastDrawDir, this.animation, 50 * i/2));
                        }
                        this.moveDown(this.msY * this.teleportSpeed);
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
                for (var i = 0; i < buildings.length; i++) {
                    if (this.hb.checkCollide(buildings[i].hb)) {
                        if (lastDir == "w") this.moveDown(buildings[i].pt.y + buildings[i].h - this.pt.y);
                        else if (lastDir == "s") this.moveUp(this.pt.y - buildings[i].pt.y + this.h);
                        else if (lastDir == "a") this.pt.x += buildings[i].pt.x + buildings[i].w - this.pt.x;
                        else if (lastDir == "d") this.pt.x -= this.pt.x - buildings[i].pt.x + this.w;
                    }
                }
                qAbility.use();
            }
            if (eDown && eAbility.timer > eAbility.wait) { // laser ability
                let startPos = new Vector(this.pt.x + (this.w/2), this.pt.y + (this.h/2));
                lasers.push(new Laser(startPos, lastDir, 60));
                eAbility.use();
            }
            if (rDown && rAbility.timer > rAbility.wait) { // laser grenade ability
                let dirs = ["w", "a", "s", "d", "sd", "wd", "sa", "wa"];
                for (var i = 0; i < dirs.length; i++) {
                    var startPos = new Vector(this.pt.x + (this.w/2), this.pt.y + (this.h/2));
                    lasers.push(new Laser(startPos, dirs[i], 120));
                }
                rAbility.use();
            }
        }
    }
    draw() {
        for (var i = 0; i < this.afterImages.length; i++) {
            this.afterImages[i].draw();
        }
        if (alive) {
            let dirs = ["s", "w", "d", "a"];
            let dir = dirs.indexOf(lastDir);
            this.lastDrawDir = dir;
        }
        context.drawImage(texPlayer, posSourceAnimation[Number(!alive)][this.lastDrawDir][this.animation][0], posSourceAnimation[Number(!alive)][this.lastDrawDir][this.animation][1], 10, 11, this.pt.x, this.pt.y, this.w, this.h);
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
            context.drawImage(texPlayer, posSourceAnimation[this.a][this.b][this.c][0], posSourceAnimation[this.a][this.b][this.c][1], 10, 11, this.pt.x, this.pt.y, this.w, this.h);
            context.globalAlpha = 1;
            this.frames--;
        }
    }
}

class Car extends Thing {
    constructor(y, ms) {
        let w = carWidth;
        let type = getRandomInt(1, 8) == 1 ? 1 : 0;
        if (type == 1) w *= 1.3;
        let h = carHeight;

        let badX = true;
        while (badX) {
            badX = false;
            var x = getRandomInt(0, canvas.width - w);
            let tempHB = new HitBox(new Vector(x - 10, y), w + 20, h);
            for (var i = 0; i < buildings.length; i++) {
                if (tempHB.checkCollide(buildings[i].hb)) {
                    badX = true;
                }
            }
        }
        let pt = new Vector(x, y);

        super(pt, w, h);
        this.ms = ms;
        if (type == 1) this.ms *= 1.3; 
        this.stun = 0;
        this.offScreen = false;
        this.deathMessage = "Road Kill";
        this.deathSound = document.createElement("audio");
        this.deathSound.src = "thunk.mp3";
        this.animation = getRandomInt(0, 2);
        this.frame = 0;
        this.type = type;
    }
    update() {
        this.stun--;
        if (this.stun <= 0) {
            this.on();
            this.stun = 0;
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
            let y = this.pt.y - (1.5 * carHeight) * 10;
            cars.push(new Car(y, this.ms * 1.01)); // always spawn new car
            if (getRandomInt(1, 15) * Math.pow(1.0001, score) >= 14) { // spawn ufo scale on score
                ufos.push(new Ufo(y));
            }
            if (Math.random() < buildingBlockCount/10 && !justPlaced) {
                buildings.push(new Building(y - (1.5 * carHeight) * 2));
                justPlaced = true;
            }
            else {
                justPlaced = false;
            }
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
}

class Ufo extends Thing {
    constructor(y) {
        let w = ufoWidth;
        let h = ufoHeight;

        let pt = new Vector(getRandomInt(0, canvas.width - w), y);

        super(pt, w, h);
        this.ms = score/5000 * (canvas.width * canvas.width + canvas.height * canvas.height)/(800 * 800) + 1;
        
        if (getRandomInt(1, 3) == 1) {
            this.move = new Vector(player.pt.x + player.w/2 - this.pt.x + this.w/2, player.pt.y + player.h/2 - this.pt.y + this.h/2); // punish player for not moving
        }
        else {
            this.move = new Vector(getRandomInt(-12, 12), getRandomInt(3, 5));
        }
        this.move.scale(this.ms);
        this.stun = 0;
        this.deathMessage = "Abducted";
        this.deathSound = document.createElement("audio");
        this.deathSound.src = "ufoSound.mp3";
        this.animation = getRandomInt(0, 2);
        this.frame = 0;
    }
    update() {
        this.stun--;
        if (this.stun <= 0) {
            this.on();
            this.stun = 0;
        }
        if (this.active) {
            this.frame++;
            this.pt.apply(this.move);
            var animationWait = Math.abs(parseInt(30/((this.ms/1.5))));
            animationWait = animationWait > 0 ? animationWait : 30;
            if (this.frame % animationWait == 0) {
                this.animation = Number(!this.animation);
            }
        }
        this.updateHB();
        if (this.hb.outOfBounds()) {
            this.move.x *= -1;
        }
    }
    draw() {
        context.drawImage(texUfo, posSourceUfo[Number(!this.active)][this.animation][0], posSourceUfo[Number(!this.active)][this.animation][1], 20, 19, this.pt.x, this.pt.y, this.w, this.h);
    }
    updateHB() {
        this.hb = new HitBox(new Vector(this.pt.x + this.w * 1/5, this.pt.y + this.h * 1/10), this.w * 3/5, this.h * 4/5);
    }
}

class Block extends Thing {
    constructor(pt, i, w, h) {
        super(pt, w, h);
        this.animation = i % 2;
    }
    draw() {
        context.drawImage(texBar, posSourceBar[this.animation][0], posSourceBar[this.animation][1], 14, 11, this.pt.x, this.pt.y, this.w, this.h);
    }
    update() {
        if (this.pt.y < -this.h) {
            this.pt.y = this.pt.y + (this.h * canvas.height/barHeight);
        }
        if (this.pt.y > canvas.height) {
            this.pt.y = this.pt.y - (this.h * canvas.height/barHeight);
        }
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
            for (var i = 0; i < cars.length; i++) {
                if (tempHB.checkCollide(cars[i].hb)) {
                    badX = true;
                }
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
}