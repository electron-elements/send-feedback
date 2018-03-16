const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const electron = require('electron');
const { app } = electron.remote;
const templates = require('./templates');
const AttributeManager = require('./attribute-manager');
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

    // css props
    const cssPropBridge = ['removeDefaultStyles', 'customStyles'];
    cssPropBridge.forEach(prop => {
      this[prop] = SendFeedback[prop];
    });
  }

  static get observedAttributes() {
    const observe = [
      'title',
      'title-label',
      'title-input',
      'title-placeholder',
      'textarea-label',
      'textarea-placeholder',
      'button-label'
    ];

    // support data-* too.
    observe.forEach(attr => observe.push(`data-${attr}`));
    return observe;
  }

  attributeChangedCallback(...args) {
    this.attr.onchangeEvent(...args);
  }

  connectedCallback() {
    const { shadowRoot, templates } = this;
    const data = this.generateData();

    templates.update('send-feedback-content', data);
    shadowRoot.append(templates.get('send-feedback-content'));
    this.elementConnected = true;

    const submitBtn = shadowRoot.querySelector('button');
    const submitFeedback = this.submitFeedback.bind(this);
    submitBtn.addEventListener('click', () => {
      const { _textarea, _titleInput } = this;
      let inputSafe = true;
      [_textarea, _titleInput].forEach(el => {
        if (el.value === '') {
          const label = el.previousElementSibling;
          label.classList.add('error');
          el.classList.add('error');
          label.innerText += ' (required)';

          inputSafe = false;
        }
      });

      if (inputSafe) {
        submitFeedback()
          .catch(err => {
            throw err;
          });
      }
    });

    this._textarea = shadowRoot.querySelector('textarea');
    this._titleInput = shadowRoot.querySelector('input');
    this.initAttrChangeHandler(SendFeedback.observedAttributes);
    this.createProptoAttrBridge();

    function recheckErrorClass() {
      if (this.value !== '') {
        const label = this.previousElementSibling;
        label.classList.remove('error');
        this.classList.remove('error');

        label.innerText = label.innerText.replace(/\s\(required\)$/, '');
      }
    }

    this._textarea.addEventListener('input', recheckErrorClass);
    this._titleInput.addEventListener('input', recheckErrorClass);
  }

  generateData() {
    const { attr, removeDataPrefix } = this;
    const defaults = {
      id: attr.id,
      title: 'Send feedback',
      'title-label': 'Title',
      'title-placeholder': 'Enter title',
      'textarea-label': 'Send us your experience with this app: ',
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

    let body = _textarea.value;
    const title = _titleInput.value;

    if (!reporter) {
      throw new Error('Reporter is not set yet!');
    }

    body += [
      '\n',
      '------------------------------------',
      `App version: ${app.getVersion()}`,
      `Operating System: ${process.platform}`
    ].join('\n');

    const logFiles = {};
    let filePromises = [];
    logs.forEach(async logFile => {
      logFile = path.resolve(logFile);
      filePromises.push(fsReadFile(logFile, 'utf8'));
    });

    const logFilesArray = await Promise.all(filePromises);
    logFilesArray.forEach((file, index) => {
      logFiles[logs[index]] = file;
    });

    reporter.call(this, {
      logs: logFiles,
      title,
      body
    }, reporterData);
  }

  initAttrChangeHandler(attributes) {
    this.attr.onchange(attributes, (...args) => {
      this.updateContents(...args);
    });
  }

  updateContents(updatedAttr, _old, _new) {
    const { shadowRoot } = this;
    const selectors = {
      title: '.title',
      'title-label': 'label[for^="title-label"]',
      'title-input': 'input',
      'title-placeholder': 'input',
      'textarea-label': 'label[for^="textarea-label"]',
      'textarea-placeholder': 'textarea',
      textarea: 'textarea',
      'button-label': 'button'
    };

    const el = shadowRoot.querySelector(selectors[updatedAttr]);
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

  createProptoAttrBridge() {
    // create a bridge that calls updateContents of
    // property is change instead of attribute
    const { observedAttributes } = SendFeedback;

    // support title-placeholder as titlePlaceholder
    observedAttributes.forEach(attr => {
      if (attr.includes('-')) {
        const latter = attr.match(/-(.)/)[1].toUpperCase();
        observedAttributes.push(attr.replace(/-./, latter));
      }
    });

    observedAttributes.forEach(prop => {
      /* eslint-disable-next-line accessor-pairs */
      Object.defineProperty(this, prop, {
        set(value) {
          prop = prop.replace(/^data-/, '');
          if (/[A-Z]/.test(prop)) {
            const upperCaseLatter = prop.match(/([A-Z]){1}/)[1];
            prop = prop.replace(upperCaseLatter, `-${upperCaseLatter.toLowerCase()}`);
          }

          const oldValue = this[prop];
          this.updateContents(prop, oldValue, value);
        }
      });
    });
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
        let originalContent = templates.htmlTemplates['send-feedback'];
        const styleRegex = /<style class="custom-styles">.*<\/style>/;
        originalContent = originalContent.replace(styleRegex, '');
        originalContent += `<style class="custom-styles">${value}</style>`;
        templates.remove('send-feedback');
        templates.add('send-feedback', originalContent);
      }
    }
  }

  useReporter(reporter, data) {
    if (!data) {
      throw new Error('data needs to passed in as second parameter for reporter.');
    }

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
