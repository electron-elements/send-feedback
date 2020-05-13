# customizing

This documentation section  will guide you through the process,
of how to customize the `<send-feedback>` element. The one of the great
feature of custom elements.

### Title

The title of an element, the default is `Send Feedback`
It can be changed by setting `title` attribute or property to a new title.

### Title Label

The label for the title input, the default is `Title` 
It can be changed by setting the `title-label` attribute or `titleLabel` property.

### Title Placeholder

The placeholder of title input, the default is `Enter title`.
It can be changed by setting `title-placeholder` or `titlePlaceholder` property.

### Textarea Label

The textarea input, the default label is `Send us your experience with this app:`.
It can be changed by setting `textarea-label` or `textareaLabel` property.

### Textarea Placeholder

The placeholder of textarea input, the default is `Write your feedback...`.
It can be changed by setting `textarea-placeholder` or `textareaPlaceholder` property.

### Button Label

The text of submit button. the default is `Send Feedback`.
It can be changed by setting `button-label` or `buttonLabel` property.


### Cancel button
If you use this element as a modal and wish to have a cancel button in
the UI set the `showCancelButton` property to true or use `show-cancel-button` attribute.
Then, when a user clicks the cancel button, we will emit a `feedback-cancelled`
event so you can update your UI accordingly. See the [events section](./index.md#events)
on how to setup a event listener to catch the event.

### Cancel Button Label

The text of cancel button, the default is `Cancel`.
It can be changed by setting `cancel-label` or `cancelButton` property.
