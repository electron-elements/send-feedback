# send-feedback

This electron-element, custom element designed to work for electron apps, 
is can be used to send feedback from webapp to a website.
Currently this works well for reporting issue to github's issue tracker.
But you can have simple website up that takes a report passed through `?body` url parameter.

## usage

Requiring this would export a class that you will need to register as a custom elements.
```javascript
const SendFeedback = require('send-feedback');
customElements.define('send-feedback', SendFeedback);
```

By default this has responsive design out of the box. But if you want to customize the
element's css styles you can do something like:
```javascript
const sendFeedback = document.querySelector('send-feedback');
sendFeedback.customStyles = `* { padding: 20px }`;
```

to remove defaults styles you can do `sendFeedback.removeDefaultStyles = true`;

or if you have couple of them (maybe for reporting issue and other just for general feedback)
and you want to remove default styling and/or update custom css style before creating/upgrading
the element you can do set the properties on the `SendFeedback` class exported:
```javascript
// this will reflect down to the element from constructor
SendFeedback.customStyles = "* { color: rebeccapurple; }"

// to remove default styles
SendFeedback.removeDefaultStyles = true;
```
