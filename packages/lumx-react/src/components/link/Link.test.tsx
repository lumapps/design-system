import { Icon } from '@lumx/react';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { getByClassName, queryAllByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mdiCheck, mdiPlus } from '@lumx/icons';
import BaseLinkTests from '@lumx/core/js/components/Link/Tests';
import { Link, LinkProps } from './Link';

const CLASSNAME = Link.className as string;

const setup = (props: LinkProps = {}) => {
    render(<Link {...props} />);
    const link = getByClassName(document.body, CLASSNAME);
    const rightIcon = queryByClassName(link, `${CLASSNAME}__right-icon`);
    const leftIcon = queryByClassName(link, `${CLASSNAME}__left-icon`);
    return { props, link, rightIcon, leftIcon };
};

describe(`<${Link.displayName}>`, () => {
    BaseLinkTests({
        render: (props: LinkProps) => render(<Link {...props} />),
        screen,
    });

    describe('React', () => {
        it('should render link without icons', () => {
            const name = 'Link';
            const { rightIcon, leftIcon } = setup({ href: 'https://example.com', children: name });

            expect(rightIcon).not.toBeInTheDocument();
            expect(leftIcon).not.toBeInTheDocument();
        });

        it('should render with icons', () => {
            const { link } = setup({
                leftIcon: mdiCheck,
                children: ['Link', <Icon key="icon" icon={mdiCheck} />, 'with icons'],
                rightIcon: mdiPlus,
            });
            const icons = queryAllByClassName(link, Icon.className as string);
            expect(icons).toHaveLength(3);

            for (const icon of icons) {
                expect((icon.previousSibling as any).textContent).toEqual(' ');
                expect((icon.nextSibling as any).textContent).toEqual(' ');
            }
        });

        it('should not call onClick when disabled button is clicked', async () => {
            const onClick = vi.fn();
            const { link } = setup({ children: 'Label', isDisabled: true, onClick });
            await userEvent.click(link);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should not call onClick when disabled link is clicked', async () => {
            const onClick = vi.fn();
            const { link } = setup({ children: 'Label', isDisabled: true, href: 'https://example.com', onClick });
            await userEvent.click(link);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should not call onClick when aria-disabled button is clicked', async () => {
            const onClick = vi.fn();
            const { link } = setup({ children: 'Label', 'aria-disabled': true, onClick });
            await userEvent.click(link);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should not call onClick when aria-disabled link is clicked', async () => {
            const onClick = vi.fn();
            const { link } = setup({
                children: 'Label',
                'aria-disabled': true,
                href: 'https://example.com',
                onClick,
            });
            await userEvent.click(link);
            expect(onClick).not.toHaveBeenCalled();
        });
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardAttributes: 'link',
        forwardClassName: 'link',
        forwardRef: 'link',
    });
});
