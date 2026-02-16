import { render, screen } from '@testing-library/vue';
import BaseGridColumnTests, { setup } from '@lumx/core/js/components/GridColumn/GridColumnTests';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';
import { h } from 'vue';

import { GridColumn } from '.';

const CLASSNAME = 'lumx-grid-column';

describe('<GridColumn />', () => {
    const renderGridColumn = ({ children, ...props }: any, options?: SetupRenderOptions<any>) =>
        render(GridColumn, {
            ...options,
            props,
            slots: children ? { default: children } : undefined,
        });

    // Run core tests
    BaseGridColumnTests({
        render: renderGridColumn,
        screen,
    });

    const setupGridColumn = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderGridColumn, screen });

    // Vue-specific tests
    describe('Vue', () => {
        it('should create default component', () => {
            const { container } = render(GridColumn, {
                slots: {
                    default: () => [h('p', 'Content 1'), h('p', 'Content 2'), h('p', 'Content 3')],
                },
            });

            const gridColumn = container.querySelector(`.${CLASSNAME}`);
            expect(gridColumn).toBeInTheDocument();
            expect(gridColumn?.children).toHaveLength(3);
        });

        it('should render as a different element', () => {
            const { container } = render(GridColumn, {
                props: { as: 'section' },
                slots: { default: () => 'Content' },
            });
            expect(container.querySelector('section')).toBeInTheDocument();
        });
    });

    // Common tests suite
    commonTestsSuiteVTL(setupGridColumn, {
        baseClassName: CLASSNAME,
        forwardClassName: 'div',
        forwardAttributes: 'div',
        forwardRef: 'div',
    });
});
