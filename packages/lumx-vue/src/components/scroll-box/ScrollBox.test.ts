import { render, screen } from '@testing-library/vue';

import BaseScrollBoxTests, { setup } from '@lumx/core/js/components/ScrollBox/Tests';
import { ScrollBoxProps, CLASSNAME } from '@lumx/core/js/components/ScrollBox';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { ScrollBox } from '.';

describe('<ScrollBox />', () => {
    function renderScrollBox({ children, ...props }: ScrollBoxProps, options?: SetupRenderOptions<ScrollBoxProps>) {
        return render(ScrollBox, {
            props,
            slots: children ? { default: children } : undefined,
            ...options,
        });
    }

    BaseScrollBoxTests({ render: renderScrollBox, screen });

    const setupScrollBox = (props: Partial<ScrollBoxProps> = {}, options: SetupRenderOptions<ScrollBoxProps> = {}) =>
        setup(props, { ...options, render: renderScrollBox, screen });

    commonTestsSuiteVTL(setupScrollBox, {
        baseClassName: CLASSNAME,
        forwardClassName: 'scrollBox',
        forwardAttributes: 'scrollBox',
    });
});
