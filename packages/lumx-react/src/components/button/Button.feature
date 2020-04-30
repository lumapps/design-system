Feature: Button features
  Scenario: Display the list of suggestions
    Given the user opens the story "lumx-components-button--simple-button"
    Then the element ".lumx-button--color-primary" is present
    Then the user closes the page 