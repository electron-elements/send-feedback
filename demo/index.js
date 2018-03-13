const SendFeedback = require('../lib');
const reportIssue = document.querySelector('send-issue-feedback');
const templates = SendFeedback.templates;

customElements.define('send-issue-feedback', SendFeedback);
reportIssue.reportIssueURL = 'https://github.com/cPhost/send-feedback/issues/new'
