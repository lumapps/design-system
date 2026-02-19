import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import BaseLinkTests, { setup } from '@lumx/core/js/components/Link/Tests';
import { CLASSNAME } from '@lumx/core/js/components/Link';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';
import { Link } from '.';

describe('<Link />', () => {
    const renderLink = ({ children, ...props }: any, options?: SetupRenderOptions<any>) =>
        render(Link, {
            ...options,
            props,
            slots: children ? { default: children } : undefined,
        });

    BaseLinkTests({
        render: renderLink,
        screen,
    });

    const setupLink = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderLink, screen });

    describe('Vue', () => {
        it('should emit click event', async () => {
            const { link, wrapper } = setupLink({ children: 'Label' });
            await userEvent.click(link);
            expect(wrapper.emitted('click')).toHaveLength(1);
        });

        it('should not emit click when disabled button is clicked', async () => {
            const { link, wrapper } = setupLink({ children: 'Label', isDisabled: true });
            await userEvent.click(link);
            expect(wrapper.emitted('click')).toBeUndefined();
        });

        it('should not emit click when disabled link is clicked', async () => {
            const { link, wrapper } = setupLink({ children: 'Label', isDisabled: true, href: 'https://example.com' });
            await userEvent.click(link);
            expect(wrapper.emitted('click')).toBeUndefined();
        });

        it('should not emit click when aria-disabled button is clicked', async () => {
            const { link, wrapper } = setupLink({ children: 'Label', 'aria-disabled': true });
            await userEvent.click(link);
            expect(wrapper.emitted('click')).toBeUndefined();
        });

        it('should not emit click when aria-disabled link is clicked', async () => {
            const { link, wrapper } = setupLink({
                children: 'Label',
                'aria-disabled': true,
                href: 'https://example.com',
            });
            await userEvent.click(link);
            expect(wrapper.emitted('click')).toBeUndefined();
        });
    });

    commonTestsSuiteVTL(setupLink, {
        baseClassName: CLASSNAME,
        forwardAttributes: 'link',
        forwardClassName: 'link',
    });
});
