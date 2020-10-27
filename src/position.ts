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

	public getPieceMovableAddresses(piece: Piece): Address[] {
		let movableAddress: Address[] = [];
	
		piece.moves.forEach((move: MoveAddress) => {
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
					if (addressPiece || !Position.isAddressInsideBoard(potentialAddress)) {
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
		return piece.kind === 'p' && this.pieces.some(val => val.address !== undefined && val.address.x === address.x && val.kind === 'p');
	}

	private isValidMoveAddress(piece: Piece, address: Address): boolean {
		return this.getPieceMovableAddresses(piece).some(val => val.x === address.x && val.y === address.y)
	}

	private changePlayerSide(): void {
		this.side = this.side === PlayerSide.black ? PlayerSide.white : PlayerSide.black;
	}

	private endTurn(): void {
		this.changePlayerSide();
		// 手数をインクリメント
		this.side === PlayerSide.black && this.turn++;
	}

	public move(pieceId: number, address: Address): void {
		const movingPiece = this.findPieceById(pieceId);
	  if (movingPiece === undefined) {
			throw new Error('Selected piece is not find.');
		} else if (movingPiece.side !== this.side) {
			throw new Error('Selected piece is not yours.');
		} else if (!this.isValidMoveAddress(movingPiece, address)) {
			throw new Error('The piece can not move to the square.');
		}

		// コマの移動先に相手のコマがある場合
		const opponentPiece = this.findPieceByAddress(address);
		if (opponentPiece) {
			opponentPiece.taken();
		}
	
		movingPiece.setAddress(address);
		this.endTurn();
	}

	public drop(pieceId: number, address: Address): void {
		const droppingPiece = this.findPieceById(pieceId);
	  if (droppingPiece === undefined) {
			throw new Error('Selected piece is not find.');
		} else if (droppingPiece.side !== this.side) {
			throw new Error('Selected piece is not yours.');
		} else if (droppingPiece.address !== undefined) {
			throw new Error('Selected piece is already on the board.');
		} else if (this.findPieceByAddress(address)) {
			throw new Error('A piece exists on the selected square.');
		} else if (droppingPiece.kind === 'p' && this.willBeCheckmate(droppingPiece, address)) {
			throw new Error('You can not checkmate by dropping a pawn.');
		} else if (this.willBeTwoPawns(droppingPiece, address)) {
			throw new Error('You can not place two powns on the same file.');
		}

		droppingPiece.setAddress(address);
		this.endTurn();
	}
}