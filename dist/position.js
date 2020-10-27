"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = void 0;
var yaml = __importStar(require("js-yaml"));
var fs = __importStar(require("fs"));
var piece_1 = require("./piece");
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
var Position = /** @class */ (function () {
    function Position() {
        this.turn = 1;
        this.side = PlayerSide.black;
        var initialPiece = yaml.safeLoad(fs.readFileSync('./config/initialPiece.yaml', 'utf8'));
        var pieceKind = yaml.safeLoad(fs.readFileSync('./config/pieceKind.yaml', 'utf8'));
        this.pieces = initialPiece.map(function (piece, idx) {
            return new piece_1.Piece(idx + 1, piece.kind, piece.side, piece.address, pieceKind[piece.kind].name, pieceKind[piece.kind].point, pieceKind[piece.kind].move, GameLang.ja);
        });
    }
    Position.isAddressInsideBoard = function (address) {
        return address.x >= 1 && address.x <= 9 && address.y >= 1 && address.y <= 9;
    };
    Position.prototype.findPieceById = function (id) {
        return this.pieces.find(function (piece) { return piece.id === id; });
    };
    Position.prototype.findPieceByAddress = function (address) {
        return this.pieces.find(function (piece) {
            return piece.address !== undefined && piece.address.x === address.x && piece.address.y === address.y;
        });
    };
    Position.prototype.getPieceMovableAddresses = function (piece) {
        var _this = this;
        var movableAddress = [];
        piece.moves.forEach(function (move) {
            if (piece_1.Piece.isFuncutionalMoveDimension(move.x) || piece_1.Piece.isFuncutionalMoveDimension(move.y)) {
                for (var i = 1; i < 9; i++) {
                    var moveX = piece_1.Piece.isFuncutionalMoveDimension(move.x) ? parseInt(move.x.replace('n', i.toString())) : move.x;
                    var moveY = piece_1.Piece.isFuncutionalMoveDimension(move.y) ? parseInt(move.y.replace('n', i.toString())) : move.y;
                    moveY = piece.side == PlayerSide.white ? -1 * moveY : moveY;
                    var potentialAddress = {
                        'x': piece.address.x + moveX,
                        'y': piece.address.y + moveY,
                    };
                    var addressPiece = _this.findPieceByAddress(potentialAddress);
                    if (addressPiece || !Position.isAddressInsideBoard(potentialAddress)) {
                        break;
                    }
                    else if (addressPiece && addressPiece.side !== piece.side) {
                        movableAddress.push(potentialAddress);
                        break;
                    }
                    movableAddress.push(potentialAddress);
                }
            }
            else {
                var moveY = piece.side == PlayerSide.white ? -1 * move.y : move.y;
                var potentialAddress = {
                    'x': piece.address.x + move.x,
                    'y': piece.address.y + moveY,
                };
                var addressPiece = _this.findPieceByAddress(potentialAddress);
                if ((!addressPiece || (addressPiece && addressPiece.side !== piece.side)) && Position.isAddressInsideBoard(potentialAddress)) {
                    movableAddress.push(potentialAddress);
                }
            }
        });
        return movableAddress;
    };
    Position.prototype.getBlackKingPiece = function () {
        return this.findPieceById(Position.blackKingPieceId);
    };
    Position.prototype.getWhiteKingPiece = function () {
        return this.findPieceById(Position.whiteKingPieceId);
    };
    Position.prototype.canTakeKing = function () {
        var _this = this;
        var opponentKingPiece = this.side === PlayerSide.black ? this.getWhiteKingPiece() : this.getBlackKingPiece();
        return this.pieces.some(function (piece) {
            return _this.side === piece.side &&
                _this.getPieceMovableAddresses(piece).some(function (movableAddress) {
                    return movableAddress.x === opponentKingPiece.address.x &&
                        movableAddress.y === opponentKingPiece.address.y;
                });
        });
    };
    Position.prototype.isCheckmate = function () {
        var _this = this;
        var kingPiece = this.side === PlayerSide.black ? this.getBlackKingPiece() : this.getWhiteKingPiece();
        var kingMovableAddresses = this.getPieceMovableAddresses(kingPiece);
        // 王の行動可能なマスに移動した場合、相手のコマに王が取られるか判定
        return kingMovableAddresses.some(function (movableAddress) {
            var tmpPosition = Object.create(_this);
            try {
                tmpPosition.move(kingPiece.id, movableAddress);
            }
            catch (e) {
                return false;
            }
            return tmpPosition.canTakeKing();
        });
    };
    Position.prototype.willBeCheckmate = function (piece, address) {
        var tmpAddress = piece.address;
        piece.setAddress(address);
        var isCheckmate = this.isCheckmate();
        piece.setAddress(tmpAddress);
        return isCheckmate;
    };
    Position.prototype.willBeTwoPawns = function (piece, address) {
        return piece.kind === 'p' && this.pieces.some(function (val) { return val.address !== undefined && val.address.x === address.x && val.kind === 'p'; });
    };
    Position.prototype.isValidMoveAddress = function (piece, address) {
        return this.getPieceMovableAddresses(piece).some(function (val) { return val.x === address.x && val.y === address.y; });
    };
    Position.prototype.changePlayerSide = function () {
        this.side = this.side === PlayerSide.black ? PlayerSide.white : PlayerSide.black;
    };
    Position.prototype.endTurn = function () {
        this.changePlayerSide();
        // 手数をインクリメント
        this.side === PlayerSide.black && this.turn++;
    };
    Position.prototype.move = function (pieceId, address) {
        var movingPiece = this.findPieceById(pieceId);
        if (movingPiece === undefined) {
            throw new Error('Selected piece is not find.');
        }
        else if (movingPiece.side !== this.side) {
            throw new Error('Selected piece is not yours.');
        }
        else if (!this.isValidMoveAddress(movingPiece, address)) {
            throw new Error('The piece can not move to the square.');
        }
        // コマの移動先に相手のコマがある場合
        var opponentPiece = this.findPieceByAddress(address);
        if (opponentPiece) {
            opponentPiece.taken();
        }
        movingPiece.setAddress(address);
        this.endTurn();
    };
    Position.prototype.drop = function (pieceId, address) {
        var droppingPiece = this.findPieceById(pieceId);
        if (droppingPiece === undefined) {
            throw new Error('Selected piece is not find.');
        }
        else if (droppingPiece.side !== this.side) {
            throw new Error('Selected piece is not yours.');
        }
        else if (droppingPiece.address !== undefined) {
            throw new Error('Selected piece is already on the board.');
        }
        else if (this.findPieceByAddress(address)) {
            throw new Error('A piece exists on the selected square.');
        }
        else if (droppingPiece.kind === 'p' && this.willBeCheckmate(droppingPiece, address)) {
            throw new Error('You can not checkmate by dropping a pawn.');
        }
        else if (this.willBeTwoPawns(droppingPiece, address)) {
            throw new Error('You can not place two powns on the same file.');
        }
        droppingPiece.setAddress(address);
        this.endTurn();
    };
    Position.blackKingPieceId = 1;
    Position.whiteKingPieceId = 21;
    return Position;
}());
exports.Position = Position;
