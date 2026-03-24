import { getByClassName, queryByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';
import { Orientation, Size } from '../../constants';

const CLASSNAME = 'lumx-user-block';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { ...propsOverride };
    const wrapper = render(props, options);

    const userBlock = getByClassName(document.body, CLASSNAME);
    const fields = queryByClassName(userBlock, `${CLASSNAME}__fields`);
    const div = userBlock;
    return { props, userBlock, fields, div, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    const { screen } = renderOptions;

    describe('UserBlock core tests', () => {
        describe('Props', () => {
            it('should apply orientation class', () => {
                const { userBlock } = setup({ orientation: Orientation.vertical }, renderOptions);
                expect(userBlock).toHaveClass(`${CLASSNAME}--orientation-vertical`);
            });

            it('should apply size class', () => {
                const { userBlock } = setup({ size: Size.s }, renderOptions);
                expect(userBlock).toHaveClass(`${CLASSNAME}--size-s`);
            });

            it('should render fields with string array', () => {
                const { fields } = setup({ fields: ['Field 1', 'Field 2'] }, renderOptions);
                expect(fields).toBeInTheDocument();
                expect(screen.getByText('Field 1')).toBeInTheDocument();
                expect(screen.getByText('Field 2')).toBeInTheDocument();
            });
        });
    });
};
