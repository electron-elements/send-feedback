const { shell } = require('electron');

function prepareFeedback(feedback) {
  let { body, title, logs } = feedback;
  for (let logFile in logs) {
    body += [
      '\n',
      `===== log file: ${logFile}  =====`,
      logs[logFile]
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

module.exports = {
  emailReporter,
  browserReporter
};
