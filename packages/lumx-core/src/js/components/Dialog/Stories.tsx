import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { DIALOG_TRANSITION_DURATION } from '@lumx/core/js/constants';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import { Size } from '../../constants';
import { DEFAULT_PROPS } from '.';

const CLOSE_MODES = ['hide', 'unmount'];
const dialogSizes = [Size.tiny, Size.regular, Size.big, Size.huge];

/**
 * Core stories for the Dialog component.
 *
 * Dialog is interactive (open/close state, focus trap, etc.) and requires
 * framework-specific rendering for refs and state management.
 * A `render` function is provided per framework to handle this.
 */
export function setup({
    component: Dialog,
    render,
    decorators: { withChromaticForceScreenSize },
}: SetupStoriesOptions<{
    decorators: 'withChromaticForceScreenSize';
}>) {
    const meta = {
        component: Dialog,
        render,
        parameters: {
            chromatic: {
                pauseAnimationAtEnd: true,
                delay: DIALOG_TRANSITION_DURATION,
            },
        },
        decorators: [withChromaticForceScreenSize()],
        args: DEFAULT_PROPS,
        argTypes: {
            size: getSelectArgType(dialogSizes),
            onVisibilityChange: { action: true },
            children: { control: false },
            closeMode: { control: { type: 'inline-radio' as const }, options: CLOSE_MODES },
        },
    };

    /** Default dialog */
    const Default = {
        args: { children: loremIpsum('short') },
    };

    /** Loading state */
    const Loading = {
        args: { ...Default.args, isLoading: true },
    };

    /** Basic header/footer props */
    const WithHeaderFooter = {
        args: { ...Default.args, header: 'Dialog header', footer: 'Dialog footer' },
    };

    /** Forcing header/footer dividers */
    const ForceDivider = {
        args: { ...WithHeaderFooter.args, forceFooterDivider: true, forceHeaderDivider: true },
    };

    /** Long scrollable content */
    const LongContent = {
        args: { ...WithHeaderFooter.args, children: loremIpsum('long') },
    };

    /** Prevent auto close (click outside & close on escape) */
    const PreventAutoClose = {
        args: { ...Default.args, preventAutoClose: true },
    };

    /** Prevent close on escape */
    const PreventCloseOnEscape = {
        args: { ...Default.args, preventCloseOnEscape: true },
    };

    /** Prevent close on click outside */
    const PreventCloseOnClick = {
        args: { ...Default.args, preventCloseOnClick: true },
    };

    return {
        meta,
        Default,
        Loading,
        WithHeaderFooter,
        ForceDivider,
        LongContent,
        PreventAutoClose,
        PreventCloseOnEscape,
        PreventCloseOnClick,
    };
}
