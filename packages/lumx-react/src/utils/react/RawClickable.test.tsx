import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SetupRenderOptions } from '@lumx/core/testing';
import BaseRawClickableTests from '@lumx/core/js/components/RawClickable/Tests';

import { RawClickable, RawClickableProps } from './RawClickable';
import { CustomLink } from '../../stories/utils/CustomLink';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests.
 */
const setup = (props: RawClickableProps<any>) => {
    render(<RawClickable {...props} data-testid="raw-element" />);
    const element = screen.getByTestId('raw-element');
    return { props, element };
};

describe('<RawClickable>', () => {
    const renderRawClickable = (props: RawClickableProps<any>, options?: SetupRenderOptions) =>
        render(<RawClickable {...props} />, options);

    BaseRawClickableTests({ render: renderRawClickable, screen });

    describe('as a custom component', () => {
        it('should render a custom component with `linkAs` prop', () => {
            const { element } = setup({ as: CustomLink, children: 'Click me' });
            expect(element).toHaveAttribute('data-custom-link');
        });

        it('should trigger onClick', async () => {
            const onClick = vi.fn();
            const { element } = setup({ as: CustomLink, children: 'Click me', onClick });
            expect(element).toHaveAttribute('data-custom-link');
            await userEvent.click(element);
            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('should be disabled with `disabled` prop', async () => {
            const onClick = vi.fn();
            const { element } = setup({ as: CustomLink, children: 'Click me', onClick, disabled: true });
            expect(element).toHaveAttribute('data-custom-link');
            expect(element).toHaveAttribute('aria-disabled', 'true');
            expect(element).toHaveAttribute('tabindex', '-1');
            await userEvent.click(element);
            expect(onClick).not.toHaveBeenCalled();
        });
    });

    describe('prop forwarding', () => {
        it('should forward className', () => {
            const { element } = setup({ as: 'button', className: 'foo bar' });
            expect(element).toHaveClass('foo bar');
        });

        it('should forward ref and override type in button', () => {
            const ref = React.createRef<HTMLButtonElement>();
            const { element } = setup({ as: 'button', ref, type: 'submit' });
            expect(element).toHaveAttribute('type', 'submit');
            expect(ref.current).toBeInstanceOf(HTMLButtonElement);
        });

        it('should forward ref and override tabindex in link', () => {
            const ref = React.createRef<HTMLAnchorElement>();
            const { element } = setup({ as: 'a', ref, href: '#', tabIndex: -1 });
            expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
            expect(element).toHaveAttribute('tabindex', '-1');
        });

        it('should forward ref to custom component', () => {
            const ref = React.createRef<HTMLAnchorElement>();
            setup({ as: CustomLink, ref });
            expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
        });
    });
});
