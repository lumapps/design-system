import { render, screen } from '@testing-library/react';

import BaseScrollBoxTests, { setup } from '@lumx/core/js/components/ScrollBox/Tests';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';

import { ScrollBox, ScrollBoxProps } from './ScrollBox';

const CLASSNAME = ScrollBox.className as string;

describe(`<${ScrollBox.displayName}>`, () => {
    const renderScrollBox = (props: ScrollBoxProps, options?: SetupRenderOptions) =>
        render(<ScrollBox {...props} />, options);

    BaseScrollBoxTests({ render: renderScrollBox, screen });

    const setupScrollBox = (props: Partial<ScrollBoxProps> = {}, options: SetupRenderOptions = {}) =>
        setup(props, { ...options, render: renderScrollBox, screen });

    // Common tests suite.
    commonTestsSuiteRTL(setupScrollBox, {
        baseClassName: CLASSNAME,
        forwardClassName: 'scrollBox',
        forwardAttributes: 'scrollBox',
        forwardRef: 'scrollBox',
    });
});
