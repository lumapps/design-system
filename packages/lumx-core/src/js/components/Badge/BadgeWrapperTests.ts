import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';

const CLASSNAME = 'lumx-badge-wrapper';

export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { ...propsOverride };
    const wrapper = render(props, options);

    const badgeWrapper = getByClassName(document.body, CLASSNAME);
    const div = badgeWrapper;
    return { props, badgeWrapper, div, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    const { screen } = renderOptions;

    describe('BadgeWrapper core tests', () => {
        describe('Props', () => {
            it('should render with correct class', () => {
                const { badgeWrapper } = setup({ children: 'Content', badge: 'Badge' }, renderOptions);

                expect(badgeWrapper).toHaveClass('lumx-badge-wrapper');
            });

            it('should render children content', () => {
                setup({ children: 'Child Content', badge: 'Badge' }, renderOptions);
                expect(screen.getByText('Child Content')).toBeInTheDocument();
            });

            it('should not render badge container if badge is missing', () => {
                const { badgeWrapper } = setup({ children: 'Content' }, renderOptions);
                expect(badgeWrapper.querySelector('.lumx-badge-wrapper__badge')).not.toBeInTheDocument();
            });
        });
    });
};
