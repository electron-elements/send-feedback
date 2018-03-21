const TemplateManager = require('./template-manager');
const templates = new TemplateManager();

templates.add('send-feedback', `
<style>
  :host {
    width: 445px;
    height: 375px;
    display: inline-block;
    font-family: Verdana, Arial, sans-serif;
  }

  :host[hidden] {
    display: none;
  }

  .send-feedback {
    height: 100%;
    box-sizing: border-box;
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
    line-height: 9px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color, opacity 0.1s ease-in;
    margin-bottom: 6px;
    text-align: center;
    text-overflow: ellipsis;
    padding: 12px 15px;
  }

  .hide {
    opacity: 0;
    width: 0;
    height: 0;
    padding: 0;
    margin: 0;
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

  .error {
    color: #F44336 !important;
  }

  .loader {
    display: none;
    border: 3px solid #f3f3f3;
    animation: spin 1s linear infinite;
    border-top: 3px solid #555;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    margin-top: 5px;
    margin-left: 8px;
  }

  .loader.show { display: inline-block; }
  .loader.stop {
    animation: initial;
    border: none;
    color: green; 
    display: block;
    width: 100%;
    height: 100%;
    margin: -15px 10px 5px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
    <button role="button" aria-label="Send">{{ button-label }}</button>
    <div class="loader"></div>
  </div>
</section>
`);

module.exports = templates;
