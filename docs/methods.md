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

#### `loaderSuccessText`
* default `✔ Feedback sent.`

The text of loader when the reporter is successful in doing it's job.

#### `loaderErrorText`
* default `❌ Error sending feedback! try again..`

The text of loader when the reporter fails in doing it's job.

#### `useReporter(function || reporter, reporterData)`
* function or reporter - This parameter must be a function of one of the
[default reporter](reporters.md).
* reporterData - could be anything that will be passed to reporter. Default reporter
use objects. (This might change in future)

You can pass in custom reporter that will be called with logs, body and title.
logs are formatted as `{ filepath: fileContent }` filepath is whatever was pushed to [`logs`](#logs)

For customizing elements see [customizing send-feedback element](customize.md), it can be customized
by setting attribute or by properties on element.

#### `showLoader()`

This will show a loader with text specified in [`loaderSuccessText`](#loadersuccesstext).

#### `hideLoader(error)`
* error - Show error loader [optional] default is false.

This will show a loader with text specifedi in [`loaderErrorText`](#loadererrortext).

#### `safeHideLoader(error)`
* error - Show error loader [optional] default is false.

#### `clearFeedbackForm()`
This will clear the title input, and feedback textarea. This is called only when a reporter is successful.

This will only hide loader if needed to be.
