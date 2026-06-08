/**
 * Browser-only test stories for Combobox (Vue).
 *
 * These tests require Playwright because they rely on hover events,
 * click-away detection, or secondary popover positioning.
 *
 * The majority of combobox tests run in jsdom via Combobox.test.ts.
 */
import { Button, IconButton } from '@lumx/vue';
import { withValueOnChange } from '@lumx/vue/stories/decorators/withValueOnChange';
import { setup } from '@lumx/core/js/components/Combobox/TestStories';

import { Combobox } from '.';

const { meta, ...testStories } = setup({
    components: {
        Combobox,
        IconButton,
        Button,
    },
    decorators: { withValueOnChange },
});

export default {
    title: 'LumX components/combobox/Combobox/Tests',
    ...meta,
};

// Browser-only: hover & click-away tests
export const MouseHoverDoesNotActivateOption = { ...testStories.MouseHoverDoesNotActivateOption };
export const ClickAwayClosesPopup = { ...testStories.ClickAwayClosesPopup };
export const MouseHoverThenKeyboardNav = { ...testStories.MouseHoverThenKeyboardNav };

// Browser-only: OptionMoreInfo tests (secondary popover positioning)
export const OptionMoreInfoKeyboardHighlight = { ...testStories.OptionMoreInfoKeyboardHighlight };
export const OptionMoreInfoMouseHover = { ...testStories.OptionMoreInfoMouseHover };
export const OptionMoreInfoAriaDescribedBy = { ...testStories.OptionMoreInfoAriaDescribedBy };

// Browser-only: button-trigger keyboard-open navigation (options unmounted while closed,
// so opening + navigating must be deferred until the options commit — needs a real browser).
export const ButtonTypeaheadFromClosed = { ...testStories.ButtonTypeaheadFromClosed };
export const ButtonTypeaheadWhileOpen = { ...testStories.ButtonTypeaheadWhileOpen };
export const ButtonEndFromClosed = { ...testStories.ButtonEndFromClosed };
export const ButtonHomeFromClosed = { ...testStories.ButtonHomeFromClosed };
export const ButtonArrowDownFromClosed = { ...testStories.ButtonArrowDownFromClosed };
