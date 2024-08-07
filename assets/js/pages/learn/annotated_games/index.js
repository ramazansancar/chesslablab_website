import { databaseAnnotatedGames } from './DatabaseAnnotatedGames.js';
import { ravPanel } from './RavPanel.js';
import chessboard from '../../chessboard.js';
import { progressModal } from '../../ProgressModal.js';
import * as connect from '../../../../connect.js';
import * as env from '../../../../env.js';
import * as variant from '../../../../variant.js';

const handleClick = async (game) => {
  try {
    progressModal.props.modal.show();
    const res = await fetch(`${connect.api()}/play/rav`, {
      method: 'POST',
      body: JSON.stringify({
        variant: variant.CLASSICAL,
        movetext: game.movetext,
      })
    });
    const data = await res.json();
    ravPanel.props.ravMovesBrowser.current = data.fen.length - 1;
    ravPanel.props.ravMovesBrowser.props.chessboard.setPosition(data.fen[data.fen.length - 1]);
    ravPanel.props.ravMovesBrowser.props = {
      ...ravPanel.props.ravMovesBrowser.props,
      filtered: data.filtered,
      breakdown: data.breakdown,
      fen: data.fen
    };
    ravPanel.props.ravMovesBrowser.mount();
  } catch (error) {
  } finally {
    progressModal.props.modal.hide();
  }
};

try {
  progressModal.props.modal.show();
  const res = await fetch(`${connect.api()}/annotations/games`, {
    method: 'GET'
  });
  const tbody = databaseAnnotatedGames.props.form.getElementsByTagName('tbody')[0];
  tbody.replaceChildren();
  databaseAnnotatedGames.props.modal.show();
  (await res.json()).games.forEach(game => {
    const tr = document.createElement('tr');

    const eventTd = document.createElement('td');
    const roundTd = document.createElement('td');
    const yearTd = document.createElement('td');

    const ecoTd = document.createElement('td');
    const whiteTd = document.createElement('td');
    const whiteEloTd = document.createElement('td');
    const blackTd = document.createElement('td');
    const blackEloTd = document.createElement('td');
    const resultTd = document.createElement('td');

    eventTd.appendChild(document.createTextNode(game.Event));
    roundTd.appendChild(document.createTextNode(game.Round));
    yearTd.appendChild(document.createTextNode(game.Date));

    ecoTd.appendChild(document.createTextNode(game.ECO));
    whiteTd.appendChild(document.createTextNode(game.White));
    whiteEloTd.appendChild(document.createTextNode(game.WhiteElo));
    blackTd.appendChild(document.createTextNode(game.Black));
    blackEloTd.appendChild(document.createTextNode(game.BlackElo));
    resultTd.appendChild(document.createTextNode(game.Result));

    tr.appendChild(eventTd);
    tr.appendChild(roundTd);
    tr.appendChild(yearTd);
    tr.appendChild(ecoTd);
    tr.appendChild(whiteTd);
    tr.appendChild(whiteEloTd);
    tr.appendChild(blackTd);
    tr.appendChild(blackEloTd);
    tr.appendChild(resultTd);

    tr.addEventListener('click', async (event) => {
      await handleClick(game);
      ravPanel.props.movesMetadataTable.props = game;
      ravPanel.props.movesMetadataTable.mount();
      databaseAnnotatedGames.props.modal.hide();
    });

    tbody.appendChild(tr);
  });
} catch (error) {
} finally {
  progressModal.props.modal.hide();
}
