import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { Button } from '@lumx/react';
import { render, screen } from '@testing-library/react';
import { getByClassName, queryByClassName, queryByTagName } from '@lumx/react/testing/utils/queries';

import { IconButton, IconButtonProps } from './IconButton';

const CLASSNAME = Button.className as string;

type SetupProps = Partial<IconButtonProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: any = { ...propsOverride };
    render(<IconButton {...props} />, { wrapper });
    const iconButton = getByClassName(document.body, CLASSNAME);
    const icon = queryByClassName(iconButton, 'lumx-icon');
    const img = queryByTagName(iconButton, 'IMG');

    return { props, iconButton, icon, img };
};

describe(`<${IconButton.displayName}>`, () => {
    describe('Props', () => {
        it('should render default', () => {
            const { iconButton, icon, img } = setup();
            expect(iconButton).toBeInTheDocument();
            expect(iconButton.className).toMatchInlineSnapshot(
                '"lumx-button lumx-button--color-primary lumx-button--emphasis-high lumx-button--size-m lumx-button--theme-light lumx-button--variant-icon"',
            );

            expect(icon).toBeInTheDocument();
            expect(img).not.toBeInTheDocument();
        });

        it('should render label', () => {
            const label = 'Label';
            const { iconButton } = setup({ label });
            expect(iconButton).toBe(screen.queryByRole('button', { name: label }));
        });

        it('should render icon button with an image', () => {
            const { iconButton, icon, img } = setup({ image: 'http://foo.com' });

            expect(iconButton).toBeInTheDocument();
            expect(icon).not.toBeInTheDocument();
            expect(img).toBeInTheDocument();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'iconButton',
        forwardAttributes: 'iconButton',
        forwardRef: 'iconButton',
        applyTheme: {
            affects: [{ element: 'iconButton' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
