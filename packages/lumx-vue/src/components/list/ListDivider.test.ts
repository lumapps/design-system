import { render, screen } from '@testing-library/vue';

import { CLASSNAME } from '@lumx/core/js/components/List/ListDivider';
import BaseListDividerTests, { setup } from '@lumx/core/js/components/List/ListDividerTests';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { ListDivider } from '.';

describe('<ListDivider />', () => {
    const renderListDivider = (props: any = {}, options?: SetupRenderOptions<any>) =>
        render(ListDivider, {
            ...options,
            props,
        });

    // Run core tests
    BaseListDividerTests({ render: renderListDivider, screen });

    const setupListDivider = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderListDivider, screen });

    // Common tests suite
    commonTestsSuiteVTL(setupListDivider, {
        baseClassName: CLASSNAME,
        forwardClassName: 'listDivider',
        forwardAttributes: 'listDivider',
    });
});
