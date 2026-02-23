import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';
import { Size } from '../../constants';

const CLASSNAME = 'lumx-avatar';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { image: 'test.png', alt: 'Avatar', ...propsOverride };
    const wrapper = render(props, options);

    const avatar = getByClassName(document.body, CLASSNAME);
    return { props, avatar, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('Avatar core tests', () => {
        describe('Props', () => {
            it('should use default props', () => {
                const { avatar } = setup({}, renderOptions);

                expect(avatar.className).toContain('lumx-avatar');
                expect(avatar.className).toContain('lumx-avatar--size-m');
            });

            it('should render size', () => {
                const { avatar } = setup({ size: Size.xl }, renderOptions);
                expect(avatar).toHaveClass('lumx-avatar--size-xl');
            });
        });
    });
};
