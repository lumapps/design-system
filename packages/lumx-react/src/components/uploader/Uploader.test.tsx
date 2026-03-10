import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';

import { render, screen, fireEvent } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import userEvent from '@testing-library/user-event';
import BaseUploaderTests from '@lumx/core/js/components/Uploader/Tests';
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
    // Run core tests.
    BaseUploaderTests({
        render: (props: UploaderProps) => render(<Uploader {...props} />),
        screen,
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

        it('should apply drag hovering class', () => {
            const { uploader, input } = setup({ fileInputProps: { onChange: vi.fn() } });
            expect(uploader).not.toHaveClass(`${CLASSNAME}--is-drag-hovering`);

            fireEvent.dragEnter(input as HTMLElement);
            expect(uploader).toHaveClass(`${CLASSNAME}--is-drag-hovering`);

            fireEvent.dragLeave(input as HTMLElement);
            expect(uploader).not.toHaveClass(`${CLASSNAME}--is-drag-hovering`);
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
