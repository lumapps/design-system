import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, within, screen } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { Text, Thumbnail } from '@lumx/react';
import userEvent from '@testing-library/user-event';

import { UserBlock, UserBlockProps } from './UserBlock';

const CLASSNAME = UserBlock.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: Partial<UserBlockProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: UserBlockProps = { ...propsOverride };

    render(<UserBlock {...props} />, { wrapper });
    const userBlock = getByClassName(document.body, CLASSNAME);
    const name = queryByClassName(userBlock, `${CLASSNAME}__name`);
    const avatar = queryByClassName(userBlock, `${CLASSNAME}__avatar`);
    const thumbnail = avatar && queryByClassName(avatar, Thumbnail.className as string);
    const fields = queryByClassName(userBlock, `${CLASSNAME}__fields`);
    const after = queryByClassName(userBlock, `${CLASSNAME}__after`);

    return { props, userBlock, name, avatar, thumbnail, fields, after };
};

describe(`<${UserBlock.displayName}>`, () => {
    describe('Props', () => {
        it('should forward name props', () => {
            const { name } = setup({ name: 'John Doe', nameProps: { 'data-custom-attribute': true } });

            expect(name).toHaveAttribute('data-custom-attribute');
        });

        it('should render button', async () => {
            const onClick = vi.fn();
            const { name, thumbnail } = setup({
                onClick,
                name: 'John Doe',
                avatarProps: { image: 'profile-picture.jpg' },
            });

            // Button name
            expect(name?.tagName).toBe('BUTTON');
            await userEvent.click(name as any);
            expect(onClick).toHaveBeenCalled();

            // Button thumbnail (but excluded from tab stops)
            expect(thumbnail?.tagName).toBe('BUTTON');
            expect(thumbnail?.tabIndex).toBe(-1);
            onClick.mockClear();
            await userEvent.click(thumbnail as any);
            expect(onClick).toHaveBeenCalled();
        });

        it('should render link', async () => {
            const { props, name, thumbnail } = setup({
                linkProps: { href: 'https://example.com' },
                name: 'John Doe',
                avatarProps: { image: 'profile-picture.jpg' },
            });

            // Link name
            expect(name?.tagName).toBe('A');
            expect(name).toHaveAttribute('href', props.linkProps?.href);

            // Link thumbnail (but excluded from tab stops)
            expect(thumbnail?.tagName).toBe('A');
            expect(thumbnail?.tabIndex).toBe(-1);
            expect(thumbnail).toHaveAttribute('href', props.linkProps?.href);
        });

        it('should render fields', () => {
            const { fields } = setup({ fields: ['Field 1', 'Field 2'] });
            expect(fields).toBeInTheDocument();
            expect(within(fields as any).getByText('Field 1')).toBeInTheDocument();
            expect(within(fields as any).getByText('Field 2')).toBeInTheDocument();
        });

        it('should render additional fields', () => {
            setup({ additionalFields: <Text as="span">Works in Toronto</Text> });
            expect(screen.queryByText(/works in toronto/i)).toBeInTheDocument();
        });

        it('should render after', () => {
            const { after } = setup({ after: <Text as="span">After</Text> });
            expect(after).toBeInTheDocument();
            expect(screen.queryByText(/after/i)).toBeInTheDocument();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'userBlock',
        forwardAttributes: 'userBlock',
        forwardRef: 'userBlock',
        applyTheme: {
            affects: [{ element: 'userBlock' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
