import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { Slider, SliderProps } from './Slider';

const CLASSNAME = Slider.className as string;

jest.mock('@lumx/react/hooks/useId', () => ({ useId: () => ':r1:' }));

const setup = (props: Partial<SliderProps> = {}) => {
    render(<Slider {...(props as any)} />);
    const slider = queryByClassName(document.body, CLASSNAME);
    return { props, slider };
};

describe(`<${Slider.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'slider',
        forwardAttributes: 'slider',
    });
});
