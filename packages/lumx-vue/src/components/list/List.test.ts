import { render, screen } from '@testing-library/vue';

import { CLASSNAME } from '@lumx/core/js/components/List';
import BaseListTests, { setup } from '@lumx/core/js/components/List/ListTests';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { List } from '.';

describe('<List />', () => {
    const renderList = ({ children, ...props }: any, options?: SetupRenderOptions<any>) =>
        render(List, {
            ...options,
            props,
            slots: children ? { default: children } : undefined,
        });

    // Run core tests
    BaseListTests({ render: renderList, screen });

    const setupList = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderList, screen });

    // Common tests suite
    commonTestsSuiteVTL(setupList, {
        baseClassName: CLASSNAME,
        forwardClassName: 'list',
        forwardAttributes: 'list',
    });
});
