/**
 * Browser-only test stories for Combobox (React).
 *
 * These tests require Playwright because they rely on hover events,
 * click-away detection, or secondary popover positioning.
 *
 * The majority of combobox tests run in jsdom via Combobox.test.tsx.
 */
import { Button, IconButton } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
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

// Browser-only: auto-filter test
export const AutoFilterOptions = { ...testStories.AutoFilterOptions };

// Browser-only: filter="off" test (readOnly input, opens on focus)
export const FilterOffOpenOnFocus = { ...testStories.FilterOffOpenOnFocus };

// Browser-only: select updates input (withValueOnChange decorator integration)
export const SelectOptionUpdatesInput = { ...testStories.SelectOptionUpdatesInput };

// Browser-only: hover & click-away tests
export const MouseHoverDoesNotActivateOption = { ...testStories.MouseHoverDoesNotActivateOption };
export const ClickAwayClosesPopup = { ...testStories.ClickAwayClosesPopup };
export const MouseHoverThenKeyboardNav = { ...testStories.MouseHoverThenKeyboardNav };

// Browser-only: OptionMoreInfo tests (secondary popover positioning)
export const OptionMoreInfoKeyboardHighlight = { ...testStories.OptionMoreInfoKeyboardHighlight };
export const OptionMoreInfoMouseHover = { ...testStories.OptionMoreInfoMouseHover };
export const OptionMoreInfoAriaDescribedBy = { ...testStories.OptionMoreInfoAriaDescribedBy };
