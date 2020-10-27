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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline = __importStar(require("readline"));
var position_1 = require("./position");
var PlayerSide;
(function (PlayerSide) {
    PlayerSide["black"] = "b";
    PlayerSide["white"] = "w";
})(PlayerSide || (PlayerSide = {}));
var renderBoardForConsole = function (position) {
    console.log();
    var whiteHoldPieceNames = position.filter(function (piece) { return piece.address === undefined && piece.side === PlayerSide.white; }).map(function (piece) {
        return piece.shortName;
    });
    console.log(whiteHoldPieceNames.join(', '));
    console.log('----------------------------------------------');
    for (var y = 1; y <= 9; y++) {
        var row = "";
        for (var x = 9; x >= 1; x--) {
            var square = "    ";
            for (var i = 0; i < position.length; i++) {
                if (position[i].address !== undefined && position[i].address.x == x && position[i].address.y == y) {
                    square = position[i].side + position[i].shortName + " ";
                    break;
                }
            }
            row = row + "|" + square;
        }
        console.log(row + "|");
    }
    console.log('----------------------------------------------');
    var blackHoldPieceNames = position.filter(function (piece) { return piece.address === undefined && piece.side === PlayerSide.black; }).map(function (piece) {
        return piece.shortName;
    });
    console.log(blackHoldPieceNames.join(', '));
    console.log();
};
var isAddressInsideBoard = function (address) {
    return address.x >= 1 && address.x <= 9 &&
        address.y >= 1 && address.y <= 9;
};
var isValiedInputAddress = function (input) {
    var inputs = input.split(' ');
    if (inputs.length != 2) {
        return false;
    }
    if (!inputs.every(function (input) { return Number.isInteger(parseInt(input)); })) {
        return false;
    }
    ;
    var address = {
        'x': parseInt(inputs[0]),
        'y': parseInt(inputs[1])
    };
    return isAddressInsideBoard(address);
};
var prompt = function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var answer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(message);
                return [4 /*yield*/, question('> ')];
            case 1:
                answer = _a.sent();
                return [2 /*return*/, answer.trim()];
        }
    });
}); };
var question = function (question) {
    var readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(function (resolve) {
        readlineInterface.question(question, function (answer) {
            resolve(answer);
            readlineInterface.close();
        });
    });
};
var userInputAddress = function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var input, inputs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!true) return [3 /*break*/, 2];
                return [4 /*yield*/, prompt(message + " Type \"<Column Number> <Row Number>\".")];
            case 1:
                input = _a.sent();
                if (isValiedInputAddress(input)) {
                    inputs = input.split(' ');
                    return [2 /*return*/, {
                            'x': parseInt(inputs[0]),
                            'y': parseInt(inputs[1])
                        }];
                }
                console.log('Invalid address you input. Try again.');
                return [3 /*break*/, 0];
            case 2: return [2 /*return*/];
        }
    });
}); };
var userSelectMovingToAddress = function (piece, position) { return __awaiter(void 0, void 0, void 0, function () {
    var movableAddresses, selectedAddress;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Following Addresses are movable.');
                movableAddresses = position.getPieceMovableAddresses(piece);
                console.log(movableAddresses);
                _a.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 3];
                return [4 /*yield*/, userInputAddress('Select an address where the piece move to.')];
            case 2:
                selectedAddress = _a.sent();
                if (!movableAddresses.some(function (val) { return val.x === selectedAddress.x && val.y === selectedAddress.y; })) {
                    console.log('The piece can not move to the address.');
                    return [3 /*break*/, 1];
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/, selectedAddress];
        }
    });
}); };
var userSelectMovingPiece = function (position) { return __awaiter(void 0, void 0, void 0, function () {
    var piece, selectedAddress;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!true) return [3 /*break*/, 2];
                return [4 /*yield*/, userInputAddress('Select your next move.')];
            case 1:
                selectedAddress = _a.sent();
                piece = position.findPieceByAddress(selectedAddress);
                if (!piece) {
                    console.log('There is no piece. Select an address where your piece is located.');
                    return [3 /*break*/, 0];
                }
                else if (piece.side != position.side) {
                    console.log('It\'s not your piece. Select your piece.');
                    return [3 /*break*/, 0];
                }
                return [3 /*break*/, 2];
            case 2: return [2 /*return*/, piece];
        }
    });
}); };
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var position, piece, moveToAddress;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                position = new position_1.Position();
                renderBoardForConsole(position.pieces);
                _a.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 4];
                return [4 /*yield*/, userSelectMovingPiece(position)];
            case 2:
                piece = _a.sent();
                console.log("Selected : " + piece.address.x + ", " + piece.address.y + ", " + piece.shortName);
                return [4 /*yield*/, userSelectMovingToAddress(piece, position)];
            case 3:
                moveToAddress = _a.sent();
                position.move(piece.id, moveToAddress);
                console.log(piece.shortName + " moved to " + moveToAddress.x + ", " + moveToAddress.y);
                console.log(position.getWhiteKingPiece());
                renderBoardForConsole(position.pieces);
                if (position.canTakeKing() || position.isCheckmate()) {
                    console.log("Player " + position.side + ", WIN!!!!");
                    return [3 /*break*/, 4];
                }
                else {
                    console.log("Change player turn to " + position.side + ".");
                }
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); })();
