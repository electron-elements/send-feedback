# Methods
This is documentation for all the methods on the `send-feedback` element.

#### `logs`

This is array by default, if you want to attach logs to body you can push the
file path to this array.

#### `removeDefaultStyles`

A property if set to true, will remove the default styles. Will be inherited from 
class exported if set to `true`.

#### `customStyles`

A property that you can set to add custom css.

#### `useReporter`

`useReporter(function)` or
`useReporter(string, data)`

You can pass in custom reporter that will be called with logs, body and title.
logs are formatted as `{ filepath: fileContent }` filepath is whatever was pushed to [`logs`](#logs)

For customizing elements see [customizing send-feedback element](customize.md), it can be customized
by setting attribute or by properties on element.
