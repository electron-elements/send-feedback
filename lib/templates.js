const TemplateManager = require('./template-manager');
const templates = new TemplateManager();

templates.add('report-issue', `
<style>
  :host {
    display: block;
  }

  :host[hidden] {
    display: none;
  }
</style>
`);

templates.add('report-issue-content', `
  <div class="title">{{ title }}</div>
  <label for="report-issue-{{id}}">{{ instructions }}</label>
  <textarea placeholder={{placeholder}} id="report-issue-{{id}}"></textarea>
`);

window.templates = templates;
module.exports = templates;
