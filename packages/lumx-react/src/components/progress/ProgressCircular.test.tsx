import React from 'react';

import { getByClassName } from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';

import { ProgressCircular, ProgressCircularProps } from './ProgressCircular';

const CLASSNAME = ProgressCircular.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<ProgressCircularProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const { container } = render(<ProgressCircular {...(props as any)} />, { wrapper });
    const element = getByClassName(container, CLASSNAME);
    return { container, element, props };
};

describe(`<${ProgressCircular.displayName}>`, () => {
    it('should render default', () => {
        const { element } = setup();
        expect(element).toHaveClass(`${CLASSNAME}--size-m`);
        expect(element.tagName).toBe('DIV');
    });

    it('should render size xs', () => {
        const { element } = setup({ size: 'xs' });
        expect(element).toHaveClass(`${CLASSNAME}--size-xs`);
    });

    it('should render display inline', () => {
        const { element } = setup({ display: 'inline' });
        expect(element.tagName).toBe('SPAN');
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        applyTheme: {
            affects: [{ element: 'element' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
