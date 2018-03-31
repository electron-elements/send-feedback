# send-feedback 
[![npm](https://img.shields.io/npm/v/@electron-elements/send-feedback.svg?style=flat-square)](https://npmjs.org/package/@electron-elements/send-feedback)
[![Travis](https://img.shields.io/travis/electron-elements/send-feedback.svg?style=flat-square)](https://travis-ci.org/electron-elements/send-feedback)
[![Greenkeeper badge](https://img.shields.io/badge/Greenkeeper-enabled-blue.svg?style=flat-square)](https://greenkeeper.io/)

This [electron-element](https://github.com/electron-elements/electron-elements#electron-elements) can be used to 
send feedback from an electron app to a website. Currently this works well for reporting 
issue to github's issue tracker, or any website that could accept user input sent from the app

## Install

```bash
npm i --save @electron-elements/send-feedback
```

## Usage

Basic Usage:
```javascript
const SendFeedback = require('@electron-elements/send-feedback');
customElements.define('send-feedback', SendFeedback);

const sendFeedback = document.createElement('send-feedback');
document.body.appendChild(sendFeedback);
```

This will have basic UI, ready to go see demo app by running `npm i && npm start`. 
You just need to configure a reporter to use and done. You now have send feedback 
functionality in your app. And once you have time you can totally modify the whole element's
css and text.

The default design of this element:
<p align="center">
  <img src="send-feedback.png" alt="send feedback design" />
</p>

See the [docs for usage and documentation to customize your send feedback element.](/docs)

## Changelog

See releases page it will contains all the [changelogs and info about new releases.](https://github.com/electron-elements/send-feedback/releases) 

Do you have an electron element you want to add to this org? 
If so follow this guide at [electron-elements repo](https://github.com/electron-elements/electron-elements/blob/master/guides/add-an-electron-element-to-org.md)
