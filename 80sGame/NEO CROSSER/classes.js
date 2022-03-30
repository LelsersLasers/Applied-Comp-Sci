var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.apply = function (vOther) {
        this.x += vOther.x;
        this.y += vOther.y;
    };
    Vector.prototype.scale = function (len) {
        var currentLen = Math.sqrt(this.x * this.x + this.y * this.y);
        this.x = this.x * (len / currentLen);
        this.y = this.y * (len / currentLen);
    };
    Vector.prototype.scalar = function (s) {
        this.x *= s;
        this.y *= s;
    };
    Vector.prototype.restore = function (save) {
        this.x = save.x;
        this.y = save.y;
    };
    return Vector;
}());
var HitBox = /** @class */ (function () {
    function HitBox(pt, w, h) {
        this.pt = pt;
        this.w = w;
        this.h = h;
    }
    HitBox.prototype.getHB = function () {
        return new HitBox(new Vector(this.pt.x, this.pt.y), this.w, this.h);
    };
    HitBox.prototype.getSmallHB = function () {
        return this.getHB();
    };
    HitBox.prototype.checkCollide = function (boxOther, smallHB) {
        if (smallHB === void 0) { smallHB = false; }
        var thisHB = smallHB ? this.getSmallHB() : this.getHB();
        var otherHB = smallHB ? boxOther.getSmallHB() : boxOther.getHB();
        return (thisHB.pt.x < otherHB.pt.x + otherHB.w
            && otherHB.pt.x < thisHB.pt.x + thisHB.w
            && thisHB.pt.y < otherHB.pt.y + otherHB.h
            && otherHB.pt.y < thisHB.pt.y + thisHB.h);
    };
    HitBox.prototype.outOfBounds = function () {
        return (this.pt.x < 0 || this.pt.x + this.w > canvas.width);
    };
    HitBox.prototype.drawOutline = function (color, smallHB) {
        if (smallHB === void 0) { smallHB = false; }
        var thisHB = this.getHB();
        context.strokeStyle = color;
        context.strokeRect(thisHB.pt.x, thisHB.pt.y, thisHB.w, thisHB.h);
        if (smallHB) {
            thisHB = this.getSmallHB();
            context.strokeRect(thisHB.pt.x, thisHB.pt.y, thisHB.w, thisHB.h);
        }
    };
    HitBox.prototype.restore = function (save) {
        this.pt.restore(save.pt);
        this.w = save.w;
        this.h = save.h;
    };
    return HitBox;
}());
var Thing = /** @class */ (function (_super) {
    __extends(Thing, _super);
    function Thing(pt, w, h) {
        var _this = _super.call(this, pt, w, h) || this;
        _this.active = true;
        _this.pt = pt;
        _this.w = w;
        _this.h = h;
        return _this;
    }
    Thing.prototype.restore = function (save) {
        _super.prototype.restore.call(this, save);
        this.active = save.active;
    };
    return Thing;
}(HitBox));
var Trigger = /** @class */ (function (_super) {
    __extends(Trigger, _super);
    function Trigger(pt, w, h, txt) {
        var _this = _super.call(this, pt, w, h) || this;
        _this.down = false;
        _this.color = "#5e94d1";
        _this.color2 = "#9ee092";
        _this.txt = txt;
        return _this;
    }
    Trigger.prototype.draw = function (keyDown) {
        context.fillStyle = this.down || keyDown ? this.color : this.color2;
        context.beginPath();
        context.fillRect(this.pt.x, this.pt.y, this.w, this.h);
        this.drawTxt();
    };
    Trigger.prototype.drawTxt = function () {
        context.fillStyle = "#ffffff";
        context.font = carHeight / 3 + "px " + font;
        context.fillText(this.txt, this.pt.x + this.w / 2, this.pt.y + this.h / 2);
    };
    return Trigger;
}(Thing));
var Ability = /** @class */ (function (_super) {
    __extends(Ability, _super);
    function Ability(pt, w, h, wait, txt, sound) {
        var _this = _super.call(this, pt, w, h, txt) || this;
        _this.backgroundColor = "#dadfe6";
        _this.canUseColor = "#9ee092";
        _this.rechargingColor = "#5e94d1";
        _this.recharge = 1;
        _this.timer = wait;
        _this.wait = wait;
        _this.sound = sound;
        return _this;
    }
    Ability.prototype.draw = function () {
        context.fillStyle = this.backgroundColor;
        context.fillRect(this.pt.x, this.pt.y, this.w, this.h);
        var delay = this.wait - this.timer >= 0 ? this.wait - this.timer : 0;
        var width = (this.wait - delay) * this.w / this.wait;
        context.fillStyle = delay == 0 ? this.canUseColor : this.rechargingColor;
        context.fillRect(this.pt.x, this.pt.y, width, this.h);
        this.drawTxt();
        if (!paused && this.timer < this.wait)
            this.timer += delta * this.recharge;
    };
    Ability.prototype.use = function () {
        this.timer = 0;
        this.sound.currentTime = 0;
        this.sound.play();
    };
    Ability.prototype.canUse = function (keyDown) {
        return this.timer >= this.wait && keyDown;
    };
    Ability.prototype.restore = function (save) {
        this.wait = save.wait;
        this.timer = save.timer;
        this.recharge = save.recharge;
    };
    return Ability;
}(Trigger));
var Buff = /** @class */ (function (_super) {
    __extends(Buff, _super);
    function Buff(pt, w, h, wait, drain, txt, sound) {
        var _this = _super.call(this, pt, w, h, wait, txt, sound) || this;
        _this.doubleClickProtection = 0;
        _this.drain = drain;
        _this.active = false;
        return _this;
    }
    Buff.prototype.draw = function () {
        if (this.active)
            this.rechargingColor = "#e37e7b";
        else
            this.rechargingColor = "#5e94d1";
        _super.prototype.draw.call(this);
        if (this.timer <= 0)
            this.active = false;
        if (this.active && !paused)
            this.timer -= this.drain * delta;
        this.doubleClickProtection -= delta;
    };
    Buff.prototype.use = function () {
        if (this.doubleClickProtection <= 0) {
            if (this.active)
                this.active = false;
            else if (this.timer >= this.drain) {
                this.active = true;
                this.sound.currentTime = 0;
                this.sound.play();
            }
            this.doubleClickProtection = 20;
        }
    };
    Buff.prototype.restore = function (save) {
        _super.prototype.restore.call(this, save);
        this.active = save.active;
    };
    return Buff;
}(Ability));
var GameTxt = /** @class */ (function (_super) {
    __extends(GameTxt, _super);
    function GameTxt(pt, color, w, h, txt) {
        var _this = _super.call(this, pt, w, h) || this;
        _this.color = color;
        _this.txt = txt;
        return _this;
    }
    GameTxt.prototype.draw = function () {
        context.fillStyle = this.color;
        context.fillRect(this.pt.x, this.pt.y, this.w, this.h);
        context.fillStyle = "#ffffff";
        context.font = carHeight / 4.5 + "px " + font;
        context.fillText(this.txt, this.pt.x + this.w / 2, this.pt.y + this.h / 2);
    };
    GameTxt.prototype.setTxt = function (txt) {
        context.font = carHeight / 4.5 + "px " + font;
        this.txt = txt;
        this.w = context.measureText(this.txt).width * 1.3;
    };
    return GameTxt;
}(Thing));
var Laser = /** @class */ (function (_super) {
    __extends(Laser, _super);
    function Laser(pt, angle, stunTime, friendly) {
        var _this = this;
        var ms = laserSpeed;
        var moveVector = new Vector(Math.sin(degToRad(angle)) * ms, Math.cos(degToRad(angle)) * ms);
        moveVector.scalar(delta);
        _this = _super.call(this, pt, ms, ms) || this;
        _this.friendly = friendly;
        _this.color = friendly ? "#03b1fc" : "#ff0055";
        _this.stunTime = stunTime;
        _this.ms = ms;
        _this.angle = angle;
        _this.moveVector = moveVector;
        return _this;
    }
    Laser.prototype.update = function () {
        this.pt.apply(this.moveVector);
        if (this.pt.x < -this.ms || this.pt.x > canvas.width + this.ms || (this.pt.y > cars[0].pt.y && this.pt.y > canvas.height) || this.pt.y < -carHeight) {
            lasers.splice(lasers.indexOf(this), 1);
        }
        var enemies = this.friendly ? __spreadArray(__spreadArray([], cars, true), ufos, true) : [player];
        for (var i in enemies) {
            if (this.checkCollide(enemies[i], !this.friendly)) {
                enemies[i].active = false;
                enemies[i].stun += this.stunTime;
                playFromSoundArray(laserSounds);
                lasers.splice(lasers.indexOf(this), 1);
                break;
            }
        }
        for (var i in buildings) {
            if (this.checkCollide(buildings[i])) {
                lasers.splice(lasers.indexOf(this), 1);
                break;
            }
        }
        this.draw();
    };
    Laser.prototype.draw = function () {
        context.strokeStyle = this.color;
        context.lineWidth = this.ms * 1.5;
        context.beginPath();
        context.moveTo(this.pt.x + this.w / 2, this.pt.y + this.h / 2);
        context.lineTo(this.pt.x + this.w / 2 - this.moveVector.x * 3 * 1 / delta, this.pt.y + this.h / 2 - this.moveVector.y * 3 * 1 / delta);
        context.stroke();
        context.lineWidth = 3;
    };
    Laser.prototype.restore = function (save) {
        _super.prototype.restore.call(this, save);
        this.stunTime = save.stunTime;
        this.ms = save.ms;
        this.angle = save.angle;
        this.moveVector.x = save.moveVector.x;
        this.moveVector.y = save.moveVector.y;
        this.friendly = save.friendly;
        this.color = save.color;
    };
    return Laser;
}(Thing));
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, new Vector(canvas.width / 2 - carHeight / 2, playerLevel), carHeight * 10 / 11, carHeight) || this;
        _this.msX = canvas.width / 14;
        _this.msY = 1.5 * canvas.height / 14;
        _this.msXIncrease = _this.msX / 20;
        _this.msYIncrease = _this.msY / 20;
        _this.teleportSpeed = 3;
        _this.sprintSpeed = 1.5;
        _this.animation = 0;
        _this.frame = 0;
        _this.lastDir = "s";
        _this.lastDrawDir = 0;
        _this.afterImages = [];
        _this.stun = 0;
        _this.lastStun = 0;
        _this.stunProtection = 0;
        _this.spawnProtection = 60 / 5;
        return _this;
    }
    Player.prototype.getHB = function () {
        return new HitBox(new Vector(this.pt.x + this.w / 5, this.pt.y), this.w * 3 / 5, this.h);
    };
    Player.prototype.moveVertical = function (ms) {
        var obstacles = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], pickUps, true), landSlides, true), cars, true), buildings, true), lasers, true), bar, true), this.afterImages, true), ufos, true);
        for (var i in obstacles)
            obstacles[i].pt.y += ms * (eAbility.active ? this.sprintSpeed : 1);
        for (var i in pickUps)
            pickUps[i].minY += ms * (eAbility.active ? this.sprintSpeed : 1);
        for (var i in bar)
            bar[i].update();
        score += ms * moveWait / this.msY;
        if (score > topScore)
            topScore = Number(score.toFixed(0));
    };
    Player.prototype.updateStun = function () {
        if (this.stun > this.lastStun && this.stunProtection <= 0) {
            this.stunProtection = this.stun * 2;
        }
        else if (this.stun > this.lastStun) {
            this.stun = 0;
        }
        this.stunProtection -= delta;
        this.stun -= delta;
        if (this.stun <= 0) {
            this.active = true;
            this.stun = 0;
        }
        this.lastStun = this.stun;
    };
    Player.prototype.updateAnimation = function () {
        var animationWait = eAbility.active ? 6 : 8;
        if (checkFrame(this.frame, animationWait) && alive) {
            this.animation++;
            this.frame++; // so if player stops on a % = 0, it doesn't freak out
            if (this.animation > 3)
                this.animation = 0;
        }
    };
    Player.prototype.setLastDir = function () {
        if (wDown)
            this.lastDir = "w";
        else if (sDown)
            this.lastDir = "s";
        else if (aDown)
            this.lastDir = "a";
        else if (dDown)
            this.lastDir = "d";
    };
    Player.prototype.checkAbilites = function () {
        if (qAbility.canUse(qDown)) { // teleport ability
            switch (this.lastDir) {
                case "w":
                    for (var i = 0; i < this.teleportSpeed * 2 + 1; i++) {
                        this.afterImages.push(new AfterImage(new Vector(this.pt.x, this.pt.y - i * this.msY / 2), this.w, this.h, Number(!alive), this.lastDrawDir, this.animation, 50 * i / 2));
                    }
                    this.moveVertical(this.msY * this.teleportSpeed);
                    break;
                case "s":
                    for (var i = 0; i < this.teleportSpeed * 2 + 1; i++) {
                        this.afterImages.push(new AfterImage(new Vector(this.pt.x, this.pt.y + i * this.msY / 2), this.w, this.h, Number(!alive), this.lastDrawDir, this.animation, 50 * i / 2));
                    }
                    this.moveVertical(-this.msY * this.teleportSpeed);
                    break;
                case "a":
                    for (var i = 0; i < this.teleportSpeed * 2 + 1; i++) {
                        this.afterImages.push(new AfterImage(new Vector(this.pt.x - i * this.msX / 2, this.pt.y), this.w, this.h, Number(!alive), this.lastDrawDir, this.animation, 50 * i / 2));
                    }
                    this.pt.x -= this.msX * this.teleportSpeed;
                    break;
                case "d":
                    for (var i = 0; i < this.teleportSpeed * 2 + 1; i++) {
                        this.afterImages.push(new AfterImage(new Vector(this.pt.x + i * this.msX / 2, this.pt.y), this.w, this.h, Number(!alive), this.lastDrawDir, this.animation, 50 * i / 2));
                    }
                    this.pt.x += this.msX * this.teleportSpeed;
                    break;
            }
            for (var i in buildings) {
                if (this.checkCollide(buildings[i], true)) {
                    if (this.lastDir == "w")
                        this.moveVertical(-(buildings[i].pt.y + buildings[i].h - this.pt.y));
                    else if (this.lastDir == "s")
                        this.moveVertical(this.pt.y - buildings[i].pt.y + this.h);
                    else if (this.lastDir == "a")
                        this.pt.x += buildings[i].pt.x + buildings[i].w - this.pt.x;
                    else if (this.lastDir == "d")
                        this.pt.x -= this.pt.x - buildings[i].pt.x + this.w;
                    break;
                }
            }
            qAbility.use();
        }
        if (eDown) { // sprint ability
            eAbility.use();
        }
        if (rAbility.canUse(rDown)) { // laser ability
            for (var i = 0; i < 8; i++) {
                var startPos = new Vector(this.pt.x + (this.w / 2), this.pt.y + (this.h / 2));
                lasers.push(new Laser(startPos, i * 45, 120, true));
            }
            rAbility.use();
        }
    };
    Player.prototype.move = function () {
        this.setLastDir();
        this.updateStun();
        this.spawnProtection -= delta * 0.2;
        if (alive && this.active) {
            if (wDown || sDown || aDown || dDown) {
                this.frame += delta;
                switch (this.lastDir) {
                    case "w":
                        this.moveVertical(this.msY / moveWait * delta);
                        break;
                    case "s":
                        this.moveVertical(-this.msY / moveWait * delta);
                        break;
                    case "a":
                        this.pt.x -= this.msX / moveWait * (eAbility.active ? this.sprintSpeed : 1) * delta;
                        break;
                    case "d":
                        this.pt.x += this.msX / moveWait * (eAbility.active ? this.sprintSpeed : 1) * delta;
                        break;
                }
                for (var i in buildings) {
                    if (this.checkCollide(buildings[i], true)) { // if it is touching, undo the last movement
                        if (this.lastDir == "a")
                            this.pt.x += this.msX / moveWait * (eAbility.active ? this.sprintSpeed : 1) * delta;
                        else if (this.lastDir == "d")
                            this.pt.x -= this.msX / moveWait * (eAbility.active ? this.sprintSpeed : 1) * delta;
                        else if (this.lastDir == "w")
                            this.moveVertical(-this.msY / moveWait * delta);
                        else if (this.lastDir == "s")
                            this.moveVertical(this.msY / moveWait * delta);
                        break;
                    }
                }
            }
            this.updateAnimation();
            this.checkAbilites();
        }
        if (this.pt.x < 0)
            this.pt.x = 0;
        else if (this.pt.x + this.w > canvas.width)
            this.pt.x = canvas.width - this.w;
    };
    Player.prototype.checkDeath = function (enemy) {
        if (enemy.checkCollide(player, true)) {
            if (this.spawnProtection < 0) {
                deathHitSound.currentTime = 0;
                deathHitSound.play();
                this.stunProtection = this.spawnProtection = 120 * 0.2;
                this.stun = this.lastStun = 0;
                lives--;
                if (lives <= 0) {
                    livesView.color = "#e37e7b";
                    alive = false;
                    player.active = false;
                }
            }
        }
    };
    Player.prototype.draw = function () {
        for (var i in this.afterImages)
            this.afterImages[i].draw();
        if (alive && !paused && this.active) {
            var dirs = ["s", "w", "d", "a"];
            var dir = dirs.indexOf(this.lastDir);
            this.lastDrawDir = dir;
        }
        if (this.spawnProtection <= 0 || !checkFrame(this.spawnProtection, 2) || !alive) {
            context.drawImage(texPlayer, texSrcPlayer[Number(!alive)][Number(!this.active)][this.lastDrawDir][this.animation][0], texSrcPlayer[Number(!alive)][Number(!this.active)][this.lastDrawDir][this.animation][1], 10, 11, this.pt.x, this.pt.y, this.w, this.h);
        }
    };
    Player.prototype.restore = function (save) {
        _super.prototype.restore.call(this, save);
        this.afterImages = [];
        this.animation = save.animation;
        this.frame = save.frame;
        this.lastDrawDir = save.lastDrawDir;
        this.msX = save.msX;
        this.msY = save.msY;
        this.msXIncrease = save.msXIncrease;
        this.msYIncrease = save.msYIncrease;
        this.spawnProtection = save.spawnProtection;
        this.stunProtection = save.stunProtection;
        this.stun = save.stun;
        this.lastStun = save.lastStun;
    };
    return Player;
}(Thing));
var AfterImage = /** @class */ (function (_super) {
    __extends(AfterImage, _super);
    function AfterImage(pt, w, h, a, b, c, frames) {
        var _this = _super.call(this, pt, w, h) || this;
        _this.a = a;
        _this.b = b;
        _this.c = c;
        _this.frames = frames;
        return _this;
    }
    AfterImage.prototype.draw = function () {
        if (this.frames > 0) {
            context.globalAlpha = this.frames / 300 * 0.6;
            context.drawImage(texPlayer, texSrcPlayer[this.a][0][this.b][this.c][0], texSrcPlayer[this.a][0][this.b][this.c][1], 10, 11, this.pt.x, this.pt.y, this.w, this.h);
            context.globalAlpha = 1;
            if (!paused)
                this.frames -= delta;
        }
        else
            player.afterImages.splice(player.afterImages.indexOf(this), 1);
    };
    return AfterImage;
}(Thing));
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy(pt, w, h, ms) {
        var _this = _super.call(this, pt, w, h) || this;
        _this.frame = 0;
        _this.stun = 0;
        _this.animation = getRandomInt(0, 2);
        _this.animationWaitBase = 30;
        _this.canShoot = false;
        _this.ms = ms;
        return _this;
    }
    Enemy.prototype.updateStun = function () {
        this.stun -= delta;
        if (this.stun <= 0) {
            this.active = true;
            this.stun = 0;
        }
    };
    Enemy.prototype.updateAnimation = function () {
        if (this.active) {
            this.frame += delta;
            var animationWait = this.getAnimationWait();
            animationWait = animationWait > 0 ? animationWait : this.animationWaitBase;
            if (checkFrame(this.frame, animationWait)) {
                this.animation = Number(!this.animation);
                this.frame++;
            }
        }
    };
    Enemy.prototype.getAnimationWait = function () {
        return Math.abs(Number((this.animationWaitBase / this.ms).toFixed(0)));
    };
    Enemy.prototype.updateCanShoot = function (speciality, laserDist) {
        var dist = Math.sqrt((this.pt.x - player.pt.x) * (this.pt.x - player.pt.x) + (this.pt.y - player.pt.y) * (this.pt.y - player.pt.y));
        this.canShoot = speciality && dist < laserSpeed * laserDist && this.active && alive;
        if (this.canShoot)
            this.canShoot = this.hasLOS();
    };
    Enemy.prototype.checkShoot = function (startPt) {
        if (this.canShoot) {
            var animationWait = this.getAnimationWait() * 10;
            animationWait = animationWait > 0 ? animationWait : this.animationWaitBase * 4;
            if (checkFrame(this.frame - 1, animationWait)) {
                lasers.push(new Laser(startPt, -1, 60, false));
                lasers[lasers.length - 1].moveVector = new Vector(player.pt.x + player.w / 2 - startPt.x, player.pt.y + player.h / 2 - startPt.y);
                lasers[lasers.length - 1].moveVector.scale(lasers[lasers.length - 1].ms);
                playFromSoundArray(laserTargetingSounds);
            }
        }
    };
    Enemy.prototype.hasLOS = function () {
        var checkObstructed = new Vector(player.pt.x + player.w / 2 - this.pt.x - this.w / 2, player.pt.y + player.h / 2 - this.pt.y - this.h / 2);
        checkObstructed.scale(laserSpeed * 4);
        var tempHB = new HitBox(new Vector(this.pt.x + this.w / 2, this.pt.y + this.h / 2), 1, 1);
        while (!tempHB.outOfBounds()) {
            tempHB.pt.apply(checkObstructed);
            if (tempHB.checkCollide(player, true))
                return true;
            for (var i in buildings) {
                if (tempHB.checkCollide(buildings[i], true))
                    return false;
            }
        }
        return true;
    };
    Enemy.prototype.drawTarget = function (startPt) {
        if (this.canShoot) {
            context.strokeStyle = "#03b1fc";
            context.beginPath();
            context.moveTo(startPt.x, startPt.y);
            context.lineTo(player.pt.x + player.w / 2, player.pt.y + player.h / 2);
            context.stroke();
            context.fillStyle = "#ff0055";
            context.fillRect(player.pt.x + player.w * 2 / 5, player.pt.y + player.h * 2 / 5, player.w * 1 / 5, player.h * 1 / 5);
        }
    };
    Enemy.prototype.restore = function (save) {
        _super.prototype.restore.call(this, save);
        this.stun = save.stun;
        this.ms = save.ms;
        this.frame = save.frame;
        this.animation = save.animation;
        this.animationWaitBase = save.animationWaitBase;
        this.canShoot = save.canShoot;
    };
    return Enemy;
}(Thing));
var Car = /** @class */ (function (_super) {
    __extends(Car, _super);
    function Car(y, ms, msIncrease) {
        var _this = this;
        var rand = Math.random();
        var type = 0;
        var tankChance = topScore < softCap * 3 / 4 ? 0 : 1 / 10;
        if (rand < tankChance)
            type = 2;
        else if (rand - tankChance < 1 / 7)
            type = 1;
        var w = carWidth;
        if (type == 1)
            w *= 7 / 5;
        else if (type == 2)
            w *= 9 / 10;
        var h = carHeight;
        var badX = true;
        while (badX) {
            badX = false;
            var x = getRandomInt(0, canvas.width - w);
            var tempHB = new HitBox(new Vector(x - 10, y), w + 20, h);
            for (var i in buildings) {
                if (tempHB.checkCollide(buildings[i])) {
                    badX = true;
                    break;
                }
            }
        }
        var pt = new Vector(x, y);
        _this = _super.call(this, pt, w, h, ms) || this;
        _this.offScreen = false;
        _this.hidden = !Boolean(getRandomInt(0, 5));
        if (type == 1)
            _this.ms *= 7 / 5;
        else if (type == 2)
            _this.ms *= 1 / 2;
        _this.offScreen = false;
        _this.type = type;
        _this.msIncrease = msIncrease;
        if (_this.hidden)
            _this.pt.x = -9999;
        return _this;
    }
    Car.prototype.getSmallHB = function () {
        switch (this.type) {
            case 0:
                if (this.ms > 0) {
                    return new HitBox(new Vector(this.pt.x + this.w / 15, this.pt.y + this.h / 15), this.w * 4 / 5, this.h * 4 / 5);
                }
                return new HitBox(new Vector(this.pt.x + this.w * (1 / 5 - 1 / 15), this.pt.y + this.h / 15), this.w * 4 / 5, this.h * 4 / 5);
            case 1:
                return new HitBox(new Vector(this.pt.x + this.w / 10, this.pt.y + this.h / 10), this.w * 4 / 5, this.h * 7 / 10);
            case 2:
                if (this.ms > 0) {
                    return new HitBox(new Vector(this.pt.x + this.w / 10, this.pt.y + this.h / 5), this.w * (3 / 4 - 1 / 10), this.h * 7 / 10);
                }
                return new HitBox(new Vector(this.pt.x + this.w / 4, this.pt.y + this.h / 5), this.w * (3 / 4 - 1 / 10), this.h * 7 / 10);
        }
        return new HitBox(new Vector(this.pt.x + this.w / 5, this.pt.y), this.w * 3 / 5, this.h);
    };
    Car.prototype.update = function () {
        if (!this.hidden) {
            if (this.type == 2)
                this.stun = 0;
            this.updateStun();
            this.updateAnimation();
            if (this.active) {
                this.pt.x += this.ms * delta;
                this.updateCanShoot(this.type == 2, 80);
                this.checkShoot(new Vector(this.ms > 0 ? this.pt.x + this.w : this.pt.x, this.pt.y + this.h * 4 / 17));
                if (this.outOfBounds()) {
                    this.ms *= -1;
                    this.update();
                }
            }
            for (var i in buildings) {
                if (this.checkCollide(buildings[i])) {
                    this.ms *= -1;
                    this.update();
                    break;
                }
            }
        }
        if (this.pt.y > canvas.height && !this.offScreen) {
            var y = this.pt.y - (1.5 * carHeight) * 10;
            var newMs = this.ms + this.msIncrease;
            if (this.type == 1)
                newMs *= 5 / 7;
            else if (this.type == 2)
                newMs *= 2;
            cars.push(new Car(y, newMs, this.msIncrease)); // always spawn new car
            if (Math.random() < ((topScore / (softCap * 4) > 1 / 4 ? 1 / 4 : topScore / (softCap * 3)))) {
                ufos.push(new Ufo(y));
            }
            if (Math.random() < buildingBlockCount / 10 && !justPlaced) {
                buildings.push(new Building(y - (1.5 * carHeight) * 2));
                justPlaced = true;
            }
            else
                justPlaced = false;
            if (Math.random() < 1 / 15 && landSlideWait < 0) {
                landSlides.push(new LandSlide(y + 1.5 * carHeight));
                landSlideWait = 10;
            }
            else
                landSlideWait--;
            if (Math.random() < (topScore % softCap / 3) / (softCap / 3) && topScore >= spawnLife) {
                spawnLife += softCap / 3;
                pickUps.push(new PickUp(y, texLifePickUp, 11, 10, function () { return lives++; }));
            }
            if (Math.random() < 1 / 25) {
                pickUps.push(new PickUp(y, texCooldownPickUp, 9, 12, function () {
                    qAbility.recharge += 0.05;
                    eAbility.recharge += 0.05;
                    rAbility.recharge += 0.05;
                }));
            }
            if (Math.random() < 1 / 25) {
                pickUps.push(new PickUp(y, texSpeedPickUp, 16, 27, function () {
                    player.msX += player.msXIncrease;
                    player.msY += player.msYIncrease;
                }));
            }
            this.offScreen = true;
        }
    };
    Car.prototype.draw = function () {
        if (!this.hidden) {
            var dir = this.ms > 0 ? 0 : 1;
            if (this.type == 1) {
                context.drawImage(texBus, texSrcBus[Number(!this.active)][dir][this.animation][0], texSrcCar[Number(!this.active)][dir][this.animation][1], 40, 17, this.pt.x, this.pt.y, this.w, this.h);
            }
            else if (this.type == 2) {
                context.drawImage(texTank, texSrcTank[Number(this.canShoot)][dir][this.animation][0], texSrcTank[Number(this.canShoot)][dir][this.animation][1], 33, 16, this.pt.x, this.pt.y, this.w, this.h);
                this.drawTarget(new Vector(this.ms > 0 ? this.pt.x + this.w : this.pt.x, this.pt.y + this.h * 4 / 17));
            }
            else {
                context.drawImage(texCar, texSrcCar[Number(!this.active)][dir][this.animation][0], texSrcCar[Number(!this.active)][dir][this.animation][1], 34, 17, this.pt.x, this.pt.y, this.w, this.h);
            }
        }
    };
    Car.prototype.restore = function (save) {
        _super.prototype.restore.call(this, save);
        this.type = save.type;
        this.offScreen = save.offScreen;
        this.msIncrease = save.msIncrease;
        this.hidden = save.hidden;
    };
    return Car;
}(Enemy));
var Ufo = /** @class */ (function (_super) {
    __extends(Ufo, _super);
    function Ufo(y) {
        var _this = this;
        var w = ufoWidth;
        var h = ufoHeight;
        var pt = new Vector(getRandomInt(0, canvas.width - w), y);
        var ms = topScore / softCap * (canvas.width * canvas.width + canvas.height * canvas.height) / (800 * 800) + 1 * delta;
        _this = _super.call(this, pt, w, h, ms) || this;
        _this.animationWaitBase = 25;
        if (getRandomInt(1, 3) == 1) {
            _this.move = new Vector(player.pt.x + player.w / 2 - _this.pt.x - _this.w / 2, player.pt.y + player.h / 2 - _this.pt.y - _this.h / 2); // punish player for not moving
        }
        else {
            _this.move = new Vector(getRandomInt(-12, 12), getRandomInt(3, 5));
        }
        _this.move.scale(_this.ms);
        return _this;
    }
    Ufo.prototype.getHB = function () {
        return new HitBox(new Vector(this.pt.x + this.w / 5, this.pt.y + this.h / 5), this.w * 3 / 5, this.h * 3 / 5);
    };
    Ufo.prototype.update = function () {
        this.updateStun();
        this.updateAnimation();
        if (this.pt.y > cars[0].pt.y && this.pt.y > canvas.height)
            ufos.splice(ufos.indexOf(this), 1);
        else if (this.active) {
            this.pt.apply(this.move);
            if (this.outOfBounds())
                this.move.x *= -1;
            this.updateCanShoot(topScore > softCap, 100);
            this.checkShoot(new Vector(this.pt.x + this.w / 2, this.pt.y + this.h * 8 / 19));
        }
    };
    Ufo.prototype.draw = function () {
        context.drawImage(texUfo, texSrcUfo[Number(!this.active)][Number(this.canShoot)][this.animation][0], texSrcUfo[Number(!this.active)][Number(this.canShoot)][this.animation][1], 20, 19, this.pt.x, this.pt.y, this.w, this.h);
        this.drawTarget(new Vector(this.pt.x + this.w / 2, this.pt.y + this.h * 8 / 19));
    };
    Ufo.prototype.restore = function (save) {
        _super.prototype.restore.call(this, save);
        this.move.x = save.move.x;
        this.move.y = save.move.y;
    };
    return Ufo;
}(Enemy));
var Block = /** @class */ (function (_super) {
    __extends(Block, _super);
    function Block(pt, i, w, h) {
        var _this = _super.call(this, pt, w, h) || this;
        _this.animation = i % 2;
        return _this;
    }
    Block.prototype.draw = function () {
        context.drawImage(texBar, texSrcBar[this.animation][0], texSrcBar[this.animation][1], 14, 11, this.pt.x, this.pt.y, this.w, this.h);
    };
    Block.prototype.update = function () {
        if (this.pt.y < -this.h)
            this.pt.y = this.pt.y + (this.h * canvas.height / barHeight);
        if (this.pt.y > canvas.height)
            this.pt.y = this.pt.y - (this.h * canvas.height / barHeight);
    };
    Block.prototype.restore = function (save) {
        _super.prototype.restore.call(this, save);
        this.animation = save.animation;
    };
    return Block;
}(Thing));
var Building = /** @class */ (function (_super) {
    __extends(Building, _super);
    function Building(y) {
        var _this = this;
        var h = carHeight * 2.5;
        var widthOfOne = (26 * h / 40);
        var maxW = Math.floor((carWidth * 1.5) / widthOfOne);
        var buildingCount = getRandomInt(1, maxW + 1);
        var w = buildingCount * widthOfOne;
        var badX = true;
        while (badX) {
            badX = false;
            var x = getRandomInt(0, canvas.width - w);
            var tempHB = new HitBox(new Vector(x - 10, y), w + 20, h);
            for (var i in cars) {
                if (tempHB.checkCollide(cars[i])) {
                    badX = true;
                    break;
                }
            }
        }
        var pt = new Vector(x, y);
        _this = _super.call(this, pt, w, h) || this;
        _this.buildings = [];
        _this.buildings = [];
        for (var i = 0; i < buildingCount; i++) {
            var src = getRandomInt(0, 3);
            _this.buildings.push(texSrcBuilding[src]);
        }
        _this.widthOfOne = widthOfOne;
        return _this;
    }
    Building.prototype.draw = function () {
        for (var i = 0; i < this.buildings.length; i++) {
            context.drawImage(texBuilding, this.buildings[i][0], this.buildings[i][1], 26, 40, this.pt.x + i * this.widthOfOne, this.pt.y, this.widthOfOne, this.h);
        }
    };
    Building.prototype.restore = function (save) {
        _super.prototype.restore.call(this, save);
        this.buildings = save.buildings;
        this.widthOfOne = save.widthOfOne;
    };
    return Building;
}(Thing));
var ButtonMenu = /** @class */ (function (_super) {
    __extends(ButtonMenu, _super);
    function ButtonMenu(pt, w, h, text, textSize) {
        var _this = _super.call(this, pt, w, h) || this;
        _this.clicked = 0;
        _this.text = text;
        _this.textSize = textSize;
        return _this;
    }
    ButtonMenu.prototype.draw = function () {
        context.font = this.textSize + "px " + font;
        ;
        if (this.clicked > 0) {
            this.drawOutline("#000000");
            context.fillStyle = "#ffffff";
            context.fillRect(this.pt.x, this.pt.y, this.w, this.h);
            context.fillStyle = "#000000";
            context.fillText(this.text, canvas.width / 2, this.pt.y + this.h / 2);
        }
        else {
            this.drawOutline("#ffffff");
            context.fillStyle = "#ffffff";
            context.fillText(this.text, canvas.width / 2, this.pt.y + this.h / 2);
        }
        this.clicked -= delta;
    };
    return ButtonMenu;
}(Thing));
var ButtonExtra = /** @class */ (function (_super) {
    __extends(ButtonExtra, _super);
    function ButtonExtra(w, h) {
        return _super.call(this, new Vector(canvas.width - w, 0), w, h) || this;
    }
    ButtonExtra.prototype.draw = function () {
        context.globalAlpha = 0.8;
        context.drawImage(texPause, texSrcPause[Number(!paused)][0], texSrcPause[Number(!paused)][1], 14, 14, this.pt.x, this.pt.y, this.w, this.h);
        context.globalAlpha = 1;
    };
    return ButtonExtra;
}(Thing));
var LandSlide = /** @class */ (function (_super) {
    __extends(LandSlide, _super);
    function LandSlide(y) {
        var _this = this;
        var w = canvas.width;
        var h = carHeight * 11.5;
        var MSs = [w / 300 * delta, -w / 300 * delta];
        var dir = getRandomInt(0, 2);
        var Xs = [0 - w + MSs[0] * -60, canvas.width + MSs[1] * -60];
        _this = _super.call(this, new Vector(Xs[dir], y), w, h, MSs[dir] * (1 + topScore / softCap)) || this;
        landSlideSound.play();
        _this.dir = dir;
        _this.animationWaitBase = 100;
        notices.push(new Notice(120));
        return _this;
    }
    LandSlide.prototype.update = function () {
        if ((this.dir == 0 && this.pt.x > canvas.width) || (this.dir == 1 && this.pt.x + this.w < 0)) {
            landSlides.splice(landSlides.indexOf(this), 1);
        }
        else {
            this.updateAnimation();
            this.pt.x += this.ms;
            var obstacles = __spreadArray(__spreadArray(__spreadArray([], pickUps, true), cars, true), [player], false);
            for (var i in obstacles) {
                if (this.checkCollide(obstacles[i])) {
                    obstacles[i].pt.x += this.ms / 3;
                    for (var j in buildings) {
                        if (obstacles[i].checkCollide(buildings[j])) {
                            obstacles[i].pt.x = this.ms > 0 ? buildings[j].pt.x - obstacles[i].w : buildings[j].pt.x + buildings[j].w;
                        }
                    }
                    if (obstacles[i].outOfBounds()) {
                        obstacles[i].pt.x = this.ms > 0 ? canvas.width - obstacles[i].w : 0;
                    }
                }
            }
            this.draw();
        }
    };
    LandSlide.prototype.draw = function () {
        context.drawImage(texLandSlide, texSrcLandSlide[Number(!Boolean(this.dir))][this.animation][0], texSrcLandSlide[Number(!Boolean(this.dir))][this.animation][1], 82, 40, this.pt.x, this.pt.y, this.w, this.h);
    };
    return LandSlide;
}(Enemy));
var Notice = /** @class */ (function (_super) {
    __extends(Notice, _super);
    function Notice(frames) {
        var _this = this;
        var w = 1.5 * carWidth;
        _this = _super.call(this, new Vector((canvas.width - w) / 2, (canvas.height - w) / 2), w, w) || this;
        _this.frames = frames;
        return _this;
    }
    Notice.prototype.draw = function () {
        if (this.frames > 0) {
            context.globalAlpha = textOpacity;
            context.drawImage(texWarning, 0, 0, 20, 19, this.pt.x, this.pt.y, this.w, this.h);
            context.font = carHeight / 2 + "px " + font;
            context.fillStyle = "#ffffff";
            context.fillText("Incoming", this.pt.x + this.w / 2, this.pt.y + this.h + carHeight / 2);
            context.globalAlpha = 1;
            if (!paused)
                this.frames -= delta;
        }
        else
            notices.splice(notices.indexOf(this), 1);
    };
    return Notice;
}(Thing));
var PickUp = /** @class */ (function (_super) {
    __extends(PickUp, _super);
    function PickUp(y, tex, srcW, srcH, action) {
        var _this = this;
        var w = carHeight * 3 / 5;
        var h = carHeight * 3 / 5;
        var badX = true;
        while (badX) {
            badX = false;
            var x = getRandomInt(0, canvas.width - w);
            var tempHB = new HitBox(new Vector(x - 10, y), w + 20, h);
            for (var i in buildings) {
                if (tempHB.checkCollide(buildings[i])) {
                    badX = true;
                    break;
                }
            }
        }
        var pt = new Vector(x, y);
        _this = _super.call(this, pt, w, w) || this;
        _this.bounce = delta / 3;
        _this.tex = tex;
        _this.srcW = srcW;
        _this.srcH = srcH;
        _this.action = action;
        _this.minY = y;
        _this.src = tex.src;
        return _this;
    }
    PickUp.prototype.updateBounce = function () {
        this.pt.y += this.bounce;
        if (this.pt.y < this.minY || this.pt.y + this.h > this.minY + this.h * 5 / 3)
            this.bounce *= -1;
    };
    PickUp.prototype.update = function () {
        this.updateBounce();
        if (this.checkCollide(player)) {
            this.action();
            pickUps.splice(pickUps.indexOf(this), 1);
        }
        this.draw();
    };
    PickUp.prototype.draw = function () {
        context.drawImage(this.tex, 0, 0, this.srcW, this.srcH, this.pt.x, this.pt.y, this.w, this.h);
    };
    PickUp.prototype.restore = function (save) {
        _super.prototype.restore.call(this, save);
        this.srcW = save.srcW;
        this.srcH = save.srcH;
        this.tex.src = save.src;
        this.action = save.action;
        this.minY = save.minY;
        this.bounce = save.bounce;
    };
    return PickUp;
}(Thing));
