import { getByClassName, queryByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';

const CLASSNAME = 'lumx-list-section';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { label: 'Section label', children: 'Item', ...propsOverride };
    const wrapper = render(props, options);

    const listSection = getByClassName(document.body, CLASSNAME);
    const title = queryByClassName(listSection, `${CLASSNAME}__title`);
    const items = queryByClassName(listSection, `${CLASSNAME}__items`);
    return { props, listSection, title, items, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    const { screen } = renderOptions;

    describe('ListSection core tests', () => {
        describe('Props', () => {
            it('should render the label', () => {
                setup({ label: 'My Section' }, renderOptions);
                expect(screen.getByText('My Section')).toBeInTheDocument();
            });

            it('should render title as a <p> element', () => {
                const { title } = setup({}, renderOptions);
                expect(title?.tagName).toBe('P');
            });

            it('should render items as a <ul> element', () => {
                const { items } = setup({}, renderOptions);
                expect(items?.tagName).toBe('UL');
            });

            it('should render children inside the items list', () => {
                const { items } = setup({ children: 'Child content' }, renderOptions);
                expect(items).toHaveTextContent('Child content');
            });
        });

        describe('Accessibility', () => {
            it('should wire aria-labelledby on inner list to the title id', () => {
                const { title, items } = setup({}, renderOptions);
                const titleId = title?.getAttribute('id');
                expect(titleId).toBeTruthy();
                expect(items).toHaveAttribute('aria-labelledby', titleId);
            });

            it('should be accessible as a group via accessible name', () => {
                setup({ label: 'Fruits', itemsWrapperProps: { role: 'group' } }, renderOptions);
                expect(screen.getByRole('group', { name: 'Fruits' })).toBeInTheDocument();
            });
        });
    });
};
