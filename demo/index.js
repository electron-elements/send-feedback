const SendFeedback = require('../lib');
const sendFeedback = document.querySelector('send-issue-feedback');

SendFeedback.removeDefaultStyles = true;
customElements.define('send-issue-feedback', SendFeedback);
sendFeedback.reportIssueURL = 'https://github.com/cPhost/send-feedback/issues/new';
