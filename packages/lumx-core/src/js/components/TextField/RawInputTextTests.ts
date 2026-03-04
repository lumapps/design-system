import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';
import { INPUT_NATIVE_CLASSNAME } from './constants';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { ...propsOverride };
    const wrapper = render(props, options);

    const input = getByClassName(document.body, INPUT_NATIVE_CLASSNAME);
    return { props, input, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('RawInputText core tests', () => {
        describe('Props', () => {
            it('should render default', () => {
                const { input } = setup({}, renderOptions);
                expect(input).toBeInTheDocument();
                expect(input?.tagName).toBe('INPUT');
                expect(input).toHaveAttribute('type', 'text');
            });

            it('should render with custom type', () => {
                const { input } = setup({ type: 'number' }, renderOptions);
                expect(input).toHaveAttribute('type', 'number');
            });

            it('should render with placeholder', () => {
                const { input } = setup({ placeholder: 'Enter text' }, renderOptions);
                expect(input).toHaveAttribute('placeholder', 'Enter text');
            });

            it('should render with value', () => {
                const { input } = setup({ value: 'test value' }, renderOptions);
                expect(input).toHaveValue('test value');
            });

            it('should render with name', () => {
                const { input } = setup({ name: 'inputName' }, renderOptions);
                expect(input).toHaveAttribute('name', 'inputName');
            });
        });
    });
};
