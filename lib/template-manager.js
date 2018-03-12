class TemplateManager {
  constructor() {
    this.templates = {};
    this.htmlTemplates = {};
  }

  add(name, html) {
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
    this.htmlTemplates[name] = htmlTemplate;
  }

  remove(name) {
    this.templates[name] = undefined;
  }

  removeAll() {
    this.templates = {};
  }
}

module.exports = TemplateManager;
