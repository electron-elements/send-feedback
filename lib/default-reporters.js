const { shell } = require('electron');

function prepareFeedback(feedback, md = false) {
  let { body, title, logs } = feedback;
  let start = '';
  let end = '';

  if (md) {
    start = '```console\n';
    end = '\n```';
  }

  for (let logFile in logs) {
    body += [
      '\n',
      `===== log file: ${logFile}  =====`,
      start + logs[logFile] + end
    ].join('\n');
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

  const url = `mailto:${email}?subject=${title}&body=${body}`;
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
  shell.openExternal(encodeURI(reportURL));
}

function githubReporter(feedback, data) {
  const { title, body } = prepareFeedback(feedback, true);
  const { url } = data;
  if (!url) {
    throw new Error('url in data is required for githubReporter!');
  }

  const reportURL = `${url}?title=${title}&body=${body}`;
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

  this.showLoader();
  fetch(request).then((response) => {
    console.log(response);
    if (!response.ok) {
      throw new Error('Posting request failed!');
    }

    this.hideLoader();
  }).catch(() => {
    this.hideLoader(true);
  });
}

module.exports = {
  emailReporter,
  browserReporter,
  githubReporter,
  postRequestReporter
};
