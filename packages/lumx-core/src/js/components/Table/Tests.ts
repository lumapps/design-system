import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';

import { CLASSNAME } from './constants';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { ...propsOverride };
    const wrapper = render(props, options);

    const table = getByClassName(document.body, CLASSNAME);
    return { props, table, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('Table core tests', () => {
        describe('Props', () => {
            it('should render hasBefore', () => {
                const { table } = setup({ hasBefore: true }, renderOptions);
                expect(table).toHaveClass(`${CLASSNAME}--has-before`);
            });

            it('should render hasDividers', () => {
                const { table } = setup({ hasDividers: true }, renderOptions);
                expect(table).toHaveClass(`${CLASSNAME}--has-dividers`);
            });
        });
    });
};
