import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import BaseLinkTests, { setup } from '@lumx/core/js/components/Link/Tests';
import { CLASSNAME, LinkProps } from '@lumx/core/js/components/Link';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Link } from '.';

describe('<Link />', () => {
    const renderLink = (props: LinkProps, options?: SetupRenderOptions<LinkProps>) =>
        render(Link, {
            props,
            ...options,
        });

    BaseLinkTests({ render: renderLink, screen });

    const setupLink = (props: Partial<LinkProps> = {}, options: SetupRenderOptions<LinkProps> = {}) =>
        setup(props, { ...options, render: renderLink, screen });

    describe('Vue', () => {
        it('should emit click event when link is clicked', async () => {
            const { getByRole, emitted } = render(Link, {
                props: { href: 'https://example.com' },
                slots: { default: 'Test link' },
            });
            const link = getByRole('link', { name: 'Test link' });

            await userEvent.click(link);

            const clickEvents = emitted('click');
            expect(clickEvents).toHaveLength(1);
            expect((clickEvents as any)?.[0][0]).toBeInstanceOf(Event);
        });

        it('should emit click event when button is clicked', async () => {
            const { getByRole, emitted } = render(Link, {
                props: {},
                slots: { default: 'Test button' },
            });
            const button = getByRole('button', { name: 'Test button' });

            await userEvent.click(button);

            const clickEvents = emitted('click');
            expect(clickEvents).toHaveLength(1);
        });

        it('should be disabled with isDisabled', async () => {
            const { container, emitted } = render(Link, {
                props: { isDisabled: true },
                slots: { default: 'Test' },
            });
            const link = container.querySelector(`.${CLASSNAME}`);

            expect(link).toHaveAttribute('disabled');

            // Should not trigger click event
            if (link) await userEvent.click(link);
            expect(emitted('click')).toBeUndefined();
        });

        it('should be disabled link with isDisabled and href', async () => {
            const { container, emitted } = render(Link, {
                props: { isDisabled: true, href: 'https://example.com' },
                slots: { default: 'Test' },
            });
            const link = container.querySelector(`.${CLASSNAME}`);

            expect(link).toHaveAttribute('aria-disabled', 'true');
            expect(link).toHaveAttribute('tabindex', '-1');

            // Should not trigger click event
            if (link) await userEvent.click(link);
            expect(emitted('click')).toBeUndefined();
        });

        it('should be disabled with aria-disabled', async () => {
            const { container, emitted } = render(Link, {
                props: { 'aria-disabled': true },
                slots: { default: 'Test' },
            });
            const link = container.querySelector(`.${CLASSNAME}`);

            expect(link).toHaveAttribute('aria-disabled', 'true');

            // Should not trigger click event
            if (link) await userEvent.click(link);
            expect(emitted('click')).toBeUndefined();
        });

        it('should render default slot as label', () => {
            const { getByText } = render(Link, {
                slots: {
                    default: 'Link from slot',
                },
            });

            expect(getByText('Link from slot')).toBeInTheDocument();
        });
    });

    // Common tests suite.
    commonTestsSuiteVTL(setupLink, {
        baseClassName: CLASSNAME,
        forwardClassName: 'link',
        forwardAttributes: 'link',
    });
});
