# send-feedback
`<send-feedback>` is a electron element. It will provide a quick way to
embed and send feedback functionality quickly and as easily on electron side of
code.

You can look at the example app by running `npm i && npm start`
after cloning the repo to see how it works.

## Usage

Requiring this would export a class that you will need to register as a custom element.
Doing this would give you a css designed but not yet working element:
```javascript
const SendFeedback = require('@electron-elements/send-feedback');
customElements.define('send-feedback', SendFeedback);
```

By default, this has responsive design out of the box. But if you want to customize the
element's css styles you can do something like:
```javascript
const sendFeedback = document.querySelector('send-feedback');
sendFeedback.customStyles = `* { padding: 20px }`;
```

to remove defaults styles you can do `sendFeedback.removeDefaultStyles = true`;

Once you feel like designs are in place or you like the default designs.
You need to use a `reporter` by calling `sendFeedback.useReporter`, for this example lets use
the `githubReporter`. A reporter is what gets called when the submit/send button is clicked.
There are three default reporter documented [here](reporters.md) or if you want to use a function
you can see the documentation [here](reporters.md#custom-reporter)

```javascript
sendFeedback.userReporter('githubReporter', {
  url: 'https://github.com/cPhost/send-feedback/issues/new'
});

// or use the email reporter
sendFeedback.userReporter('emailReporter', {
  email: 'my_email@cPhost.github.io'
});
```

Now when the submit button is clicked it works as expected.
