import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BaseLinkTests, { setup } from '@lumx/core/js/components/Link/Tests';
import { LinkProps } from '@lumx/core/js/components/Link';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { Icon } from '@lumx/react';
import { mdiCheck, mdiPlus } from '@lumx/icons';

import { queryAllByClassName } from '@lumx/react/testing/utils/queries';
import { Link } from './Link';

const CLASSNAME = Link.className as string;

describe(`<${Link.displayName}>`, () => {
    const renderLink = (props: LinkProps, options?: SetupRenderOptions) => {
        // Map core props to React props (label -> children)
        const { label, ...restProps } = props;
        return render(<Link {...(restProps as any)}>{label}</Link>, options);
    };

    BaseLinkTests({ render: renderLink, screen });

    const setupLink = (props: Partial<LinkProps> = {}, options: SetupRenderOptions = {}) =>
        setup(props, { ...options, render: renderLink, screen });

    describe('React', () => {
        it('should forward ref to the root element', () => {
            const ref = React.createRef<HTMLAnchorElement>();
            render(<Link href="https://example.com" ref={ref} />);
            expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
        });

        it('should render as button and forward ref', () => {
            const ref = React.createRef<HTMLButtonElement>();
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            render(<Link ref={ref}>Link</Link>);
            expect(ref.current).toBeInstanceOf(HTMLButtonElement);
        });

        it('should be disabled with isDisabled', async () => {
            const onClick = vi.fn();
            const { container } = render(
                <Link href="/test" isDisabled onClick={onClick}>
                    Label
                </Link>,
            );
            const link = container.querySelector(`.${CLASSNAME}`);

            expect(link).toHaveAttribute('disabled');

            // Should not trigger onClick.
            if (link) await userEvent.click(link);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should be disabled link with isDisabled and href', async () => {
            const onClick = vi.fn();
            const { container } = render(
                <Link isDisabled href="https://example.com" onClick={onClick}>
                    Label
                </Link>,
            );
            const link = container.querySelector(`.${CLASSNAME}`);

            expect(link).toHaveAttribute('aria-disabled', 'true');
            expect(link).toHaveAttribute('tabindex', '-1');

            // Should not trigger onClick.
            if (link) await userEvent.click(link);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should be disabled with aria-disabled', async () => {
            const onClick = vi.fn();
            const { container } = render(
                <Link href="/test" aria-disabled onClick={onClick}>
                    Label
                </Link>,
            );
            const link = container.querySelector(`.${CLASSNAME}`);

            expect(link).toHaveAttribute('aria-disabled', 'true');

            // Should not trigger onClick.
            if (link) await userEvent.click(link);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should render with icons wrapped with spaces', () => {
            const { container } = render(
                <Link href="/test" leftIcon={mdiCheck} rightIcon={mdiPlus}>
                    Link
                    <Icon icon={mdiCheck} />
                    with icons
                </Link>,
            );
            const link = container.querySelector(`.${CLASSNAME}`) as HTMLElement;
            const icons = queryAllByClassName(link, Icon.className as string);
            expect(icons).toHaveLength(3);

            // Icons are all wrapped with spaces
            for (const icon of icons) {
                expect((icon.previousSibling as any).textContent).toEqual(' ');
                expect((icon.nextSibling as any).textContent).toEqual(' ');
            }
        });
    });

    commonTestsSuiteRTL(setupLink, {
        baseClassName: CLASSNAME,
        forwardAttributes: 'link',
        forwardClassName: 'link',
        forwardRef: 'link',
    });
});
