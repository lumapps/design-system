import { render, screen } from '@testing-library/react';

import BaseFlexBoxTests, { setup } from '@lumx/core/js/components/FlexBox/Tests';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';

import { FlexBox, FlexBoxProps } from './FlexBox';

const CLASSNAME = FlexBox.className as string;

describe(`<${FlexBox.displayName}>`, () => {
    const renderFlexBox = (props: FlexBoxProps, options?: SetupRenderOptions) =>
        render(<FlexBox {...props} />, options);

    BaseFlexBoxTests({ render: renderFlexBox, screen });

    const setupFlexBox = (props: Partial<FlexBoxProps> = {}, options: SetupRenderOptions = {}) =>
        setup(props, { ...options, render: renderFlexBox, screen });

    describe('Props', () => {
        it('should render as a different element', () => {
            const { container } = render(<FlexBox as="section" />);
            expect(container.querySelector('section')).toBeInTheDocument();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setupFlexBox, {
        baseClassName: CLASSNAME,
        forwardClassName: 'flexBox',
        forwardAttributes: 'flexBox',
    });
});
