const electron = require('electron');
const { shell, remote: { app } } = electron;
const templates = require('./templates');
const AttributeManager = require('./attribute-manager');

class SendFeedback extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(templates.get('send-feedback'));

    this.attr = new AttributeManager(this);
    this.templates = templates;
    this.elementConnected = false;

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
      'textarea'
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
    submitBtn.addEventListener('click', this.submitIssue.bind(this));

    this.textarea = shadowRoot.querySelector('textarea');
    this.initAttrChangeHandler(SendFeedback.observedAttributes);
    this.createProptoAttrBridge();
  }

  generateData() {
    const { attr, removeDataPrefix } = this;
    const defaults = {
      id: attr.id,
      title: 'Send feedback',
      'title-label': 'Title',
      'title-placeholder': 'Enter title',
      'textarea-label': 'Send us your experience with this app: ',
      'textarea-placeholder': 'Write your feedback...'
    };

    attr.id++;

    const userSpecified = removeDataPrefix(attr.attrs);
    const data = Object.assign(defaults, userSpecified);
    return data;
  }

  submitIssue() {
    const { textarea } = this;
    let issue = textarea.value;

    issue += [
      '\n',
      '------------------------------------',
      `App version: ${app.getVersion()}`,
      `Operating System: ${process.platform}`
    ].join('\n');

    const issueLink = `${this.reportIssueURL}?body=` +
                      encodeURIComponent(issue);
    shell.openExternal(issueLink);
  }

  initAttrChangeHandler(attributes) {
    this.attr.onchange(attributes, (...args) => {
      this.updateContents(...args);
    });
  }

  updateContents(updatedAttr, _old, _new) {
    const { shadowRoot, attr } = this;
    const selectors = {
      title: '.title',
      'title-label': 'label[for^="title-label"]',
      'title-input': 'input',
      'title-placeholder': 'input',
      'textarea-label': 'label[for^="textarea-label"]',
      'textarea-placeholder': 'textarea',
      textarea: 'textarea'
    };

    const el = shadowRoot.querySelector(selectors[updatedAttr]);
    if (updatedAttr.includes('placeholder')) {
      attr.set(attr, _new);
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
}

module.exports = SendFeedback;
