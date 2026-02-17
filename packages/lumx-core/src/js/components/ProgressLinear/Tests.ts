import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';
import { CLASSNAME } from '.';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { ...propsOverride };
    const wrapper = render(props, options);

    const element = getByClassName(document.body, CLASSNAME);
    return { props, element, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('ProgressLinear core tests', () => {
        describe('Props', () => {
            it('should render default', () => {
                const { element } = setup({}, renderOptions);
                expect(element).toHaveClass(CLASSNAME);
            });
        });
    });
};
