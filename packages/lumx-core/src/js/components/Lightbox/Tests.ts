import { queryByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';

const CLASSNAME = 'lumx-lightbox';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const parentElement = { current: document.createElement('div') };
    const props = { isOpen: true, parentElement, ...propsOverride };
    const wrapper = render(props, options);

    const lightbox = queryByClassName(document.body, CLASSNAME);
    return { props, lightbox, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('Lightbox core tests', () => {
        describe('Visibility', () => {
            it('should render when open', () => {
                const { lightbox } = setup({ isOpen: true }, renderOptions);
                expect(lightbox).toBeInTheDocument();
                expect(lightbox).toHaveClass('lumx-lightbox--is-shown');
            });

            it('should not render when closed', () => {
                const { lightbox } = setup({ isOpen: false }, renderOptions);
                expect(lightbox).not.toBeInTheDocument();
            });
        });

        describe('Aria', () => {
            it('should apply aria-label and aria-labelledby', () => {
                const { lightbox } = setup(
                    { 'aria-label': 'My Lightbox', 'aria-labelledby': 'header-id' },
                    renderOptions,
                );
                expect(lightbox).toHaveAttribute('aria-label', 'My Lightbox');
                expect(lightbox).toHaveAttribute('aria-labelledby', 'header-id');
            });
        });
    });
};
