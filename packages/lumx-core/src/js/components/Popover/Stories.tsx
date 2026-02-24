import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { Placement, type Elevation, FitAnchorWidth } from './constants';
import { DEFAULT_PROPS } from '.';

/**
 * Core stories for the Popover component.
 *
 * A default `render` function is provided per framework to handle anchor ref creation
 * and framework-specific JSX. Story variations are expressed as `args` and shared here.
 *
 * The render function receives all args, including story display args:
 * - `anchorText`: Label for the anchor button (default: 'Anchor')
 * - `anchorClassName`: CSS class for the anchor button (default: 'lumx-spacing-margin-big')
 * - `popoverClassName`: Extra CSS class for the popover (default: undefined)
 * - `textColor`: Text color prop for popover content (default: undefined)
 * - `fitAnchorWidth`: When set, popover content renders as plain text instead of wrapped in Text
 */
export function setup({
    component: Popover,
    render,
    decorators: { withCombinations, withChromaticForceScreenSize },
}: SetupStoriesOptions<{
    decorators: 'withCombinations' | 'withChromaticForceScreenSize';
}>) {
    const meta = {
        component: Popover,
        render,
        args: {
            ...DEFAULT_PROPS,
            isOpen: true,
            // Story display args (not actual Popover props)
            anchorText: 'Anchor',
            anchorClassName: 'lumx-spacing-margin-big',
        },
        argTypes: {
            isOpen: { control: 'boolean' },
            hasArrow: { control: 'boolean' },
            placement: getSelectArgType(Placement),
            elevation: getSelectArgType<Elevation>([1, 2, 3, 4, 5]),
            ref: { control: false },
            parentElement: { control: false },
            focusElement: { control: false },
            anchorRef: { control: false },
            boundaryRef: { control: false },
            children: { control: false },
            // Disable story display args from controls
            anchorText: { control: false },
            anchorClassName: { control: false },
            popoverClassName: { control: false },
            textColor: { control: false },
        },
        decorators: [withChromaticForceScreenSize()],
    };

    /** Simple popover */
    const Simple = {};

    /** Dark theme */
    const DarkTheme = {
        args: {
            theme: 'dark',
            hasArrow: true,
            textColor: 'light',
        },
    };

    /** Popover not using portal */
    const WithoutPortal = {
        args: { usePortal: false },
    };

    /** All base placements */
    const Placements = {
        argTypes: {
            placement: { control: false },
        },
        decorators: [
            withCombinations({
                cellStyle: { padding: '60px' },
                combinations: {
                    cols: {
                        key: 'placement',
                        options: [Placement.TOP, Placement.RIGHT, Placement.BOTTOM, Placement.LEFT],
                    },
                },
            }),
        ],
    };

    /** All fitAnchorWidth configurations */
    const FitToAnchorWidth = {
        args: {
            anchorClassName: 'lumx-spacing-margin-huge',
            popoverClassName: 'lumx-spacing-padding',
            placement: Placement.BOTTOM,
        },
        decorators: [
            withCombinations({
                combinations: {
                    cols: {
                        'Small Anchor': { anchorText: 'Small' },
                        'Large Anchor': { anchorText: 'Very very very very large anchor' },
                    },
                    rows: { key: 'fitAnchorWidth', options: withUndefined(Object.values(FitAnchorWidth)) },
                },
                cellStyle: { padding: '16px' },
            }),
        ],
    };

    return { meta, Simple, DarkTheme, WithoutPortal, Placements, FitToAnchorWidth };
}
