const ReportIssue = require('../lib');
const reportIssue = document.querySelector('report-issue');
const templates = ReportIssue.templates;

customElements.define('report-issue', ReportIssue);
