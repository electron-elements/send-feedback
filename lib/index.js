'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const os = require('os');
const electron = require('electron');
const { app } = electron.remote;
const templates = require('./templates');
const { AttributeManager } = require('@electron-elements/utils');
const defaultReporter = require('./default-reporters');

const fsReadFile = promisify(fs.readFile);
class SendFeedback extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(templates.get('send-feedback'));

    this.attr = new AttributeManager(this);
    this.templates = templates;
    this.elementConnected = false;
    this.logs = [];
    this.logsFetched = false;
    this.logFiles = {};
    this.loaderTexts = {
      error: '&#10060; Error sending feedback! try again..',
      sucess: '&#10004; Feedback sent.'
    };

    // css props
    const cssPropBridge = ['removeDefaultStyles', 'customStyles'];
    cssPropBridge.forEach(prop => {
      this[prop] = SendFeedback[prop];
    });

    // attribute stuff
    this._attributesToObserve = [
      'title',
      'title-label',
      'title-placeholder',
      'textarea-label',
      'textarea-placeholder',
      'button-label'
    ];
  }

  connectedCallback() {
    const { shadowRoot, templates } = this;
    const data = this._generateData();

    templates.update('send-feedback-content', data);
    shadowRoot.append(templates.get('send-feedback-content'));
    this.elementConnected = true;

    this._title = shadowRoot.querySelector('.title');
    this._textarea = shadowRoot.querySelector('textarea');
    this._textareaLabel = shadowRoot.querySelector('label:nth-of-type(2)');
    this._titleLabel = shadowRoot.querySelector('label');
    this._titleInput = shadowRoot.querySelector('input');
    this._button = shadowRoot.querySelector('button');
    this._loader = shadowRoot.querySelector('.loader');

    this._textarea.addEventListener('input', this._recheckErrorClass);
    this._titleInput.addEventListener('input', this._recheckErrorClass);
    this._button.addEventListener('click', this._onSubmitFeedback.bind(this));

    this.feedbackSubmittedEvent = new Event('feedback-submitted', {
      bubbles: false,
      cancelable: false,
      composed: true
    });

    this.attr.createAttrToPropBridge(this._attributesToObserve);
    this.attr.onAttributeChange(this._attributesToObserve, {
      addDataAttrs: true,
      handler: this._updateContents
    });
  }

  disconnectedCallback() {
    this._textarea.removeEventListener('input', this._recheckErrorClass);
    this._titleInput.removeEventListener('input', this._recheckErrorClass);
    this._button.removeEventListener('click', this._onSubmitFeedback.bind(this));
  }

  _recheckErrorClass() {
    if (this.value !== '') {
      const label = this.previousElementSibling;
      label.classList.remove('error');
      this.classList.remove('error');

      label.innerText = label.innerText.replace(/\s\(required\)$/, '');
    }
  }

  _onSubmitFeedback() {
    const submitFeedback = this.submitFeedback.bind(this);
    const { _textarea, _titleInput, feedbackSubmittedEvent } = this;

    let inputSafe = true;
    [_textarea, _titleInput].forEach(el => {
      if (el.value === '') {
        const label = el.previousElementSibling;
        if (!label.classList.contains('error')) {
          label.classList.add('error');
          el.classList.add('error');
          label.innerText += ' (required)';
        }

        inputSafe = false;
      }
    });

    if (inputSafe) {
      return submitFeedback()
        .then(() => {
          this.safeHideLoader();
          this.clearFeedbackForm();
          this.dispatchEvent(feedbackSubmittedEvent);
        })
        .catch(err => {
          this.safeHideLoader(true);
          throw err;
        });
    }
  }

  _generateData() {
    const { attr, removeDataPrefix } = this;
    const defaults = {
      id: attr.id,
      title: 'Send Feedback',
      'title-label': 'Title',
      'title-placeholder': 'Enter a title',
      'textarea-label': 'Send us your experience with this app:',
      'textarea-placeholder': 'Write your feedback...',
      'button-label': 'Send Feedback'
    };

    attr.id++;

    const userSpecified = removeDataPrefix(attr.attrs);
    const data = Object.assign(defaults, userSpecified);
    return data;
  }

  async submitFeedback() {
    const {
      _textarea, _titleInput, logs, reporter, reporterData
    } = this;

    this.showLoader();
    let body = _textarea.value;
    const title = _titleInput.value;

    if (!reporter) {
      throw new Error('Reporter is not set yet!');
    }

    body += [
      '\n',
      '------------------------------------',
      `App: ${app.getName()} ${app.getVersion()}`,
      `Electron: ${process.versions.electron} (Node ${process.version})`,
      `Operating System: ${process.platform} ${process.arch} ${os.release()}`
    ].join('\n');

    let filePromises = [];
    logs.forEach(async logFile => {
      logFile = path.resolve(logFile);
      filePromises.push(fsReadFile(logFile, 'utf8'));
    });

    const logFilesArray = await Promise.all(filePromises);
    logFilesArray.forEach((file, index) => {
      this.logFiles[logs[index]] = file;
    });

    this.logsFetched = this.logs.length !== 0 ? true : this.logsFetched;
    return reporter.call(this, {
      logs: this.logFiles,
      title,
      body
    }, reporterData);
  }

  _updateContents(updatedAttr, _old, _new) {
    const selectors = {
      title: this._title,
      'title-label': this._titleLabel,
      'title-placeholder': this._titleInput,
      'textarea-label': this._textareaLabel,
      'textarea-placeholder': this._textarea,
      textarea: this._textarea,
      'button-label': this._button
    };

    const el = selectors[updatedAttr];
    if (updatedAttr.includes('placeholder')) {
      el.setAttribute('placeholder', _new);
    } else {
      el.innerText = _new;
    }
  }

  removeDataPrefix(attrs) {
    delete attrs['id'];
    for (let attr in attrs) {
      const newAttr = attr.replace(/^data-/, '');
      if (!attrs[newAttr]) { attrs[newAttr] = attrs[attr]; }
    }
    return attrs;
  }

  showLoader() {
    const { _button, _loader } = this;
    _button.classList.add('hide');
    _loader.classList.add('show');
  }

  hideLoader(error = false) {
    const { _button, _loader, loaderTexts } = this;
    _loader.classList.add('stop');
    if (error) { _loader.classList.add('error'); }
    _loader.innerHTML = error ? loaderTexts.error : loaderTexts.sucess;

    setTimeout(() => {
      _loader.classList.remove('show');
      _loader.classList.remove('stop');
      _loader.classList.remove('error');
      _loader.innerHTML = '';
      _button.classList.remove('hide');
    }, error ? 3000 : 2000);
  }

  safeHideLoader(error) {
    const { _button, _loader } = this;
    if (_loader.classList.contains('show') &&
        _button.classList.contains('hide') &&
        !_loader.classList.contains('stop')) {
      this.hideLoader(error);
    }
  }

  set removeDefaultStyles(value) {
    if (value) {
      // if called before connectedCallback
      const { templates, shadowRoot, elementConnected } = this;
      templates.remove('send-feedback');
      templates.add('send-feedback', '<style class="custom-styles"></style>');

      if (elementConnected) {
        const el = shadowRoot.querySelector('style:not(.custom-styles)');
        el.parentNode.removeChild(el);
      }
    }
  }

  get customStyles() {
    return this._customStyles;
  }

  set customStyles(value) {
    if (value) {
      const { templates, shadowRoot, elementConnected } = this;
      const el = shadowRoot.querySelector('.custom-styles');
      el.innerHTML = value;
      this._customStyles = value;

      if (elementConnected) {
        let originalContent = templates.html.get('send-feedback');
        const styleRegex = /<style class="custom-styles">.*<\/style>/;
        originalContent = originalContent.replace(styleRegex, '');
        originalContent += `<style class="custom-styles">${value}</style>`;
        templates.remove('send-feedback');
        templates.add('send-feedback', originalContent);
      }
    }
  }

  clearFeedbackForm() {
    this._titleInput.value = '';
    this._textarea.value = '';
  }

  set loaderSuccessText(text) {
    this.loaderTexts.sucess = text;
  }

  get loaderSuccessText() {
    return this.loaderTexts.sucess;
  }

  set loaderErrorText(text) {
    this.loaderTexts.error = text;
  }

  get loaderErrorText() {
    return this.loaderTexts.error;
  }

  useReporter(reporter, data = {}) {
    if (typeof reporter === 'function') {
      this.reporter = reporter;
      this.reporterData = data;
      return;
    }

    if (!defaultReporter[reporter]) {
      throw new Error('Reporter must be a function or one of the default reporter!');
    }

    this.reporter = defaultReporter[reporter];
    this.reporterData = data;
  }
}

module.exports = SendFeedback;
