const assert = require('assert');
const { remote: { app } } = require('electron');
const SendFeedback = require('../lib');

customElements.define('send-feedback', SendFeedback);
const sendFeedback = document.createElement('send-feedback');
document.body.appendChild(sendFeedback);

describe('send-feedback', () => {
  const title = sendFeedback.shadowRoot.querySelector('.title');
  const titleInput = sendFeedback._titleInput;
  const titleLabel = titleInput.previousElementSibling;
  const textarea = sendFeedback._textarea;
  const textareaLabel = textarea.previousElementSibling;
  const submitBtn = sendFeedback.shadowRoot.querySelector('button');

  function getElement(selector) {
    const { shadowRoot } = sendFeedback;
    let element;
    switch (selector) {
      case 'title':
        element = shadowRoot.querySelector('div.title');
        break;
      case 'title-label':
      case 'titleLabel':
        element = shadowRoot.querySelector('label');
        break;
      case 'title-placeholder':
      case 'titlePlaceholder':
        element = shadowRoot.querySelector('input');
        break;
      case 'textarea-label':
      case 'textareaLabel':
        element = shadowRoot.querySelector('label:nth-of-type(2)');
        break;
      case 'textarea-placeholder':
      case 'textareaPlaceholder':
        element = shadowRoot.querySelector('textarea');
        break;
      case 'button-label':
      case 'buttonLabel':
        element = shadowRoot.querySelector('button');
    }

    return element;
  }

  it('should have default set correctly', () => {
    assert.deepStrictEqual(title.innerText, 'Send Feedback');
    assert.deepStrictEqual(titleLabel.innerText, 'Title');
    assert.deepStrictEqual(titleInput.getAttribute('placeholder'), 'Enter a title');
    assert.deepStrictEqual(textareaLabel.innerText,
      'Send us your experience with this app:');
    assert.deepStrictEqual(textarea.getAttribute('placeholder'),
      'Write your feedback...');
    assert.deepStrictEqual(submitBtn.innerText, 'Send Feedback');
  });

  it('should update the element if attribute/property is set', () => {
    const changeText = 'changedByAttributes';
    const propChangeText = 'changedByProps';
    const propsToChange = [];
    const attrsToChange = [
      'title',
      'title-label',
      'title-placeholder',
      'textarea-label',
      'textarea-placeholder',
      'button-label'
    ];

    attrsToChange.forEach(attr => {
      attrsToChange.push(`data-${attr}`);
      if (!attr.includes('-')) {
        propsToChange.push(attr);
        return;
      }

      const latter = attr.match(/-(.)/)[1].toUpperCase();
      propsToChange.push(attr.replace(/-./, latter));
    });

    function check(selector, text) {
      const el = getElement(selector);
      if (selector.includes('placeholder')) {
        const placeholder = el.getAttribute('placeholder');
        assert.deepStrictEqual(placeholder, text);
        return;
      }

      assert.deepStrictEqual(el.innerText, text);
    }

    attrsToChange.forEach(attr => {
      sendFeedback.setAttribute(attr, changeText);
      attr = attr.replace(/^data-/, '');
      check(attr, changeText);
    });

    propsToChange.forEach((prop, index) => {
      sendFeedback[prop] = propChangeText;
      check(attrsToChange[index], propChangeText);
    });
  });

  it('removes defaultStyles when set to true', () => {
    sendFeedback.removeDefaultStyles = true;
    const styles = sendFeedback.shadowRoot.querySelectorAll('style');
    assert.deepStrictEqual(styles.length, 1);
  });

  it('adds custom css when customStyles property is set', () => {
    const styleToAdd = 'change { color: blue; }';
    const customStyleEl = sendFeedback.shadowRoot.querySelector('.custom-styles');

    assert.deepStrictEqual(customStyleEl.innerText, '');
    sendFeedback.customStyles = styleToAdd;
    assert.deepStrictEqual(customStyleEl.innerText, styleToAdd);
  });

  it('reporters should works as expected', async() => {
    const title = getElement('title-placeholder');
    const textarea = getElement('textarea-placeholder');
    const customData = {
      testing: true
    };

    let reporterCalled = false;
    function customReporter(feedback, data) {
      const expectedFeedback = {
        title: title.value,
        body: 'changed\n\n' +
              '------------------------------------\n' +
              `App version: ${app.getVersion()}\n` +
              `Operating System: ${process.platform}`,
        logs: {}
      };

      reporterCalled = true;
      for (let prop in feedback) {
        assert.deepStrictEqual(feedback[prop], expectedFeedback[prop]);
      }

      assert.deepEqual(customData, data);
    }

    title.value = 'changed';
    textarea.value = 'changed';
    sendFeedback.useReporter(customReporter, customData);
    await sendFeedback.submitFeedback();

    assert(reporterCalled);
  });

  it('does validation before calling reporter', () => {
    const title = getElement('title-placeholder');
    const titleLabel = getElement('title-label');
    const textarea = getElement('textarea-placeholder');
    const textareaLabel = getElement('textarea-label');
    const submitBtn = getElement('button-label');

    title.value = '';
    textarea.value = '';
    submitBtn.click();

    assert(titleLabel.classList.contains('error'));
    assert(textareaLabel.classList.contains('error'));
  });
});
