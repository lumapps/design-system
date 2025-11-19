import React from 'react';

import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import userEvent from '@testing-library/user-event';
import { Dropdown, DropdownProps } from './Dropdown';

const CLASSNAME = Dropdown.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: Partial<DropdownProps> = {}) => {
    const anchorRef = React.createRef<HTMLButtonElement>();
    const props: DropdownProps = {
        anchorRef,
        children: <div>This is the content of the dropdown</div>,
        isOpen: true,
        ...propsOverride,
    };
    render(<Dropdown {...props} />);
    const dropDown = queryByClassName(document.body, CLASSNAME);
    return { props, dropDown };
};

describe(`<${Dropdown.displayName}>`, () => {
    describe('Events', () => {
        it('should trigger `onClose` when pressing `escape` key', async () => {
            const onClose = vi.fn();
            setup({
                closeOnEscape: true,
                onClose,
                isOpen: true,
            });

            await userEvent.keyboard('[Escape]');
            expect(onClose).toHaveBeenCalled();
        });

        it('should not trigger `onClose` when pressing any other key', async () => {
            const onClose = vi.fn();
            setup({ isOpen: true, onClose, closeOnEscape: true });

            await userEvent.keyboard('a');
            expect(onClose).not.toHaveBeenCalled();
        });

        it('should not trigger `onClose` when pressing `escape` key with `closeOnEscape` set to `false`', async () => {
            const onClose = vi.fn();
            setup({ isOpen: true, onClose, closeOnEscape: false });

            await userEvent.keyboard('[Escape]');
            expect(onClose).not.toHaveBeenCalled();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'dropDown',
        forwardAttributes: 'dropDown',
        forwardRef: 'dropDown',
    });
});
