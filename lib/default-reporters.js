'use strict';

const { shell } = require('electron');
const { EOL } = require('os');

function prepareFeedback(feedback, md = false) {
  let { body, title, logs } = feedback;
  let start = '';
  let end = '';

  if (md) {
    start = '```console' + EOL;
    end = EOL + '```';
  }

  for (let logFile in logs) {
    if (logFile === '') {
      continue;
    }

    body += [
      EOL,
      `===== log file: ${logFile}  =====`,
      start + logs[logFile] + end
    ].join(EOL);
  }

  return {
    body,
    title,
    logs
  };
}

function emailReporter(feedback, data) {
  const { title, body } = prepareFeedback(feedback);
  const { email } = data;
  if (!email) {
    throw new Error('Email is required for email reporter!');
  }

  // replace `%0A` a newline encoded charater to `%0D%0A` RFC
  // standard for new lines for email links.
  // Ref: https://stackoverflow.com/questions/10356329/mailto-link-multiple-body-lines/27447222#27447222
  let url = `mailto:${email}?subject=${encodeURIComponent(title)}` +
    `&body=${encodeURIComponent(body)}`;
  url = url.replace(/%0A/g, '%0D%0A');
  shell.openExternal(url);
}

function browserReporter(feedback, data) {
  const { title, body } = prepareFeedback(feedback);
  const defaults = {
    titleParam: 'title',
    bodyParam: 'body'
  };

  const { titleParam, bodyParam, url } = Object.assign(defaults, data);
  if (!url) {
    throw new Error('url in data is required for urlReporter!');
  }

  const reportURL = `${url}?${titleParam}=${title}&${bodyParam}=${body}`;
  this.hideLoader();
  shell.openExternal(encodeURI(reportURL));
}

function githubReporter(feedback, data) {
  const { title, body } = prepareFeedback(feedback, true);
  const { url } = data;
  if (!url) {
    throw new Error('url in data is required for githubReporter!');
  }

  const reportURL = `${url}?title=${title}&body=${body}`;
  this.hideLoader();
  shell.openExternal(encodeURI(reportURL));
}

function postRequestReporter(feedback, data) {
  const { title, body } = prepareFeedback(feedback);
  const { url, titleParam = 'title', bodyParam = 'body' } = data;
  if (!url) {
    throw new Error('url in data is required for postRequestReporter!');
  }

  const request = new Request(url, {
    method: 'POST',
    body:
    `${titleParam}=${encodeURIComponent(title)}&${bodyParam}=${encodeURIComponent(body)}`,
    headers: new Headers({
      'Content-Type': 'x-www-form-urlencoded'
    })
  });

  fetch(request).then((response) => {
    if (!response.ok) {
      throw new Error('Posting request failed!');
    }

    this.hideLoader();
  }).catch((err) => {
    this.hideLoader(true);
    throw err;
  });
}

module.exports = {
  emailReporter,
  browserReporter,
  githubReporter,
  postRequestReporter,
  prepareFeedback
};
