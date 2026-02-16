import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';

import { CLASSNAME, ThOrder } from './TableCell';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { ...propsOverride };
    const wrapper = render(props, options);

    const tableCell = getByClassName(document.body, CLASSNAME);
    return { props, tableCell, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('TableCell core tests', () => {
        describe('Props', () => {
            it('should render with base class name and content wrapper', () => {
                const content = 'Content';
                const { tableCell } = setup({ children: content }, renderOptions);
                expect(tableCell).toHaveClass(CLASSNAME);
                const contentEl = getByClassName(tableCell, `${CLASSNAME}-content`);
                expect(contentEl).toBeInTheDocument();
            });

            it('should have head variant class', () => {
                const content = 'Content';
                const { tableCell } = setup({ children: content, variant: 'head' }, renderOptions);
                expect(tableCell).toHaveClass(`${CLASSNAME}--head`);
            });

            it('should render sortable with is-sortable class', () => {
                const { tableCell } = setup({ variant: 'head', isSortable: true }, renderOptions);
                expect(tableCell).toHaveAttribute('aria-sort', 'none');
                expect(tableCell).toHaveClass(`${CLASSNAME}--is-sortable`);
            });

            it('should render sortable ascending with is-sorted class', () => {
                const { tableCell } = setup(
                    { variant: 'head', sortOrder: ThOrder.asc, isSortable: true },
                    renderOptions,
                );
                expect(tableCell).toHaveAttribute('aria-sort', 'ascending');
                expect(tableCell).toHaveClass(`${CLASSNAME}--is-sorted`);
            });

            it('should render sortable descending with is-sorted class', () => {
                const { tableCell } = setup(
                    { variant: 'head', sortOrder: ThOrder.desc, isSortable: true },
                    renderOptions,
                );
                expect(tableCell).toHaveAttribute('aria-sort', 'descending');
                expect(tableCell).toHaveClass(`${CLASSNAME}--is-sorted`);
            });

            it('should have body variant class', () => {
                const { tableCell } = setup({ children: 'Content', variant: 'body' }, renderOptions);
                expect(tableCell).toHaveClass(`${CLASSNAME}--body`);
            });
        });
    });
};
