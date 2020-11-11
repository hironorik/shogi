import { Position } from '../src/position';
import { Piece } from '../src/piece';

enum GameLang {
	ja = 'ja',
	en = 'en',
}

enum PlayerSide {
  black = 'b',
  white = 'w',
}

const renderBoardForConsole = (position: Piece[]) => {
  console.log();
  const whiteHoldPieceNames = position.filter(piece => piece.address === undefined && piece.side === PlayerSide.white).map(piece => {
    return piece.shortName;
  });
  console.log(whiteHoldPieceNames.join(', '));
  console.log('----------------------------------------------');

  for (let y=1; y<=9; y++) {
    let row = "";
    for (let x=9; x>=1; x--) {
      let square = "    ";
      for (let i=0; i<position.length; i++) {
        if (position[i].address !== undefined && (position[i].address as Address).x == x && (position[i].address as Address).y == y) {
          square = position[i].side + position[i].shortName + " ";
          break;
        }
      }
      row = row + "|" + square;
    }
    console.log(row + "|");
  }

  console.log('----------------------------------------------');
  const blackHoldPieceNames = position.filter(piece => piece.address === undefined && piece.side === PlayerSide.black).map(piece => {
    return piece.shortName;
  });
  console.log(blackHoldPieceNames.join(', '));
  console.log();
}

test('can take king.', () => {
  const position = new Position();
  const moves = [
		{from: {x: 5, y: 9}, to: {x: 5, y: 8}},
		{from: {x: 1, y: 3}, to: {x: 1, y: 4}},
		{from: {x: 4, y: 7}, to: {x: 4, y: 6}},
		{from: {x: 8, y: 2}, to: {x: 3, y: 2}},
		{from: {x: 5, y: 8}, to: {x: 4, y: 7}},
		{from: {x: 2, y: 3}, to: {x: 2, y: 4}},
		{from: {x: 4, y: 7}, to: {x: 3, y: 6}},
		{from: {x: 3, y: 3}, to: {x: 3, y: 4}},
		{from: {x: 3, y: 6}, to: {x: 2, y: 6}},
		{from: {x: 3, y: 4}, to: {x: 3, y: 5}},
		{from: {x: 2, y: 6}, to: {x: 1, y: 6}},
		{from: {x: 2, y: 1}, to: {x: 3, y: 3}},
		{from: {x: 2, y: 7}, to: {x: 2, y: 6}},
		{from: {x: 1, y: 1}, to: {x: 1, y: 3}},
		{from: {x: 2, y: 8}, to: {x: 2, y: 7}},
		{from: {x: 1, y: 4}, to: {x: 1, y: 5}},
		{from: {x: 1, y: 9}, to: {x: 1, y: 8}},
	];
	moves.forEach((move) => {
		let piece = position.findPieceByAddress(move.from) as Piece;
		position.move(piece.id, move.to);
	})
  expect(position.canTakeKing()).toBe(true);
});

test('should be checkmate.', () => {
  const position = new Position();
  const moves = [
		{from: {x: 5, y: 9}, to: {x: 5, y: 8}},
		{from: {x: 1, y: 3}, to: {x: 1, y: 4}},
		{from: {x: 4, y: 7}, to: {x: 4, y: 6}},
		{from: {x: 8, y: 2}, to: {x: 3, y: 2}},
		{from: {x: 5, y: 8}, to: {x: 4, y: 7}},
		{from: {x: 2, y: 3}, to: {x: 2, y: 4}},
		{from: {x: 4, y: 7}, to: {x: 3, y: 6}},
		{from: {x: 3, y: 3}, to: {x: 3, y: 4}},
		{from: {x: 3, y: 6}, to: {x: 2, y: 6}},
		{from: {x: 3, y: 4}, to: {x: 3, y: 5}},
		{from: {x: 2, y: 6}, to: {x: 1, y: 6}},
		{from: {x: 2, y: 1}, to: {x: 3, y: 3}},
		{from: {x: 2, y: 7}, to: {x: 2, y: 6}},
		{from: {x: 1, y: 1}, to: {x: 1, y: 3}},
		{from: {x: 2, y: 8}, to: {x: 2, y: 7}},
		{from: {x: 1, y: 4}, to: {x: 1, y: 5}},
	];
	moves.forEach((move) => {
		let piece = position.findPieceByAddress(move.from) as Piece;
		position.move(piece.id, move.to);
	});
  expect(position.isCheckmate()).toBe(true);
});

test('will be checkmate.', () => {
  const position = new Position();
  const moves = [
		{from: {x: 5, y: 9}, to: {x: 5, y: 8}},
		{from: {x: 1, y: 3}, to: {x: 1, y: 4}},
		{from: {x: 4, y: 7}, to: {x: 4, y: 6}},
		{from: {x: 8, y: 2}, to: {x: 3, y: 2}},
		{from: {x: 5, y: 8}, to: {x: 4, y: 7}},
		{from: {x: 2, y: 3}, to: {x: 2, y: 4}},
		{from: {x: 4, y: 7}, to: {x: 3, y: 6}},
		{from: {x: 3, y: 3}, to: {x: 3, y: 4}},
		{from: {x: 3, y: 6}, to: {x: 2, y: 6}},
		{from: {x: 3, y: 4}, to: {x: 3, y: 5}},
		{from: {x: 2, y: 6}, to: {x: 1, y: 6}},
		{from: {x: 2, y: 1}, to: {x: 3, y: 3}},
		{from: {x: 2, y: 7}, to: {x: 2, y: 6}},
		{from: {x: 1, y: 1}, to: {x: 1, y: 3}},
		{from: {x: 2, y: 8}, to: {x: 2, y: 7}},
	];

	moves.forEach((move) => {
		let piece = position.findPieceByAddress(move.from) as Piece;
		position.move(piece.id, move.to);
	});
	const piece = position.findPieceByAddress({x: 1, y: 4}) as Piece;
  expect(position['willBeCheckmate'](piece, {x: 1, y: 5})).toBe(true);
});

test('lance can take pawn.', () => {
  const position = new Position();
  const moves = [
		{from: {x: 1, y: 7}, to: {x: 1, y: 6}},
		{from: {x: 1, y: 3}, to: {x: 1, y: 4}},
		{from: {x: 1, y: 6}, to: {x: 1, y: 5}},
		{from: {x: 1, y: 4}, to: {x: 1, y: 5}},
		{from: {x: 1, y: 9}, to: {x: 1, y: 5}},
	];
	/*
	|  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |
	----------------------------------------------
	|w香 |w桂  |w銀 |w金 |w王  |w金 |w銀 |w桂  |w香 | 1
	|    |w飛 |    |    |    |    |    |w角  |    | 2
	|w歩 |w歩  |w歩 |w歩 |w歩  |w歩 |w歩  |w歩 |    | 3
	|    |    |    |    |    |    |    |    |    | 4
	|    |    |    |    |    |    |    |    |b香 | 5
	|    |    |    |    |    |    |    |    |    | 6
	|b歩 |b歩  |b歩 |b歩 |b歩  |b歩 |b歩 |b歩  |    | 7
	|    |b角 |    |    |    |    |    |b飛  |    | 8
	|b香 |b桂  |b銀 |b金 |b王  |b金 |b銀 |b桂  |    | 9
	----------------------------------------------
	*/

	moves.forEach((move) => {
		let piece = position.findPieceByAddress(move.from) as Piece;
		position.move(piece.id, move.to);
	});

	const blackLance = position['findPieceById'](10);  // black が最後に動かした香車
	const blackPawon = position['findPieceById'](32);  // black が取った歩

	expect((blackLance as Piece).address).toEqual({x: 1, y: 5});
  expect((blackPawon as Piece).side).toBe(PlayerSide.black);
});

test('lance must promote.', () => {
  const position = new Position();
  const moves = [
		{from: {x: 1, y: 7}, to: {x: 1, y: 6}},
		{from: {x: 1, y: 3}, to: {x: 1, y: 4}},
		{from: {x: 1, y: 6}, to: {x: 1, y: 5}},
		{from: {x: 1, y: 4}, to: {x: 1, y: 5}},
		{from: {x: 1, y: 9}, to: {x: 1, y: 5}},
		{from: {x: 1, y: 1}, to: {x: 1, y: 5}},
		{from: {x: 9, y: 7}, to: {x: 9, y: 6}},
	];
	/*
	|  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |
	----------------------------------------------
	|w香 |w桂  |w銀 |w金 |w王  |w金 |w銀 |w桂  |    | 1
	|    |w飛 |    |    |    |    |    |w角  |    | 2
	|w歩 |w歩  |w歩 |w歩 |w歩  |w歩 |w歩  |w歩 |    | 3
	|    |    |    |    |    |    |    |    |    | 4
	|    |    |    |    |    |    |    |    |w香  | 5
	|b歩 |    |    |    |    |    |    |     |    | 6
	|    |b歩  |b歩 |b歩 |b歩  |b歩 |b歩 |b歩  |    | 7
	|    |b角 |    |    |    |    |    |b飛  |    | 8
	|b香 |b桂  |b銀 |b金 |b王  |b金 |b銀 |b桂  |    | 9
	----------------------------------------------
	*/

	moves.forEach((move) => {
		let piece = position.findPieceByAddress(move.from) as Piece;
		position.move(piece.id, move.to);
	});

	const whiteLance = position['findPieceByAddress']({x: 1, y: 5}) as Piece;  // white が最後に動かした香車
	expect(position.willNeedToPromote(whiteLance, {x: 1, y: 9})).toBe(true);
	position.move(whiteLance.id, {x: 1, y: 9}, position.willNeedToPromote(whiteLance, {x: 1, y: 9}));

	expect((whiteLance as Piece).address).toEqual({x: 1, y: 9});
  expect((whiteLance as Piece).isPromoted).toBe(true);
});
