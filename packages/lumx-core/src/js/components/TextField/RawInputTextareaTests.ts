import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';
import { INPUT_NATIVE_CLASSNAME } from './constants';
import { DEFAULT_PROPS } from './RawInputTextarea';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { ...propsOverride };
    const wrapper = render(props, options);

    const textarea = getByClassName(document.body, INPUT_NATIVE_CLASSNAME);
    return { props, textarea, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('RawInputTextarea core tests', () => {
        describe('Props', () => {
            it('should render default', () => {
                const { textarea } = setup({}, renderOptions);
                expect(textarea).toBeInTheDocument();
                expect(textarea?.tagName).toBe('TEXTAREA');
                expect(textarea).toHaveAttribute('rows', String(DEFAULT_PROPS.rows));
            });

            it('should render with custom rows', () => {
                const { textarea } = setup({ rows: 5 }, renderOptions);
                expect(textarea).toHaveAttribute('rows', '5');
            });

            it('should render with placeholder', () => {
                const { textarea } = setup({ placeholder: 'Test placeholder' }, renderOptions);
                expect(textarea).toHaveAttribute('placeholder', 'Test placeholder');
            });

            it('should render with value', () => {
                const { textarea } = setup({ value: 'test value' }, renderOptions);
                expect(textarea).toHaveValue('test value');
            });

            it('should render with name', () => {
                const { textarea } = setup({ name: 'textareaName' }, renderOptions);
                expect(textarea).toHaveAttribute('name', 'textareaName');
            });
        });
    });
};
