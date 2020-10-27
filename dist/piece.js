"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Piece = void 0;
var GameLang;
(function (GameLang) {
    GameLang["ja"] = "ja";
    GameLang["en"] = "en";
})(GameLang || (GameLang = {}));
var PlayerSide;
(function (PlayerSide) {
    PlayerSide["black"] = "b";
    PlayerSide["white"] = "w";
})(PlayerSide || (PlayerSide = {}));
var Piece = /** @class */ (function () {
    function Piece(id, kind, side, address, name, point, move, lang) {
        this.id = id;
        this.kind = kind;
        this.side = side;
        this.address = address;
        this.name = name;
        this.point = point;
        this.isPromoted = false;
        this.move = move;
        this.lang = lang;
    }
    Piece.prototype.promote = function () {
        this.isPromoted = true;
    };
    Object.defineProperty(Piece.prototype, "shortName", {
        get: function () {
            return this.isPromoted ? this.name.promoted.short[this.lang] : this.name.normal.short[this.lang];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Piece.prototype, "fullName", {
        get: function () {
            return this.isPromoted ? this.name.promoted.full[this.lang] : this.name.normal.full[this.lang];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Piece.prototype, "moves", {
        get: function () {
            return this.isPromoted ? this.move.promoted : this.move.normal;
        },
        enumerable: false,
        configurable: true
    });
    Piece.prototype.setAddress = function (address) {
        this.address = address;
    };
    Piece.prototype.taken = function () {
        this.address = undefined;
        this.side = this.side === PlayerSide.black ? PlayerSide.white : PlayerSide.black;
    };
    Piece.isFuncutionalMoveDimension = function (move) {
        return typeof move === 'string' && move.includes('n');
    };
    return Piece;
}());
exports.Piece = Piece;
