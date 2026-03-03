import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';
import { CLASSNAME } from './ChipGroup';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = {
        children: 'Chip content',
        ...propsOverride,
    };
    const wrapper = render(props, options);

    const chipGroup = getByClassName(document.body, CLASSNAME);
    return { props, chipGroup, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    const { screen } = renderOptions;

    describe('ChipGroup core tests', () => {
        describe('Props', () => {
            it('should render default', () => {
                const { chipGroup } = setup({}, renderOptions);

                expect(chipGroup).toBeInTheDocument();
                expect(chipGroup).toHaveClass(CLASSNAME);
            });

            it('should render children content', () => {
                setup({ children: 'Test content' }, renderOptions);

                expect(screen.getByText('Test content')).toBeInTheDocument();
            });
        });
    });
};
