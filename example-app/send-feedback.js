'use strict';

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

// by default use consoleReporer - console.log stuff out
sendFeedback.useReporter(function({ title, body, logs }) {
  console.log(title, body);
  if (Object.keys(logs).length !== 0) {
    console.log(logs);
  }
});

// sendFeedback.useReporter('browserReporter', {
//   url: 'https://google.com'
// });
