const assert = require('assert');
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
});
