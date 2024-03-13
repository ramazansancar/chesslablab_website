import Modal from 'bootstrap/js/dist/modal.js';

const info = {
  modal: new Modal(document.getElementById('infoModal')),
  form: document.querySelector('#infoModal form'),
  msg: (txt) => {
    const label = document.querySelector('#infoModal label');
    const msg = document.createTextNode(txt);
    label.replaceChildren();
    label.appendChild(msg);
  }
}

export default info;
