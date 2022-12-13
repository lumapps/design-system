import React from 'react';

import { getByClassName } from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { Theme } from '@lumx/react';

import { ProgressCircular, ProgressCircularProps } from './ProgressCircular';

const CLASSNAME = ProgressCircular.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<ProgressCircularProps> = {}) => {
    const { container } = render(<ProgressCircular {...(props as any)} />);
    const element = getByClassName(container, CLASSNAME);
    return { container, element, props };
};

describe(`<${ProgressCircular.displayName}>`, () => {
    it('should render default', () => {
        const { element } = setup();
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass(CLASSNAME);
        expect(element).toHaveClass(`${CLASSNAME}--theme-light`);
        expect(element).toHaveClass(`${CLASSNAME}--size-m`);
    });

    it('should render dark theme', () => {
        const { element } = setup({ theme: Theme.dark });
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass(CLASSNAME);
        expect(element).toHaveClass(`${CLASSNAME}--theme-dark`);
    });

    it('should render size xs', () => {
        const { element } = setup({ size: 'xs' });
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass(CLASSNAME);
        expect(element).toHaveClass(`${CLASSNAME}--size-xs`);
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
    });
});
