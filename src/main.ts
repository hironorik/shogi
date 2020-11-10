import * as readline from 'readline';

import { Piece } from './piece';
import { Position } from './position';

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
  console.log('|  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |');
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
    console.log(row + "| " + y);
  }

  console.log('----------------------------------------------');
  const blackHoldPieceNames = position.filter(piece => piece.address === undefined && piece.side === PlayerSide.black).map(piece => {
    return piece.shortName;
  });
  console.log(blackHoldPieceNames.join(', '));
  console.log();
}

const isAddressInsideBoard = (address: Address) => {
  return address.x >= 1 && address.x <= 9 &&
    address.y >= 1 && address.y <= 9;
}

const isValiedInputAddress = (input: string) => {
  const inputs = input.split(' ');
  
  if (inputs.length != 2) {
    return false;
  }

  if (!inputs.every(input => Number.isInteger(parseInt(input)))) {
    return false;
  };

  const address: Address = {
    'x': parseInt(inputs[0]),
    'y': parseInt(inputs[1])
  };

  return (address.x === 0 && address.y >= 1 ) || isAddressInsideBoard(address);
}

const prompt = async(message: string) => {
  console.log(message);
  const answer: any = await question('> ');
  return answer.trim();
};

const question = (question: string) => {
  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    readlineInterface.question(question, (answer) => {
      resolve(answer);
      readlineInterface.close();
    });
  });
};

const userInputAddress = async (message: string) => {
  while (true) {
    const input = await prompt(`${message} Type "<Column Number> <Row Number>".`);
    if (isValiedInputAddress(input)) {

      const inputs = input.split(' ');
      return {
        'x': parseInt(inputs[0]),
        'y': parseInt(inputs[1])
      };
    }
    console.log('Invalid address you input. Try again.');
  }
}

const userSelectMovingToAddress = async (piece: Piece, position: Position) => {
  console.log('Following Addresses are movable.');
  let movableAddresses = position.getPieceMovableAddresses(piece);
  console.log(movableAddresses);
  let selectedAddress: Address;

  while (true) {
    selectedAddress = await userInputAddress('Select an address where the piece move to.');

    if (!movableAddresses.some(val => val.x === selectedAddress.x && val.y === selectedAddress.y)) {
      console.log('The piece can not move to the address.');
      continue;
    }
    break;
  }

  return selectedAddress;
}

const userSelectMovingPiece = async (position: Position) => {
  let piece: Piece | undefined;

  while (true) {
    let selectedAddress = await userInputAddress('Select your next move.');

    // 持ち駒から出す場合
    if (selectedAddress.x == 0) {
      const handPieces = position.pieces.filter((piece: Piece) => piece.address === undefined && piece.side === position.side);
      piece = handPieces[selectedAddress.y - 1];
      console.log(piece);
    } else {
      piece = position.findPieceByAddress(selectedAddress);
    }

    if (!piece) {
      console.log('There is no piece. Select an address where your piece is located.');
      continue;
    } else if (piece.side != position.side) {
      console.log('It\'s not your piece. Select your piece.');
      continue;
    }
    break;
  }

  return piece as Piece;
}

(async () => {
  let position = new Position();
  renderBoardForConsole(position.pieces);

  while (true) {
    let piece = await userSelectMovingPiece(position) as Piece;
    console.log(`Selected : ${piece.id}, ${piece.shortName}`, piece.address);

    let moveToAddress = await userSelectMovingToAddress(piece, position);
    let willPromote = false;

    position.move(piece.id, moveToAddress, willPromote);
    console.log(`${piece.shortName} moved to ${moveToAddress.x}, ${moveToAddress.y}`);

    position.endTurn();
    renderBoardForConsole(position.pieces);

    if (position.canTakeKing() || position.isCheckmate()) {
      console.log(`Player ${position.side}, WIN!!!!`);
      break;
    }

    console.log(`Change player turn to ${position.side}.`);
  }
})();
