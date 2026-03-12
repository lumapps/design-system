import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import BaseDragHandleTests, { setup } from '@lumx/core/js/components/DragHandle/Tests';
import { DragHandleProps } from '@lumx/core/js/components/DragHandle';

import { render, screen } from '@testing-library/react';
import { DragHandle } from './DragHandle';

const CLASSNAME = DragHandle.className as string;

describe(`<${DragHandle.displayName}>`, () => {
    const renderDragHandle = (props: DragHandleProps, options?: SetupRenderOptions) => {
        return render(<DragHandle {...props} />, options);
    };

    BaseDragHandleTests({ render: renderDragHandle, screen });

    const setupDragHandle = (props: Partial<DragHandleProps> = {}, options: SetupRenderOptions = {}) =>
        setup(props, { ...options, render: renderDragHandle, screen });

    commonTestsSuiteRTL(setupDragHandle, {
        baseClassName: CLASSNAME,
        forwardClassName: 'handle',
        forwardAttributes: 'handle',
        forwardRef: 'handle',
        applyTheme: {
            affects: [{ element: 'handle' }],
            viaProp: true,
            viaContext: true,
        },
    });
});
