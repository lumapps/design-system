# Tests E2E

## Introduction

This module covers and defines the basic functionality for tests E2E. Roughly, it works by:

-   Setting up a set of defined rules located under the rules folder
-   Later, cucumber will be in charge of executing these tests, by running all the files with the .feature extension

## Before running the tests

Before running these tests, please make sure that you have executed and that you have running:

-   `yarn storybook:React` in order to have the server up and running

## Adding tests and configurations

### Tests

In order to add test, you simply need to create one or several .feature files under the integration folder in your package.
There, you will need to follow the Gherkin standard and syntax to write these tests.

Then, just execute `yarn test:e2e` and you should be good to go.

## Rules

Here are all the available rules that we currently have:

1. Open the browser
   `Given the user opens the story {string}` - Opens the browser for the provided Story. **Important**: the story string is the URL component of the storybook URL. For example, if the URL for storybook is http://localhost:9000/?path=/story/component-card--detail-with-thumbnail the `{string}` should be `component-card--detail-with-thumbnail` - Usage: `Given the user opens the story "component-card--detail-with-thumbnail"`
2. Check if an element is present in the page
   `Then the element {string} is present` - Verifies that an element is present on the page, meaning that it is in the page's markup. The `{string}` is a css selector - Usage `Then the element ".lumx-button" is present`
3. Check if there are X occurrences of an element
   `Then {int} {string} are present` - Verifies that an element is present X times on the page, meaning that it can be found X times on the page's markup. The `{string}` is a css selector - Usage `Then 3 ".lumx-button" are present`
4. Check whether an element is displayed in a modal
   `Then the element {string} is displayed in a modal` - Verifies that an element is shown inside a modal. The `{string}` is a css selector - Usage `Then the element ".lumx-button" is displayed in a modal`
5. Check whether an element contains another element:
   `Then each {string} has a {string}` - Verifies that each of the elements for the provided key have an element for the other provided key. The `{string}` is a css selector - Usage `Then each ".lumx-dialog" has a ".lumx-button"`
6. Close the browser
   `Then the user closes the page` - Closes the browser. This should be executed as the last step of the test. - Usage `Then the user closes the page`
7. Click on an element
   `When the user clicks on the element {string}` - Triggers a click on the provided element. The `{string}` is a css selector - Usage `When the user clicks on the element ".lumx-button"`

### Test template

Here you can find a template for a Test file, that you can reuse to create your tests

```Gherkin
Feature: <Package name> - <Specific feature>
    <Feature description>

  Scenario: <Title for the scenario>
    Given I open the story "<storybook URL component>"
    ...
    Then I close the page
```
