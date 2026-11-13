/**
 * Browser-only test stories for the DatePicker and the DatePickerField (React).
 *
 * The other date picker tests run in jsdom via DatePicker.test.tsx.
 */
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { setup } from '@lumx/core/js/components/DatePicker/TestStories';

import { DatePicker } from './DatePicker';
import { DatePickerField } from './DatePickerField';

const { meta, ...testStories } = setup({
    components: { DatePicker, DatePickerField },
    decorators: { withValueOnChange },
});

export default {
    title: 'LumX components/date-picker/DatePicker/Tests',
    ...meta,
};

export const DialogTabOrder = { ...testStories.DialogTabOrder };
export const DialogClose = { ...testStories.DialogClose };
export const KeyboardMonthEdges = { ...testStories.KeyboardMonthEdges };
export const KeyboardRangeEdges = { ...testStories.KeyboardRangeEdges };
export const TypedInput = { ...testStories.TypedInput };
export const EmptyTextWithoutClearButton = { ...testStories.EmptyTextWithoutClearButton };
export const EmptyTextWithClearButton = { ...testStories.EmptyTextWithClearButton };
export const CalendarGridLayout = { ...testStories.CalendarGridLayout };
export const AccessibilityOpenDialog = { ...testStories.AccessibilityOpenDialog };
export const AccessibilityStandalone = { ...testStories.AccessibilityStandalone };
