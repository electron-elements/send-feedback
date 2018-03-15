# reporters
Reporter are the way the actual feedback is sent. It only called if the input is valid.

## Default reporters

#### `emailReporter`

This reporter will open up the email app and have it ready to be sent to address
you will specify.

Use [`emailReporter.useReporter`](methods.md#useReporter) to register a reporter.
For data property this repoter just needs the email to be specifed:

```javascript
sendFeedback.useReporter('emailReporter', {
  email: '<your-support-email-address>'
});
```

#### `browserReporter`

This will open up the url passed in to browser by passing body, title as parameter.
```javascript
sendFeedback.useReporter('browserReporter', {
  url: 'https://example.com',
  titleParam: 'title', // optional, default is title
  bodyParam: 'body' //  optional, default is body
});
```

### `githubReporter`

This will open up the browser to issue tracker. The title, body will be set and
log will be markdowned.
```javascript
sendFeedback.useReporter('githubReporter', {
  url: 'https://github.com/<username>/<repo>/issues/new'
});
```

# custom reporter
You can pass a function to be used as a reporter. The function will be called with
and object.
```javascript
{
  title, // title the user entered
  body,  // body user entered
  logs // pre read logs as filename and file content
}
```

Note: the filename if the path passed into the `sendFeedback.logs` array.
see [documentation of logs for more info.](methods.md#logs)


