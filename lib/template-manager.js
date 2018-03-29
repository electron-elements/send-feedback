'use strict';

class TemplateManager {
  constructor() {
    this.templates = {};
    this.htmlTemplates = {};
  }

  add(name, html) {
    if (this.templates[name]) {
      throw new Error('Cannot add template already added!');
    }

    const template = document.createElement('template');
    template.innerHTML = html;
    this.templates[name] = template;
    this.htmlTemplates[name] = html;
  }

  get(name) {
    const template = this.templates[name];
    return template.content.cloneNode(true);
  }

  update(name, data) {
    let htmlTemplate = this.htmlTemplates[name];
    for (let key in data) {
      const value = data[key];
      const regex = new RegExp(`{{ *${key} *}}`, 'mg');
      htmlTemplate = htmlTemplate.replace(regex, value);
    }

    this.templates[name].innerHTML = htmlTemplate;
  }

  remove(name) {
    delete this.templates[name];
    delete this.htmlTemplates[name];
  }
}

module.exports = TemplateManager;
