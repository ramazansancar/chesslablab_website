import {
  FEN,
  INPUT_EVENT_TYPE,
  MARKER_TYPE
} from '@chesslablab/cmblab';
import startedButtons from './startedButtons.js';
import chessboard from '../chessboard.js';
import openingTable from '../openingTable.js';
import sanMovesTable from '../sanMovesTable.js';
import ChesslaBlabWebSocket from '../../ws/fen.js';

const inputHandler = (event) => {
  if (event.type === INPUT_EVENT_TYPE.movingOverSquare) {
    return;
  }

  if (event.type !== INPUT_EVENT_TYPE.moveInputFinished) {
    event.chessboard.removeMarkers(MARKER_TYPE.dot);
    event.chessboard.removeMarkers(MARKER_TYPE.bevel);
  }

  if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
    ws.send(`/legal ${event.square}`);
    return true;
  } else if (event.type === INPUT_EVENT_TYPE.validateMoveInput) {
    ws.send(`/play_lan ${event.piece.charAt(0)} ${event.squareFrom}${event.squareTo}`);
    return true;
  }
}

chessboard.enableMoveInput(inputHandler);

const ws = new ChesslaBlabWebSocket(
  chessboard,
  sanMovesTable,
  openingTable,
  startedButtons
);

export default ws;