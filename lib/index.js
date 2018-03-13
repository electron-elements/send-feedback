const electron = require('electron');
const { shell, remote: { app } } = electron;
const templates = require('./templates');
const AttributeManager = require('./attribute-manager');

class ReportIssue extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(templates.get('report-issue'));

    this.attr = new AttributeManager(this);
  }

  static get observedAttributes() {
    const observe = [
      'title',
      'instructions',
      'placeholder'
    ];

    // support data-* too.
    observe.forEach(attr => observe.push(`data-${attr}`));
    return observe;
  }

  attributeChangedCallback(...args) {
    this.attr.onchangeEvent(...args);
  }

  connectedCallback() {
    const { shadowRoot } = this;
    const data = this.generateData();

    templates.update('report-issue-content', data);
    shadowRoot.append(templates.get('report-issue-content'));

    const submitBtn = shadowRoot.querySelector('button');
    submitBtn.addEventListener('click', this.submitIssue.bind(this));

    this.textarea = shadowRoot.querySelector('textarea');
    this.initAttrChangeHandler(ReportIssue.observedAttributes);
    this.createProptoAttrBridge();
  }

  generateData() {
    const { attr, removeDataPrefix } = this;
    const defaults = {
      id: attr.id,
      title: 'Report issue.',
      instructions: 'Please enter detailed information' +
                    'for the issue you are facing.',
      placeholder: 'Describe your issue briefly..'
    };

    attr.id++;

    const userSpecified = removeDataPrefix(attr.attrs);
    const data = Object.assign(defaults, userSpecified);
    return data;
  }

  submitIssue() {
    const { textarea, _issueReporter } = this;
    let issue = textarea.value;

    if (_issueReporter) {
      _issueReporter.call(this, issue);
      return;
    }

    issue += [
      '\n',
      '---',
      `**App version:** ${app.getVersion()}`,
      `**Operating System:** ${process.platform}`
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
      instructions: 'label',
      placeholder: 'textarea'
    };

    const el = shadowRoot.querySelector(selectors[updatedAttr]);
    if (updatedAttr === 'placeholder') {
      attr.set('placeholder', _new);
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
    ReportIssue.observedAttributes.forEach(prop => {
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

  set issueReporter(reporter) {
    this._issueReporter = reporter;
  }

  get issueReporter() { return this._issueReporter; }
}

module.exports = ReportIssue;
module.exports.templates = templates;
