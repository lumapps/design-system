import { Theme, Typography } from '@lumx/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { getTypographyClassName } from '@lumx/core/js/utils/_internal/className';
import { render } from '@testing-library/react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { InputLabel, InputLabelProps } from './InputLabel';

const CLASSNAME = InputLabel.className as string;

type SetupProps = Partial<InputLabelProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: any = { htmlFor: 'id', ...propsOverride };
    render(<InputLabel {...props} />, { wrapper });
    const label = getByClassName(document.body, CLASSNAME);

    return { label, props };
};

describe(`<${InputLabel.displayName}>`, () => {
    describe('Props', () => {
        it('should render text', () => {
            const { label, props } = setup({
                children: 'Some label text',
                htmlFor: '123',
            });
            expect(label).toHaveTextContent(props.children);
            expect(label).toHaveAttribute('for', props.htmlFor);
        });

        it('should render dark theme & required', () => {
            const { label } = setup({ children: 'The label', theme: Theme.dark, isRequired: true });
            expect(label).toHaveClass(CLASSNAME);
            expect(label).toHaveClass(`${CLASSNAME}--theme-dark`);
            expect(label).toHaveClass(`${CLASSNAME}--is-required`);
        });

        it('should render typography', () => {
            const { label } = setup({ children: 'The label', typography: Typography.body1 });
            expect(label).toHaveClass(CLASSNAME);
            expect(label).toHaveClass(getTypographyClassName(Typography.body1));
        });
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'label',
        forwardAttributes: 'label',
        applyTheme: {
            affects: [{ element: 'label' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
