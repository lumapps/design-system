import React from 'react';

import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { Slider, SliderProps } from './Slider';

const CLASSNAME = Slider.className as string;

vi.mock('@lumx/react/hooks/useId', () => ({ useId: () => ':r1:' }));

const setup = (props: Partial<SliderProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    render(<Slider {...(props as any)} />, { wrapper });
    const slider = queryByClassName(document.body, CLASSNAME);
    return { props, slider };
};

describe(`<${Slider.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'slider',
        forwardAttributes: 'slider',
        applyTheme: {
            affects: [{ element: 'slider' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
