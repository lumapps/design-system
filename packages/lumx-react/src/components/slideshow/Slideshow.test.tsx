import React from 'react';

import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { Slideshow, SlideshowProps } from './Slideshow';
import { Slides } from './Slides';

const CLASSNAME = Slides.className as string;

const setup = (propsOverride: Partial<SlideshowProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: SlideshowProps = {
        slideshowControlsProps: {
            nextButtonProps: { label: 'Next' },
            previousButtonProps: { label: 'Prev' },
        },
        ...propsOverride,
    };
    render(<Slideshow {...props} />, { wrapper });
    const slideShow = queryByClassName(document.body, CLASSNAME);
    return { props, slideShow };
};

describe(`<${Slideshow.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'slideShow',
        forwardAttributes: 'slideShow',
        applyTheme: {
            affects: [{ element: 'slideShow' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
