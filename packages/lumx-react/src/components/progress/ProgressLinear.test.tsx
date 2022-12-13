import React from 'react';

import { getByClassName } from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { Theme } from '@lumx/react';

import { ProgressLinear, ProgressLinearProps } from './ProgressLinear';

const CLASSNAME = ProgressLinear.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<ProgressLinearProps> = {}) => {
    const { container } = render(<ProgressLinear {...(props as any)} />);
    const element = getByClassName(container, CLASSNAME);
    return { container, element, props };
};

describe(`<${ProgressLinear.displayName}>`, () => {
    it('should render default', () => {
        const { element } = setup();
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass(CLASSNAME);
        expect(element).toHaveClass(`${CLASSNAME}--theme-light`);
    });

    it('should render dark theme', () => {
        const { element } = setup({ theme: Theme.dark });
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass(CLASSNAME);
        expect(element).toHaveClass(`${CLASSNAME}--theme-dark`);
    });

    commonTestsSuiteRTL(setup, { baseClassName: CLASSNAME, forwardClassName: 'element', forwardAttributes: 'element' });
});
