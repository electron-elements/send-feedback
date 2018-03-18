const SendFeedback = require('../lib');
const sendFeedback = document.querySelector('send-feedback');

// example of removing default styles
// SendFeedback.removeDefaultStyles = true;
customElements.define('send-feedback', SendFeedback);

function getElement(sel) {
  return document.querySelector(sel);
}

const customizeDropdown = getElement('select');
const cusomizeInput = getElement('input');
const customizeButton = getElement('button');

customizeButton.addEventListener('click', () => {
  const attr = customizeDropdown.value;
  sendFeedback.setAttribute(attr, cusomizeInput.value);
});
