import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import { Popover, PopoverProps } from './Popover';

const CLASSNAME = Popover.className as string;

const setup = (props: Partial<PopoverProps> = {}) => {
    const { container } = render(
        <Popover isOpen anchorRef={{ current: null }} usePortal={false} {...props} data-testid="popover">
            {props.children || 'Popover content'}
        </Popover>,
    );
    return { props, container, element: screen.getByTestId('popover') };
};

describe(`<${Popover.displayName}>`, () => {
    it('should render in portal', () => {
        const { element } = setup({ usePortal: true });
        expect(element).toBeInTheDocument();
        expect(element).toHaveTextContent(/Popover content/);
        expect(element.parentElement).toBe(document.body);
    });

    it('should render inline', () => {
        const { element, container } = setup({ usePortal: false });
        expect(element).toBeInTheDocument();
        expect(element).toHaveTextContent(/Popover content/);
        expect(element.parentElement).toBe(container);
    });

    it('should render with custom component', () => {
        const { element } = setup({ as: 'span' });
        expect(element).toBeInTheDocument();
        expect(element.tagName).toBe('SPAN');
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
    });
});
