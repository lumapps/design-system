import React from 'react';

import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen } from '@testing-library/react';
import { ThemeSentinel } from '@lumx/react/testing/utils/ThemeSentinel';

import { Lightbox, LightboxProps } from './Lightbox';

const CLASSNAME = Lightbox.className as string;

const setup = (props: Partial<LightboxProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const propsOverride = {
        isOpen: true,
        children: <ThemeSentinel />,
        ...props,
    } as any;
    const { container } = render(<Lightbox {...propsOverride} />, { wrapper });
    const lightbox = queryByClassName(document.body, CLASSNAME);
    const themeSentinel = screen.queryByTestId(ThemeSentinel.testId);
    return { props, container, lightbox, themeSentinel };
};

describe(`<${Lightbox.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'lightbox',
        forwardAttributes: 'lightbox',
        forwardRef: 'lightbox',
        applyTheme: {
            affects: [{ not: { element: 'themeSentinel' } }],
            viaProp: true,
            viaContext: true,
        },
    });
});
