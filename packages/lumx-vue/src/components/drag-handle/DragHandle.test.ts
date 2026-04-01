import { render, screen } from '@testing-library/vue';
import BaseDragHandleTests, { setup } from '@lumx/core/js/components/DragHandle/Tests';
import { CLASSNAME, DragHandleProps } from '@lumx/core/js/components/DragHandle';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { DragHandle } from '.';

describe('<DragHandle />', () => {
    const renderDragHandle = (props: DragHandleProps, options?: SetupRenderOptions<DragHandleProps>) =>
        render(DragHandle, { props, ...options });

    BaseDragHandleTests({ render: renderDragHandle, screen });

    const setupDragHandle = (props: Partial<DragHandleProps> = {}, options: SetupRenderOptions<DragHandleProps> = {}) =>
        setup(props, { ...options, render: renderDragHandle, screen });

    describe('Vue', () => {
        it('should render with default theme from context', () => {
            const { handle } = setupDragHandle();
            expect(handle).toBeInTheDocument();
            expect(handle).toHaveClass(CLASSNAME);
        });
    });

    commonTestsSuiteVTL(setupDragHandle, {
        baseClassName: CLASSNAME,
        forwardClassName: 'handle',
        forwardAttributes: 'handle',
        applyTheme: {
            affects: [{ element: 'handle' }],
            viaProp: true,
            viaContext: true,
        },
    });
});
