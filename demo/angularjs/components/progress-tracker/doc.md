# Progress tracker

**Progress tracker convey user progress through a sequence of steps.**
A step can be completed by a helper text.

## States

There are four states: _Current_, _Future_, _Completed_, and _Error_.

<demo-block component="progress-tracker" partial="stepper" has-theme-switcher="false"></demo-block>

### Current

<demo-block component="progress-tracker" partial="current" has-theme-switcher="false"></demo-block>

### Future

<demo-block component="progress-tracker" partial="future" has-theme-switcher="false"></demo-block>

### Completed

<demo-block component="progress-tracker" partial="completed" has-theme-switcher="false"></demo-block>

### Future with helper

<demo-block component="progress-tracker" partial="helper" has-theme-switcher="false"></demo-block>

### Error

When an error occurs, the error message can replace the helper text. If there is no helper text, the error message is not displayed.

<demo-block component="progress-tracker" partial="error" has-theme-switcher="false"></demo-block>
