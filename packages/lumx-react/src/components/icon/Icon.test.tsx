import { mdiAlertCircle } from '@lumx/icons';
import { ColorPalette, ColorVariant, Size, Theme } from '@lumx/react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';

import { getByClassName, getByTagName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';
import { Icon, IconProps } from './Icon';

const CLASSNAME = Icon.className as string;

type SetupProps = Partial<IconProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: IconProps = {
        icon: 'mdiPlus',
        ...propsOverride,
    };
    render(<Icon {...props} />, { wrapper });
    const i = getByClassName(document.body, CLASSNAME);
    const svg = getByTagName(i, 'svg');
    const path = getByTagName(svg, 'path');

    return { i, svg, path, props };
};

describe(`<${Icon.displayName}>`, () => {
    describe('Props', () => {
        it('should render default', () => {
            const { i, svg, path, props } = setup();

            expect(i).toBeInTheDocument();
            expect(i).toHaveClass(CLASSNAME);
            expect(i?.className).toMatchInlineSnapshot('"lumx-icon lumx-icon--no-shape lumx-icon--path"');

            expect(svg).toBeInTheDocument();
            expect(svg).toHaveAttribute('aria-hidden', 'true');
            expect(svg).not.toHaveAttribute('role');

            expect(path).toBeInTheDocument();
            expect(path).toHaveAttribute('d', props.icon);
        });

        it('should adapt svg with alternate text', () => {
            const { svg, props } = setup({ alt: 'Alternate text' });
            expect(svg).toHaveAttribute('aria-label', props.alt);
            expect(svg).not.toHaveAttribute('aria-hidden');
            expect(svg).toHaveAttribute('role');
        });

        describe('size', () => {
            it('should render size', () => {
                const { i } = setup({ size: Size.s });
                expect(i).toHaveClass('lumx-icon--size-s');
            });

            it('should adapt xxs size with hasShape', () => {
                const { i } = setup({ hasShape: true, size: Size.xxs });
                expect(i).toHaveClass('lumx-icon--size-s');
            });

            it('should adapt xs size with hasShape', () => {
                const { i } = setup({ hasShape: true, size: Size.xs });
                expect(i).toHaveClass('lumx-icon--size-s');
            });

            it('should adapt xxl size with hasShape', () => {
                const { i } = setup({ hasShape: true, size: Size.xxl });
                expect(i).toHaveClass('lumx-icon--size-xl');
            });

            it('should add default size with hasShape', () => {
                const { i } = setup({ hasShape: true });
                expect(i).toHaveClass('lumx-icon--size-m');
            });
        });

        describe('color', () => {
            it('should render color and color variant', () => {
                const { i } = setup({
                    color: ColorPalette.primary,
                    colorVariant: ColorVariant.D1,
                });
                expect(i).toHaveClass('lumx-icon--color-primary lumx-icon--color-variant-D1');
            });

            it('should improve yellow icon color contrast with alert circle icon', () => {
                const { i } = setup({
                    color: ColorPalette.yellow,
                    icon: mdiAlertCircle,
                });
                expect(i).toHaveClass('lumx-icon--color-yellow lumx-icon--has-dark-layer');
            });

            it('should set a default color on dark theme', () => {
                const { i } = setup({ theme: Theme.dark });
                expect(i).toHaveClass('lumx-icon--color-light lumx-icon--theme-dark');
            });

            it('should set a default color on has shape', () => {
                const { i } = setup({ hasShape: true });
                expect(i).toHaveClass('lumx-icon--color-dark lumx-icon--has-shape');
            });

            it('should set a default color variant on has shape & dark color', () => {
                const { i } = setup({ color: ColorPalette.dark, hasShape: true });
                expect(i).toHaveClass('lumx-icon--color-variant-L2 lumx-icon--color-dark lumx-icon--has-shape');
            });
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'i',
        forwardAttributes: 'i',
        applyTheme: {
            affects: [{ element: 'i', classModifier: 'color', inverted: true }],
            viaProp: true,
            viaContext: true,
        },
    });
});
