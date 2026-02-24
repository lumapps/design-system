import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import { ThemeSentinel } from '@lumx/react/testing/utils/ThemeSentinel';
import BasePopoverTests from '@lumx/core/js/components/Popover/Tests';
import { Popover, PopoverProps } from './Popover';

const CLASSNAME = Popover.className as string;

const setup = (props: Partial<PopoverProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const { container } = render(
        <Popover isOpen anchorRef={{ current: null }} usePortal={false} {...props} data-testid="popover">
            {props.children || (
                <>
                    Popover content
                    <ThemeSentinel />
                </>
            )}
        </Popover>,
        { wrapper },
    );
    const element = screen.getByTestId('popover');
    const themeSentinel = screen.getByTestId(ThemeSentinel.testId);
    return { props, container, element, themeSentinel };
};

describe(`<${Popover.displayName}>`, () => {
    // Run core tests (shared between React and Vue)
    BasePopoverTests({
        render: (props: any) =>
            render(
                <Popover anchorRef={{ current: null }} {...props}>
                    {props.children || 'Popover content'}
                </Popover>,
            ),
        screen,
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        applyTheme: {
            affects: [
                { element: 'element' },
                // Theme automatically transferred to the children
                { element: 'themeSentinel' },
            ],
            viaProp: true,
            // Parent context does not affect the popover
            viaContext: false,
        },
    });
});
