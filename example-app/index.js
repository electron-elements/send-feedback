const SendFeedback = require('../lib');
const sendFeedback = document.querySelector('send-issue-feedback');

// example of removing default styles
// SendFeedback.removeDefaultStyles = true;
customElements.define('send-issue-feedback', SendFeedback);
console.log(sendFeedback);
