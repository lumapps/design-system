import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';

const CLASSNAME = 'lumx-toolbar';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { ...propsOverride };
    const wrapper = render(props, options);

    const toolbar = getByClassName(document.body, CLASSNAME);
    const div = toolbar; // Alias for commonTestsSuite compatibility
    return { props, toolbar, div, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('Toolbar core tests', () => {
        describe('Props', () => {
            it('should apply modifier classes', () => {
                const { toolbar } = setup(
                    {
                        before: 'Before',
                        label: 'Label',
                        after: 'After',
                    },
                    renderOptions,
                );

                expect(toolbar).toHaveClass(`${CLASSNAME}--has-before`);
                expect(toolbar).toHaveClass(`${CLASSNAME}--has-label`);
                expect(toolbar).toHaveClass(`${CLASSNAME}--has-after`);
            });

            it('should apply only relevant modifier classes', () => {
                const { toolbar } = setup(
                    {
                        label: 'Label only',
                    },
                    renderOptions,
                );

                expect(toolbar).toHaveClass(`${CLASSNAME}--has-label`);
                expect(toolbar).not.toHaveClass(`${CLASSNAME}--has-before`);
                expect(toolbar).not.toHaveClass(`${CLASSNAME}--has-after`);
            });
        });
    });
};
