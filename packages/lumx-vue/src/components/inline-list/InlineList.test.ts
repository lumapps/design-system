import { render, screen } from '@testing-library/vue';
import BaseInlineListTests, { setup } from '@lumx/core/js/components/InlineList/Tests';
import { CLASSNAME } from '@lumx/core/js/components/InlineList';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { InlineList } from '.';

describe('<InlineList />', () => {
    const renderInlineList = ({ items, ...props }: any, options?: SetupRenderOptions<any>) =>
        render(InlineList, {
            ...options,
            props,
            slots: items ? { default: () => items } : undefined,
        });

    // Run core tests
    BaseInlineListTests({
        render: renderInlineList,
        screen,
    });

    const setupInlineList = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderInlineList, screen });

    // Common tests suite
    commonTestsSuiteVTL(setupInlineList, {
        baseClassName: CLASSNAME,
        forwardClassName: 'ul',
        forwardAttributes: 'ul',
        forwardRef: 'ul',
    });
});
