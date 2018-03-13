const TemplateManager = require('./template-manager');
const templates = new TemplateManager();

templates.add('report-issue', `
<style>
  :host {
    width: 500px;
    height: 315px;
    display: block;
    max-width: 500px;
    margin: auto;
    font-family: Verdana, Arial, sans-serif;
    padding: 5%;
  }

  :host[hidden] {
    display: none;
  }

  * {
    box-sizing: border-box;
  }

  .report-issue {
    height: 100%;
    padding: 10px;
    overflow: scroll;
    background-color: #f1f1f1;
    box-shadow: rgba(0,0,0,0.3) 1px 1px 3px 0;
  }

  .title {
    font-size: 22px;
  }

  .title, label,
  textarea, button {
    padding: 10px;
  }

  .report-issue {
    display: flex;
    flex-direction: column;
  }

  textarea {
    resize: none;
    height: 100%;
  }

  textarea, button {
    font-size: 14px;
  }

  textarea, button {
    margin: 0 8px 10px;
  }

  button {
    border: 2px solid #3F51B5;
    background-color: #3F51B5;
    color: #fff;
    width: 130px;
    height: 40px;
    line-height: 10px;
    cursor: pointer;
    border-radius: 4px;
    transition: all ease-in;
    margin-bottom: 6px;
  }

  button:hover, button:focus {
    background-color: #fff;
    border-color: #3F51B5;
    color: #3F51B5;
  }

  button:active {
    box-shadow: inset rgba(0, 0, 0, 0.3) 3px 1px 20px 0px
  }

  textarea:hover,
  textarea:focus {
    outline-color: #399ce6;
  }
</style>
`);

templates.add('report-issue-content', `
<section class="report-issue">
  <div class="title">{{ title }}</div>  
  <label for="report-issue-{{id}}">{{ label }}</label>
  <textarea placeholder="{{placeholder}}" id="report-issue-{{id}}"></textarea>
  <button>Report Issue</button>
</section>
`);

module.exports = templates;
