import { mdiPlus } from '@lumx/icons';
import { getByClassName, getByTagName, queryByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';

const CLASSNAME = 'lumx-uploader';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { ...propsOverride };
    const wrapper = render(props, options);

    const uploader = getByClassName(document.body, CLASSNAME);
    const label = queryByClassName(uploader, `${CLASSNAME}__label`);
    const icon = queryByClassName(uploader, `${CLASSNAME}__icon`);
    const input = queryByClassName(uploader, `${CLASSNAME}__input`);

    return { props, uploader, label, icon, input, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    const { screen } = renderOptions;

    describe('Uploader core tests', () => {
        describe('Props', () => {
            it('should render default', () => {
                const label = 'Label';
                const { uploader } = setup({ label }, renderOptions);

                expect(uploader).toHaveClass(CLASSNAME);
                expect(uploader).toBe(screen.queryByRole('button', { name: label }));
                expect(uploader).toHaveClass('lumx-uploader--aspect-ratio-horizontal');
                expect(uploader).toHaveClass('lumx-uploader--size-xl');
                expect(uploader).toHaveClass('lumx-uploader--theme-light');
                expect(uploader).toHaveClass('lumx-uploader--variant-square');
            });

            it('should render icon', () => {
                const { icon } = setup({ icon: mdiPlus }, renderOptions);
                expect(icon).toBeInTheDocument();
            });

            it('should render variant circle', () => {
                const { uploader } = setup({ variant: 'circle', aspectRatio: 'vertical' }, renderOptions);

                expect(uploader).toHaveClass(CLASSNAME);
                expect(uploader).toHaveClass('lumx-uploader--aspect-ratio-square');
                expect(uploader).toHaveClass('lumx-uploader--size-xl');
                expect(uploader).toHaveClass('lumx-uploader--theme-light');
                expect(uploader).toHaveClass('lumx-uploader--variant-circle');
            });

            it('should render variant rounded', () => {
                const { uploader } = setup({ variant: 'rounded' }, renderOptions);

                expect(uploader).toHaveClass(CLASSNAME);
                expect(uploader).toHaveClass('lumx-uploader--aspect-ratio-horizontal');
                expect(uploader).toHaveClass('lumx-uploader--size-xl');
                expect(uploader).toHaveClass('lumx-uploader--theme-light');
                expect(uploader).toHaveClass('lumx-uploader--variant-rounded');
            });

            it('should render file input', () => {
                const label = 'Label';
                const accept = '*';
                const { uploader } = setup({ label, fileInputProps: { accept } as any }, renderOptions);

                expect(uploader.tagName).toBe('LABEL');
                expect(uploader).toHaveTextContent(label);
                const inputNative = getByTagName(uploader, 'input');
                expect(inputNative).toHaveAttribute('type', 'file');
                expect(inputNative).toHaveAttribute('accept', accept);
                expect(uploader).toHaveAttribute('for', inputNative.id);
            });
        });
    });
};
