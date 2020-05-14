# send-feedback
`<send-feedback>` is a electron element. It is a quick way to
embed the send feedback functionality quickly in your app.

You can look at the example app by running `npm i && npm start`
after cloning the repo to see how it works.

## Usage

The module exports a `SendFeedback` class that you need to define as a
custom element. You also have the flexibilty to choose the tag name.
```javascript
const SendFeedback = require('@electron-elements/send-feedback');
customElements.define('send-feedback', SendFeedback);
```

By default, the element has responsive design out of the box. But if you want to customize
the design of the element you can do:
```javascript
const sendFeedback = document.querySelector('send-feedback');
sendFeedback.customStyles = `* { padding: 20px }`;
```

To remove default styles you can do `sendFeedback.removeDefaultStyles = true`. **Note:** This
will remove all the styles we ship with this custom elements, which most of the times is not needed,
because you can add custom css to tweak some design as show above.

Once you feel like designs are in place or you like the default design.
You need to use a `reporter` by calling `sendFeedback.useReporter`, for this example we use
the `githubReporter` and `emailReporter`. A reporter is what gets called when the submit/send button is clicked.
There are three default reporter documented [here](reporters.md) which also allows you send feedback
to your server if you wish. And, if you want to write your own reporter
check out the documentation [here](reporters.md#custom-reporter)

```javascript
sendFeedback.userReporter('githubReporter', {
  url: 'https://github.com/priyankp10/send-feedback/issues/new'
});

// or use the email reporter
sendFeedback.userReporter('emailReporter', {
  email: 'my_email@priyankp10.github.io'
});
```

Now when the submit button is clicked it works as expected.

### Events

This are the event triggered by the `<send-feedback>` element. Note that currently all
the events are browser events and not node's event emitters. so you need to use:

```javascript
sendFeedback.addEventListener('<event>', ...);
```

#### `feedback-submitted`

This event is only triggered when feedback is submitted, meaning when a reporter
is done executing without throwing an error.


