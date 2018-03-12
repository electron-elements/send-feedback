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
    observe.push('data-id');
    return observe;
  }

  attributeChangedCallback(...args) {
    this.attr.onchangeEvent(...args);
  }

  connectedCallback() {
    const { shadowRoot } = this;
    const data = this.generateData();

    templates.update('report-issue-content', data);
    shadowRoot.appendChild(templates.get('report-issue-content'));
  }

  generateData() {
    const { attr, removeDataPrefix } = this;
    const defaults = {
      id: attr.id,
      title: 'Report issue.',
      instructions: 'Please enter detailed information for the issue you are facing.',
      placeholder: 'Describe your issue briefly..'
    }

    attr.id++;
    
    const userSpecified = removeDataPrefix(attr.attrs);
    const data = Object.assign(defaults, userSpecified);
    console.log(userSpecified, data);
    return data;
  }

  removeDataPrefix(attrs) {
    delete attrs['id'];
    for (let attr in attrs) {
      const newAttr = attr.replace(/^data-/, '');
      if (!attrs[newAttr]) { attrs[newAttr] = attrs[attr]; }
    }
    return attrs;
  }
}

if (customElements.get('report-issue') === undefined) {
  customElements.define('report-issue', ReportIssue);
}

window.reportIssue = document.querySelector('report-issue');
module.exports = ReportIssue;
