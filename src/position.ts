import * as yaml from 'js-yaml';
import * as fs from 'fs';

import { Piece } from './piece';

enum GameLang {
	ja = 'ja',
	en = 'en',
}

enum PlayerSide {
  black = 'b',
  white = 'w',
}

export class Position {
	private turn = 1;
	public side: PlayerSide = PlayerSide.black;
	public pieces: Piece[];
	private static readonly blackKingPieceId = 1;
	private static readonly whiteKingPieceId = 21;

	constructor() {
		const initialPiece: any = yaml.safeLoad(fs.readFileSync(`${__dirname}/../config/initialPiece.yaml`, 'utf8'));
		const pieceKind: any = yaml.safeLoad(fs.readFileSync(`${__dirname}/../config/pieceKind.yaml`, 'utf8'));

		this.pieces = initialPiece.map((piece: any, idx: number) => {
			return new Piece(
			  idx+1,
			  piece.kind,
			  piece.side,
			  piece.address,
			  pieceKind[piece.kind].name,
			  pieceKind[piece.kind].point,
			  pieceKind[piece.kind].move,
			  GameLang.ja,
			);
		});	  
	}

	private static isAddressInsideBoard(address: Address): boolean {
		return address.x >= 1 && address.x <= 9 && address.y >= 1 && address.y <= 9;
	}

	private findPieceById(id: number): Piece | undefined {
		return this.pieces.find((piece: Piece) => piece.id === id);
	}

	public findPieceByAddress(address: Address): Piece | undefined {
		return this.pieces.find((piece: Piece) => {
			return piece.address !== undefined && piece.address.x === address.x && piece.address.y === address.y;
		});
	}

	private getEmptyAddresses(): Address[] {
		let emptyAddresses = [];
		for (let x=1; x<=9; x++) {
			for (let y=1; y<=9; y++) {
				emptyAddresses.push({
					x: x,
					y: y,
				});
			}
		}
		return emptyAddresses.filter((address: Address) => {
			return !this.findPieceByAddress(address);
		});
	}

	public getPieceMovableAddresses(piece: Piece): Address[] {
		let movableAddress: Address[] = [];
	
		// 持ち駒の場合
		if (piece.address === undefined) {
			const emptyAddresses = this.getEmptyAddresses();
			movableAddress = emptyAddresses.filter((address: Address) => {
				return this.willPieceBeMovable(piece, address) && 
					!(piece.kind === 'p' && this.willBeCheckmate(piece, address)) &&
					!this.willBeTwoPawns(piece, address);
			});

		// 盤上の駒の場合
		} else {
			piece.moves.forEach((move: MoveAddress) => {
				// 縦横斜めに連続する箇所に移動可能な駒の場合
				if (Piece.isFuncutionalMoveDimension(move.x) || Piece.isFuncutionalMoveDimension(move.y)) {
					for (let i=1; i<9; i++) {
						let moveX = Piece.isFuncutionalMoveDimension(move.x) ? parseInt((move.x as string).replace('n', i.toString())) : move.x as number;
						let moveY = Piece.isFuncutionalMoveDimension(move.y) ? parseInt((move.y as string).replace('n', i.toString())) : move.y as number;
						moveY = piece.side == PlayerSide.white ? -1 * moveY : moveY;

						let potentialAddress = {
							'x': (piece.address as Address).x + moveX,
							'y': (piece.address as Address).y + moveY,
						}

						let addressPiece = this.findPieceByAddress(potentialAddress);
						if ((addressPiece && (addressPiece as Piece).side === piece.side) || !Position.isAddressInsideBoard(potentialAddress)) {
							break;
						} else if (addressPiece && (addressPiece as Piece).side !== piece.side) {
							movableAddress.push(potentialAddress);
							break;
						}
						movableAddress.push(potentialAddress);
					}
				} else {
					let moveY = piece.side == PlayerSide.white ? -1 * (move.y as number) : move.y as number;
					let potentialAddress = {
						'x': (piece.address as Address).x + (move.x as number),
						'y': (piece.address as Address).y + moveY,
					};
					let addressPiece = this.findPieceByAddress(potentialAddress);
					if ((!addressPiece || (addressPiece && (addressPiece as Piece).side !== piece.side)) && Position.isAddressInsideBoard(potentialAddress)) {
						movableAddress.push(potentialAddress);
					}
				}
			});
		}
	
		return movableAddress;
	}

	public getBlackKingPiece(): Piece {
		return this.findPieceById(Position.blackKingPieceId) as Piece;
	}

	public getWhiteKingPiece(): Piece {
		return this.findPieceById(Position.whiteKingPieceId) as Piece;
	}

	public canTakeKing(): boolean {
		const opponentKingPiece = this.side === PlayerSide.black ? this.getWhiteKingPiece() : this.getBlackKingPiece();
		return this.pieces.some((piece: Piece) => {
			return this.side === piece.side &&
				this.getPieceMovableAddresses(piece).some((movableAddress: Address) => {
					return movableAddress.x === (opponentKingPiece.address as Address).x &&
						movableAddress.y === (opponentKingPiece.address as Address).y
				});
		});
	}

	public isCheckmate(): boolean {
		const kingPiece = this.side === PlayerSide.black ? this.getBlackKingPiece() : this.getWhiteKingPiece();
		const kingMovableAddresses = this.getPieceMovableAddresses(kingPiece);

		// 王の行動可能なマスに移動した場合、相手のコマに王が取られるか判定
		return kingMovableAddresses.some((movableAddress: Address) => {
			let tmpPosition = Object.create(this);
			tmpPosition.pieces = tmpPosition.pieces.map((piece: Piece) => {
				return Object.create(piece);
			});

			try {
				tmpPosition.move(kingPiece.id, movableAddress);
			} catch (e) {
				return false;
			}

			return tmpPosition.canTakeKing();
		});
	}

	private willPieceBeMovable(piece: Piece, address: Address): boolean {
		const tmpAddress = piece.address;
		piece.setAddress(address);
		const tmpMovableAddresses = this.getPieceMovableAddresses(piece);
		piece.setAddress(tmpAddress);
		return tmpMovableAddresses.length > 0;
	}

	private willBeCheckmate(piece: Piece, address: Address): boolean {
		const tmpAddress = piece.address;
		piece.setAddress(address);
		this.changePlayerSide();
		const isCheckmate = this.isCheckmate();
		piece.setAddress(tmpAddress);
		this.changePlayerSide();

		return isCheckmate;
	}

	private willBeTwoPawns(piece: Piece, address: Address): boolean {
		return piece.kind === 'p' && this.pieces.some(val => 
			val.address !== undefined && val.address.x === address.x && val.kind === 'p'
		);
	}

	private isValidMoveAddress(piece: Piece, address: Address): boolean {
		return this.getPieceMovableAddresses(piece).some(val => val.x === address.x && val.y === address.y)
	}

	private changePlayerSide(): void {
		this.side = this.side === PlayerSide.black ? PlayerSide.white : PlayerSide.black;
	}

	public endTurn(): void {
		this.changePlayerSide();
		// 手数をインクリメント
		this.side === PlayerSide.black && this.turn++;
	}

	public willBePromotable(piece: Piece, address: Address): boolean {
		return piece.isPromotable &&
			!piece.isPromoted &&
			piece.address !== undefined &&
			((piece.side === PlayerSide.black && address.y <= 3) || (piece.side === PlayerSide.white && address.y >= 7))
	}

	public willNeedToPromote(piece: Piece, address: Address): boolean {
		return this.willBePromotable(piece, address) && !this.willPieceBeMovable(piece, address);
	}

	public move(pieceId: number, address: Address, willPromote: boolean = false): void {
		const movingPiece = this.findPieceById(pieceId);

		if (movingPiece === undefined) {
			throw new Error(`Selected piece is not find. Game Player Side: ${this.side}, Trun: ${this.turn}`);
		} else if (movingPiece.side !== this.side) {
			throw new Error(`Selected piece '${movingPiece.fullName}' is not yours. Game Player Side: ${this.side}, Trun: ${this.turn}`);
		} else if (!this.isValidMoveAddress(movingPiece, address)) {
			throw new Error(`The piece '${movingPiece.fullName}' can not move to the square (${address.x}, ${address.y}). Game Player Side: ${this.side}, Trun: ${this.turn}`);
		} else if (willPromote && !this.willBePromotable(movingPiece, address)) {
			throw new Error(`The piece can not promote. Game Player Side: ${this.side}, Trun: ${this.turn}`);
		}

		// 盤上の駒を移動する場合
		if (movingPiece.address !== undefined) {
			// コマの移動先に相手のコマがある場合
			const opponentPiece = this.findPieceByAddress(address);
			if (opponentPiece) {
				opponentPiece.taken();
			}
		}

		movingPiece.setAddress(address);
		if (willPromote) {
			movingPiece.promote();
		}

		this.endTurn();
	}
}