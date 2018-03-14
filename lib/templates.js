const TemplateManager = require('./template-manager');
const templates = new TemplateManager();

templates.add('send-feedback', `
<style>
  :host {
    width: 500px;
    height: 315px;
    display: block;
    font-family: Verdana, Arial, sans-serif;
    padding: 5%;
  }

  :host[hidden] {
    display: none;
  }

  .send-feedback {
    height: 100%;
    padding: 10px;
    overflow: scroll;
    background-color: #f1f1f1;
    box-shadow: rgba(0,0,0,0.3) 1px 1px 3px 0;
  }

  label {
    cursor: pointer;
  }

  .title {
    font-size: 22px;
  }

  .title, label,
  textarea, input {
    padding: 10px;
  }

  .send-feedback {
    display: flex;
    flex-direction: column;
  }

  textarea {
    resize: none;
    height: 100%;
    border-color: #ccc;
  }

  textarea, button, input {
    font-size: 14px;
  }

  textarea, button, input {
    margin: 0 8px 10px;
  }

  button {
    border: 2px solid #3F51B5;
    background-color: #3F51B5;
    color: #fff;
    width: auto;
    line-height: 7px;
    cursor: pointer;
    border-radius: 4px;
    transition: all ease-in;
    margin-bottom: 6px;
    text-align: center;
    text-overflow: ellipsis;
    padding: 12px 15px;
  }

  button:hover, button:focus {
    background-color: #fff;
    border-color: #3F51B5;
    color: #3F51B5;
  }

  button:focus {
    outline: none;
  }

  button:active {
    background-color: #f1f1f1;
    color: #3F51B5;
  }

  textarea:hover,
  textarea:focus {
    outline-color: #399ce6;
  }

  input.error, textarea.error {
    outline: #F44336 auto 4px;
    border: none;
  }

  label.error {
    color: #F44336;
  }
</style>
<style class="custom-styles"></style>
`);

templates.add('send-feedback-content', `
<section class="send-feedback">
  <div class="title">{{ title }}</div>  
  <label for="title-label-{{id}}">{{ title-label }}</label>
  <input type="text" id="title-label-{{id}}" placeholder="{{title-placeholder}}">

  <label for="textarea-label-{{id}}">{{ textarea-label }}</label>
  <textarea placeholder="{{textarea-placeholder}}" id="textarea-label-{{id}}"></textarea>
  
  <div>
    <button>{{ button-label }}</button>
  </div>
</section>
`);

module.exports = templates;
