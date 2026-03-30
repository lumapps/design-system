import { getByClassName, queryByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';
import { CLASSNAME } from '.';

const mockChildrenContent = 'children content';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = {
        toggleButtonProps: { label: 'Toggle' },
        children: mockChildrenContent,
        ...propsOverride,
    };

    const wrapper = render(props, options);

    const element = getByClassName(document.body, CLASSNAME);
    const header = queryByClassName(element, `${CLASSNAME}__header`);

    return { element, header, props, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('ExpansionPanel core tests', () => {
        describe('Render', () => {
            it('should render default', () => {
                const { element, header } = setup({}, renderOptions);

                expect(element).toBeInTheDocument();
                expect(element).toHaveClass(CLASSNAME);
                expect(element).toHaveClass(`${CLASSNAME}--is-close`);
                expect(element).toHaveClass(`${CLASSNAME}--theme-light`);

                expect(header).toBeInTheDocument();
            });

            it('should render open', () => {
                const { element } = setup({ isOpen: true }, renderOptions);

                expect(element).toHaveClass(`${CLASSNAME}--is-open`);
            });

            it('should show label', () => {
                const labelText = 'Label text';
                const { header } = setup({ label: labelText }, renderOptions);

                expect(header).toHaveTextContent(labelText);
            });

            it('should apply background class', () => {
                const { element } = setup({ hasBackground: true }, renderOptions);

                expect(element).toHaveClass(`${CLASSNAME}--has-background`);
            });

            it('should apply header divider class', () => {
                const { element } = setup({ hasHeaderDivider: true }, renderOptions);

                expect(element).toHaveClass(`${CLASSNAME}--has-header-divider`);
            });
        });
    });
};
