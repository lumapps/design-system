import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';

import { render, screen } from '@testing-library/react';
import { getByClassName, getByTagName, queryByClassName } from '@lumx/react/testing/utils/queries';
import userEvent from '@testing-library/user-event';
import { mdiPlus } from '@lumx/icons';
import { Uploader, UploaderProps } from './Uploader';

const CLASSNAME = Uploader.className as string;

type SetupProps = Partial<UploaderProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: any = { ...propsOverride };

    render(<Uploader {...props} />, { wrapper });
    const uploader = getByClassName(document.body, CLASSNAME);
    const label = queryByClassName(uploader, `${CLASSNAME}__label`);
    const icon = queryByClassName(uploader, `${CLASSNAME}__icon`);
    const input = queryByClassName(uploader, `${CLASSNAME}__input`);

    return { props, uploader, label, icon, input };
};

describe(`<${Uploader.displayName}>`, () => {
    describe('Props', () => {
        it('should render default', () => {
            const label = 'Label';
            const { uploader } = setup({ label });

            expect(uploader).toHaveClass(CLASSNAME);
            expect(uploader).toBe(screen.queryByRole('button', { name: label }));
            expect(uploader).toHaveClass('lumx-uploader--aspect-ratio-horizontal');
            expect(uploader).toHaveClass('lumx-uploader--size-xl');
            expect(uploader).toHaveClass('lumx-uploader--theme-light');
            expect(uploader).toHaveClass('lumx-uploader--variant-square');
        });

        it('should render icon', () => {
            const { icon } = setup({ icon: mdiPlus });
            expect(icon).toBeInTheDocument();
        });

        it('should render variant circle', () => {
            const { uploader } = setup({
                variant: 'circle',
                // Ratio should be ignored
                aspectRatio: 'vertical',
            });

            expect(uploader).toHaveClass(CLASSNAME);
            expect(uploader).toHaveClass('lumx-uploader--aspect-ratio-square');
            expect(uploader).toHaveClass('lumx-uploader--size-xl');
            expect(uploader).toHaveClass('lumx-uploader--theme-light');
            expect(uploader).toHaveClass('lumx-uploader--variant-circle');
        });

        it('should render variant rounded', () => {
            const { uploader } = setup({ variant: 'rounded' });

            expect(uploader).toHaveClass(CLASSNAME);
            expect(uploader).toHaveClass('lumx-uploader--aspect-ratio-horizontal');
            expect(uploader).toHaveClass('lumx-uploader--size-xl');
            expect(uploader).toHaveClass('lumx-uploader--theme-light');
            expect(uploader).toHaveClass('lumx-uploader--variant-rounded');
        });

        it('should render file input', () => {
            const label = 'Label';
            const accept = '*';
            const { uploader } = setup({ label, fileInputProps: { accept } as any });

            expect(uploader.tagName).toBe('LABEL');
            expect(uploader).toHaveTextContent(label);
            const inputNative = getByTagName(uploader, 'input');
            expect(inputNative).toHaveAttribute('type', 'file');
            expect(inputNative).toHaveAttribute('accept', accept);
            expect(uploader).toHaveAttribute('for', inputNative.id);
        });
    });

    describe.each`
        name                      | props
        ${'button'}               | ${{}}
        ${'button isDisabled   '} | ${{ isDisabled: true }}
        ${'button aria-disabled'} | ${{ 'aria-disabled': true }}
        ${'file input          '} | ${{ fileInputProps: { onChange: vi.fn() } }}
    `('Events $name', ({ props }) => {
        const onClick = vi.fn();
        beforeEach(() => onClick.mockClear());
        const assertClick = () => {
            if (props.isDisabled || props['aria-disabled']) {
                expect(onClick).not.toHaveBeenCalled();
            } else {
                expect(onClick).toHaveBeenCalled();
            }
        };

        it('should trigger `onClick` when clicked', async () => {
            const { uploader } = setup({ ...props, onClick });

            await userEvent.click(uploader);
            assertClick();
        });

        it('should trigger `onClick` when pressing Enter or Escape', async () => {
            const { uploader, input } = setup({ ...props, onClick });

            if (props.isDisabled) {
                expect(props.fileInputProps ? input : uploader).toBeDisabled();
                //Cannot test focus or activation
                return;
            }

            await userEvent.tab();
            expect(props.fileInputProps ? input : uploader).toHaveFocus();

            // Activate with Enter
            await userEvent.keyboard('[Enter]');
            assertClick();

            onClick.mockClear();

            // Activate with Space
            await userEvent.keyboard('[Space]');
            assertClick();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'uploader',
        forwardAttributes: 'uploader',
        forwardRef: 'uploader',
        applyTheme: {
            affects: [{ element: 'uploader' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
