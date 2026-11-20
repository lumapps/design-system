import type { SetupStoriesOptions } from '@lumx/core/stories/types';

/** Month button labels (nested props, see the `withNestedProps` decorator). */
export const MONTH_BUTTON_ARGS = {
    'nextButtonProps.label': 'Next month',
    'previousButtonProps.label': 'Previous month',
};

/**
 * Setup DatePicker stories for a specific framework (React or Vue).
 * The framework `DatePicker` holds the shown month and the roving day: each story is an args object.
 */
export function setup({
    component: DatePicker,
    components: { GridColumn },
    decorators: { withValueOnChange, withNestedProps, withCombinations, withWrapper, withTheming },
}: SetupStoriesOptions<{
    decorators: 'withValueOnChange' | 'withNestedProps' | 'withCombinations' | 'withWrapper' | 'withTheming';
    components: { GridColumn: any };
}>) {
    const meta = {
        component: DatePicker,
        argTypes: {
            onChange: { action: true },
        },
        decorators: [withValueOnChange(), withNestedProps()],
    };

    /** Default date picker */
    const Default = {
        args: {
            defaultMonth: new Date('2023-02'),
            ...MONTH_BUTTON_ARGS,
        },
    };

    /** Demonstrate variations based on the given locale code */
    const LocalesVariations = {
        ...Default,
        decorators: [
            withCombinations({
                combinations: { sections: { key: 'locale', options: ['fr', 'en-US', 'ar', 'zh-HK', 'ar-eg'] } },
            }),
            withWrapper({ maxColumns: 5, itemMinWidth: 300 }, GridColumn),
        ],
    };

    /** Demo LumX CSS theming variables */
    const Theming = {
        args: { ...Default.args, value: new Date('2023-02-15') },
        decorators: [
            withTheming({
                values: `
            --lumx-button-border-radius: 10px;

            /////////////
            --lumx-button-emphasis-low-state-default-padding-horizontal: 1px;
            --lumx-button-emphasis-low-state-default-border-width: 1px;
            --lumx-button-emphasis-low-state-hover-padding-horizontal: 2px;
            --lumx-button-emphasis-low-state-hover-border-width: 1px;
            --lumx-button-emphasis-low-state-active-padding-horizontal: 3px;
            --lumx-button-emphasis-low-state-active-border-width: 1px;

            --lumx-button-emphasis-low-state-default-theme-light-background-color: rgb(from green r g b / 10%);
            --lumx-button-emphasis-low-state-default-theme-light-color: black;
            --lumx-button-emphasis-low-state-default-theme-light-border-color: transparent;
            --lumx-button-emphasis-low-state-hover-theme-light-background-color: rgb(from darkslategray r g b / 50%);
            --lumx-button-emphasis-low-state-hover-theme-light-color: crimson;
            --lumx-button-emphasis-low-state-hover-theme-light-border-color: transparent;
            --lumx-button-emphasis-low-state-active-theme-light-background-color: rgb(from blanchedalmond r g b / 50%);
            --lumx-button-emphasis-low-state-active-theme-light-color: firebrick;
            --lumx-button-emphasis-low-state-active-theme-light-border-color: transparent;

            /////////////
            --lumx-button-emphasis-selected-state-default-padding-horizontal: 1px;
            --lumx-button-emphasis-selected-state-default-border-width: 1px;
            --lumx-button-emphasis-selected-state-hover-padding-horizontal: 2px;
            --lumx-button-emphasis-selected-state-hover-border-width: 1px;
            --lumx-button-emphasis-selected-state-active-padding-horizontal: 3px;
            --lumx-button-emphasis-selected-state-active-border-width: 1px;

            --lumx-button-emphasis-selected-state-default-theme-light-background-color: rgb(from green r g b / 50%);
            --lumx-button-emphasis-selected-state-default-theme-light-color: green;
            --lumx-button-emphasis-selected-state-default-theme-light-border-color: currentcolor;
            --lumx-button-emphasis-selected-state-hover-theme-light-background-color: rgb(from darkslategray r g b / 50%);
            --lumx-button-emphasis-selected-state-hover-theme-light-color: crimson;
            --lumx-button-emphasis-selected-state-hover-theme-light-border-color: currentcolor;
            --lumx-button-emphasis-selected-state-active-theme-light-background-color: rgb(from blanchedalmond r g b / 50%);
            --lumx-button-emphasis-selected-state-active-theme-light-color: firebrick;
            --lumx-button-emphasis-selected-state-active-theme-light-border-color: currentcolor;

            /////////
            --lumx-text-field-input-min-height: 26px;
            --lumx-text-field-input-padding-horizontal: 5px;
            --lumx-text-field-input-border-radius: 10px;
            --lumx-text-field-state-default-input-border-top-width: 0;
            --lumx-text-field-state-default-input-border-right-width: 0;
            --lumx-text-field-state-default-input-border-bottom-width: 0;
            --lumx-text-field-state-default-input-border-left-width: 0;
            --lumx-text-field-state-default-theme-light-header-label-color: var(--lumx-color-dark-N);
            --lumx-text-field-state-default-theme-light-input-background-color: rgb(from green r g b / 10%);
            --lumx-text-field-state-default-theme-light-input-border-color: var(--lumx-color-dark-L4);
            --lumx-text-field-state-default-theme-light-input-content-color: var(--lumx-color-dark-N);
            --lumx-text-field-state-hover-input-border-top-width: 1px;
            --lumx-text-field-state-hover-input-border-right-width: 1px;
            --lumx-text-field-state-hover-input-border-bottom-width: 1px;
            --lumx-text-field-state-hover-input-border-left-width: 1px;
            --lumx-text-field-state-hover-theme-light-header-label-color: var(--lumx-color-dark-N);
            --lumx-text-field-state-hover-theme-light-input-background-color: rgb(from green r g b / 30%);
            --lumx-text-field-state-hover-theme-light-input-border-color: green;
            --lumx-text-field-state-hover-theme-light-input-content-color: var(--lumx-color-dark-N);
            --lumx-text-field-state-focus-input-border-top-width: 2px;
            --lumx-text-field-state-focus-input-border-right-width: 2px;
            --lumx-text-field-state-focus-input-border-bottom-width: 2px;
            --lumx-text-field-state-focus-input-border-left-width: 2px;
            --lumx-text-field-state-focus-theme-light-header-label-color: var(--lumx-color-dark-N);
            --lumx-text-field-state-focus-theme-light-input-background-color: rgb(from green r g b / 50%);
            --lumx-text-field-state-focus-theme-light-input-border-color: green;
            --lumx-text-field-state-focus-theme-light-input-content-color: var(--lumx-color-dark-N);
        `,
            }),
        ],
    };

    return { meta, Default, LocalesVariations, Theming };
}
