import { queryAllByTagName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { forceOpen: true, label: 'Tooltip label', ...propsOverride };
    const wrapper = render(props, options);
    const tooltip = document.querySelector(`[role="tooltip"]`);
    return { props, tooltip, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('Tooltip core tests', () => {
        it('should not render with empty label', () => {
            const { tooltip } = setup({ label: undefined }, renderOptions);
            expect(tooltip).not.toBeInTheDocument();
        });

        it('should render with label', () => {
            const { tooltip } = setup({ label: 'Tooltip label' }, renderOptions);
            expect(tooltip).toBeInTheDocument();
            expect(tooltip).toHaveTextContent('Tooltip label');
        });

        it('should render with custom placement', () => {
            const { tooltip } = setup({ placement: 'top' }, renderOptions);
            expect(tooltip).toHaveAttribute('data-popper-placement', 'top');
        });

        it('should render multiline', () => {
            const { tooltip } = setup({ label: 'Line 1\nLine 2' }, renderOptions);
            const paragraphs = queryAllByTagName(tooltip as HTMLElement, 'p');
            expect(paragraphs.length).toBe(2);
            expect(paragraphs[0]).toHaveTextContent('Line 1');
            expect(paragraphs[1]).toHaveTextContent('Line 2');
        });
    });
};
