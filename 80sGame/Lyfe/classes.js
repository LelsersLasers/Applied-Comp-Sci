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
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.apply = function (vOther) {
        this.x += vOther.x;
        this.y += vOther.y;
    };
    Vector.prototype.add = function (vOther) {
        return new Vector(this.x + vOther.x, this.y + vOther.y);
    };
    Vector.prototype.subtract = function (vOther) {
        return new Vector(this.x - vOther.x, this.y - vOther.y);
    };
    Vector.prototype.scale = function (len) {
        var currentLen = this.calcLen();
        this.x = this.x * (len / currentLen);
        this.y = this.y * (len / currentLen);
    };
    Vector.prototype.scalar = function (s) {
        this.x *= s;
        this.y *= s;
    };
    Vector.prototype.calcLen = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    return Vector;
}());
var HitBox = /** @class */ (function () {
    function HitBox(pt, w, h) {
        this.pt = pt;
        this.w = w;
        this.h = h;
    }
    HitBox.prototype.checkCollide = function (boxOther) {
        return (this.pt.x < boxOther.pt.x + boxOther.w && boxOther.pt.x < this.pt.x + this.w
            && this.pt.y < boxOther.pt.y + boxOther.h && boxOther.pt.y < this.pt.y + this.h);
    };
    HitBox.prototype.outOfBounds = function () {
        return (this.pt.x < 0 || this.pt.x + this.w > canvas.width);
    };
    HitBox.prototype.draw = function (color) {
        context.strokeStyle = color;
        context.strokeRect(this.pt.x, this.pt.y, this.w, this.h);
    };
    HitBox.prototype.calcCenter = function () {
        return new Vector(this.pt.x + this.w / 2, this.pt.y + this.h / 2);
    };
    return HitBox;
}());
var Thing = /** @class */ (function (_super) {
    __extends(Thing, _super);
    function Thing(pt, w, h) {
        var _this = _super.call(this, pt, w, h) || this;
        _this.active = true;
        return _this;
    }
    Thing.prototype.draw = function (color) {
        context.fillStyle = color;
        context.fillRect(this.pt.x, this.pt.y, this.w, this.h);
    };
    return Thing;
}(HitBox));
var Drawable = /** @class */ (function (_super) {
    __extends(Drawable, _super);
    function Drawable(pt, w, h, name, color) {
        var _this = _super.call(this, pt, w, h) || this;
        _this.name = name;
        _this.color = color;
        return _this;
    }
    Drawable.prototype.draw = function () {
        _super.prototype.draw.call(this, this.color);
    };
    return Drawable;
}(Thing));
var Moveable = /** @class */ (function (_super) {
    __extends(Moveable, _super);
    function Moveable(pt, w, h, name, color, ms, hp, damage) {
        var _this = _super.call(this, pt, w, h, name, color) || this;
        _this.frame = 0;
        _this.ms = ms;
        _this.hp = hp;
        _this.damage = damage;
        return _this;
    }
    Moveable.prototype.updateFrame = function () { this.frame += delta; };
    Moveable.prototype.checkFrame = function (interval) {
        var str = frame.toFixed(0);
        var rounded = Number(str);
        if (rounded % interval == 0) {
            this.frame++;
            return true;
        }
        return false;
    };
    Moveable.prototype.checkAttack = function (target) {
        if (this.checkCollide(target)) {
            if (this.checkFrame(30)) {
                target.hp -= this.damage * delta;
            }
            return true;
        }
        return false;
    };
    return Moveable;
}(Drawable));
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(pt, w, h, color, ms, hp, damage) {
        return _super.call(this, pt, w, h, "Player", color, ms, hp, damage) || this;
    }
    Player.prototype.move = function () {
        if (wDown) {
            this.pt.y -= this.ms * delta;
        }
        else if (sDown) {
            this.pt.y += this.ms * delta;
        }
        else if (dDown) {
            this.pt.x += this.ms * delta;
        }
        else if (aDown) {
            this.pt.x -= this.ms * delta;
        }
    };
    return Player;
}(Moveable));
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy(target, pt, w, h, color, ms, hp, damage) {
        var _this = _super.call(this, pt, w, h, "Enemy", color, ms, hp, damage) || this;
        _this.target = target;
        return _this;
    }
    Enemy.prototype.update = function () {
        this.updateFrame();
        var dif = this.calcCenter().subtract(this.target.calcCenter());
        if (dif.calcLen() > 0) {
            if (Math.abs(dif.x) > Math.abs(dif.y)) {
                this.pt.x -= dif.x / Math.abs(dif.x) * this.ms;
            }
            else {
                this.pt.y -= dif.y / Math.abs(dif.y) * this.ms;
            }
        }
        this.checkAttack(this.target);
    };
    return Enemy;
}(Moveable));
