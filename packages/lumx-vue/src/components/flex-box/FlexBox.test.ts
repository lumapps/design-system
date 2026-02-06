import { render, screen } from '@testing-library/vue';

import BaseFlexBoxTests, { setup } from '@lumx/core/js/components/FlexBox/Tests';
import { CLASSNAME, FlexBoxProps } from '@lumx/core/js/components/FlexBox';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { FlexBox } from '.';

describe('<FlexBox />', () => {
    function renderFlexBox({ children, ...props }: FlexBoxProps, options?: SetupRenderOptions<FlexBoxProps>) {
        return render(FlexBox, {
            props,
            slots: children ? { default: children } : undefined,
            ...options,
        });
    }

    BaseFlexBoxTests({ render: renderFlexBox, screen });

    const setupFlexBox = (props: Partial<FlexBoxProps> = {}, options: SetupRenderOptions<FlexBoxProps> = {}) =>
        setup(props, { ...options, render: renderFlexBox, screen });

    describe('Props', () => {
        it('should render as a different element', () => {
            const { container } = render(FlexBox, { props: { as: 'section' } as any });
            expect(container.querySelector('section')).toBeInTheDocument();
        });
    });

    commonTestsSuiteVTL(setupFlexBox, {
        baseClassName: CLASSNAME,
        forwardClassName: 'flexBox',
        forwardAttributes: 'flexBox',
    });
});
