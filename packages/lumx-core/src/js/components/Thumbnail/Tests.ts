import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';
import { CLASSNAME } from '.';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { alt: 'Thumbnail', image: 'https://example.com/image.jpg', ...propsOverride };
    const wrapper = render(props, options);

    const thumbnail = getByClassName(document.body, CLASSNAME);
    return { props, thumbnail, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('Thumbnail core tests', () => {
        describe('Props', () => {
            it('should render loading skeleton', () => {
                const { thumbnail } = setup({ isLoading: true }, renderOptions);
                expect(thumbnail).toHaveClass(`${CLASSNAME}--is-loading`);
                expect(thumbnail?.querySelector(`.${CLASSNAME}__image--is-loading`)).toBeInTheDocument();
            });

            it('should apply objectFit class', () => {
                const { thumbnail } = setup({ objectFit: 'cover' }, renderOptions);
                expect(thumbnail).toHaveClass(`${CLASSNAME}--object-fit-cover`);
            });
        });
    });
};
