import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { ARIA_LINK_MODES } from './constants';

const placements = ['top', 'bottom', 'right', 'left'];
const CLOSE_MODES = ['hide', 'unmount'];

/**
 * Setup Tooltip stories for a specific framework (React or Vue).
 * Framework-specific components (Button) and decorators are injected via options.
 */
export function setup({
    component: Tooltip,
    components: { Button },
    decorators: { withChromaticForceScreenSize } = {} as any,
}: SetupStoriesOptions<{
    components: { Button: any };
    decorators: 'withChromaticForceScreenSize';
}>) {
    const meta = {
        component: Tooltip,
        argTypes: {
            placement: getSelectArgType(placements),
            children: { control: false },
            closeMode: { control: { type: 'inline-radio' as const }, options: CLOSE_MODES },
            ariaLinkMode: { control: { type: 'inline-radio' as const }, options: ARIA_LINK_MODES },
        },
        decorators: withChromaticForceScreenSize ? [withChromaticForceScreenSize()] : [],
    };

    /** Simple tooltip on a button */
    const OnAButton = {
        render: (args: any) => (
            <Tooltip {...args} label="Tooltip label">
                <Button>Button</Button>
            </Tooltip>
        ),
    };

    /** Simple tooltip on a disabled button */
    const OnADisabledButton = {
        render: (args: any) => (
            <Tooltip {...args} label="Tooltip label">
                <Button isDisabled>Button</Button>
            </Tooltip>
        ),
    };

    /** Forcing the tooltip to appear */
    const ForceOpen = {
        render: OnAButton.render,
        args: { forceOpen: true },
    };

    /** Hide on close instead of unmounting */
    const CloseModeHide = {
        render: OnAButton.render,
        args: { closeMode: 'hide' },
    };

    /** Display a multiline tooltip */
    const MultilineTooltip = {
        render: (args: any) => (
            <Tooltip {...args} label={'First sentence.\nSecond sentence.\nThird sentence.\n'}>
                <Button>Button</Button>
            </Tooltip>
        ),
    };

    return { meta, OnAButton, OnADisabledButton, ForceOpen, CloseModeHide, MultilineTooltip };
}
