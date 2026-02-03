import { mdiAbTesting } from '@lumx/icons';

import { ColorPalette, Theme } from '../../constants';
import { SetupOptions } from '../../../testing';
import { getByClassName, queryByClassName } from '../../../testing/queries';
import { FlagProps, CLASSNAME } from '.';

type SetupProps = Partial<FlagProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: SetupProps = {}, { render, ...options }: SetupOptions<FlagProps>) => {
    const props: FlagProps = {
        children: 'Default label',
        ...propsOverride,
    };

    render(props, options);

    const flag = getByClassName(document.body, CLASSNAME);
    const icon = queryByClassName(flag, `${CLASSNAME}__icon`);

    return { flag, icon, props };
};

export default (renderOptions: SetupOptions<FlagProps>) => {
    describe('Props', () => {
        it('should render default', () => {
            const { flag, icon } = setup({}, renderOptions);
            expect(flag).toBeInTheDocument();
            expect(flag).toHaveClass(CLASSNAME);
            expect(flag).toHaveClass(`${CLASSNAME}--color-dark`);
            expect(icon).not.toBeInTheDocument();
        });

        it('should render label content', () => {
            setup({ children: 'My Label' }, renderOptions);
            expect(renderOptions.screen.getByText('My Label')).toBeInTheDocument();
        });

        it('should apply truncate class', () => {
            const { flag } = setup({ truncate: true }, renderOptions);
            expect(flag).toHaveClass(`${CLASSNAME}--is-truncated`);
        });

        it('should render icon', () => {
            const { icon } = setup({ icon: mdiAbTesting }, renderOptions);
            expect(icon).toBeInTheDocument();
        });

        it('should render dark theme', () => {
            const { flag } = setup({ theme: Theme.dark }, renderOptions);
            expect(flag).toHaveClass(`${CLASSNAME}--color-light`);
        });

        it('should render custom color', () => {
            const { flag } = setup({ color: ColorPalette.red }, renderOptions);
            expect(flag).toHaveClass(`${CLASSNAME}--color-red`);
        });
    });
};
