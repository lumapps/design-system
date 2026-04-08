import { queryByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';

const CLASSNAME = 'lumx-dialog';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { isOpen: true, ...propsOverride };
    const wrapper = render(props, options);

    const dialog = queryByClassName(document.body, CLASSNAME);
    const container = dialog && queryByClassName(dialog, `${CLASSNAME}__container`);
    return { props, dialog, container, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    const { screen } = renderOptions;

    describe('Dialog core tests', () => {
        describe('Props', () => {
            it('should render default', () => {
                const { dialog, container } = setup({}, renderOptions);

                expect(dialog).toBeInTheDocument();
                expect(container).toBe(screen.queryByRole('dialog'));
                expect(container).toHaveAttribute('aria-modal', 'true');
            });

            it('should render progress indicator when isLoading is true', () => {
                setup({ isLoading: true }, renderOptions);
                const progress = document.querySelector('.lumx-progress-circular');
                expect(progress).toBeInTheDocument();
            });
        });

        describe('Structure', () => {
            it('should render header and footer from props', () => {
                setup({ header: 'Header Prop', footer: 'Footer Prop' }, renderOptions);
                expect(screen.getByText('Header Prop').closest(`.${CLASSNAME}__header`)).toBeInTheDocument();
                expect(screen.getByText('Footer Prop').closest(`.${CLASSNAME}__footer`)).toBeInTheDocument();
            });
        });
    });
};
