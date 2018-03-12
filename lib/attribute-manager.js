class AttributeManager {
  constructor(el) {
    this.el = el;
    this.id = 0;
    this._attrs = {};
    this._onchangeData = {};
  }

  has(name) {
    this.checkAttrs();
    return this.el.hasAttribute(name);
  }

  set(name, value = '') {
    this.el.setAttribute(name, value);
    this.checkAttrs();
  }

  get attrs() {
    this.checkAttrs();
    return this._attrs;
  }

  checkAttrs() {
    for (let attr of this.el.attributes) {
      this._attrs[attr.name] = attr.value;
    }
  }

  onchange(attrs, func) {
    const { id } = this;
    this._onchangeData[id] = {
      attrs,
      func
    };

    this.id++;
  }

  onchangeEvent(attr, oldValue, newValue) {
    // remove data- if present since we support both versions!
    attr = attr.replace(/^data-/, '');

    for (let data in this._onchangeData) {
      const { attrs, func } = this._onchangeData[data];

      // works for both string and arrays
      if (attrs.includes(attr)) {
        func(oldValue, newValue);
      }
    }
  }
}

module.exports = AttributeManager;
