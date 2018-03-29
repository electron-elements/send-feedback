const assert = require('assert');
const SendFeedback = require('../lib');

customElements.define('send-feedback', SendFeedback);
const sendFeedback = document.createElement('send-feedback');
document.body.appendChild(sendFeedback);

describe('send-feedback', () => {
  const {
    _title: title,
    _titleInput: titleInput,
    _titleLabel: titleLabel,
    _textarea: textarea,
    _textareaLabel: textareaLabel,
    _button: submitBtn
  } = sendFeedback;

  function getElement(selector) {
    let element;
    switch (selector) {
      case 'title':
        element = title;
        break;
      case 'title-label':
      case 'titleLabel':
        element = titleLabel;
        break;
      case 'title-placeholder':
      case 'titlePlaceholder':
        element = titleInput;
        break;
      case 'textarea-label':
      case 'textareaLabel':
        element = textareaLabel;
        break;
      case 'textarea-placeholder':
      case 'textareaPlaceholder':
        element = textarea;
        break;
      case 'button-label':
      case 'buttonLabel':
        element = submitBtn;
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
    assert.deepStrictEqual(sendFeedback.loaderSuccessText, '&#10004; Feedback sent.');
    assert.deepStrictEqual(sendFeedback.loaderErrorText,
      '&#10060; Error sending feedback! try again..');
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
    let feedbackSubmittedEventCalled = false;
    function customReporter(feedback, data) {
      const expectedFeedback = {
        title: title.value,
        logs: {}
      };

      reporterCalled = true;
      for (let prop in expectedFeedback) {
        assert.deepStrictEqual(feedback[prop], expectedFeedback[prop]);
      }

      assert.deepEqual(customData, data);
    }

    sendFeedback.addEventListener('feedback-submitted', () => {
      feedbackSubmittedEventCalled = true;
    });

    title.value = 'changed';
    textarea.value = 'changed';
    sendFeedback.useReporter(customReporter, customData);
    await sendFeedback._onSubmitFeedback();

    assert(reporterCalled);
    assert(feedbackSubmittedEventCalled);
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

  it('does not spam (required) to label', () => {
    const {
      _titleInput: titleInput,
      _textarea: textarea,
      _textareaLabel: textareaLabel,
      _titleLabel: titleLabel,
      _button: submitBtn
    } = sendFeedback;

    titleInput.value = '';
    textarea.value = '';
    submitBtn.click();
    submitBtn.click();

    [titleLabel, textareaLabel].forEach((el) => {
      const totalRequires = el.innerText.match(/\(required\)/g);
      assert.deepStrictEqual(totalRequires.length, 1);
    });
  });

  it('should remove error class and (required) from label when input is valid', () => {
    const {
      _titleInput: titleInput,
      _textarea: textarea,
      _textareaLabel: textareaLabel,
      _titleLabel: titleLabel
    } = sendFeedback;

    titleInput.value = 'title';
    textarea.value = 'textarea';

    // dispatch input event to trigger validation
    const inputEvent = new Event('input', { bubbles: false, cancelable: false });
    titleInput.dispatchEvent(inputEvent);
    textarea.dispatchEvent(inputEvent);

    assert.deepStrictEqual(titleLabel.classList.contains('error'), false);
    assert.deepStrictEqual(textareaLabel.classList.contains('error'), false);
  });

  it('should clear the from out when clearFeedbackForm is called', () => {
    sendFeedback.clearFeedbackForm();
    assert.deepStrictEqual(titleInput.value, '');
    assert.deepStrictEqual(textarea.value, '');
  });
});
