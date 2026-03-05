import { render, screen } from '@testing-library/vue';

import { CLASSNAME } from '@lumx/core/js/components/List/ListSection';
import BaseListSectionTests, { setup } from '@lumx/core/js/components/List/ListSectionTests';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { ListSection } from '.';

describe('<ListSection />', () => {
    const renderListSection = ({ children, Text: _Text, ...props }: any, options?: SetupRenderOptions<any>) =>
        render(ListSection, {
            ...options,
            props,
            slots: children ? { default: children } : undefined,
        });

    // Run core tests
    BaseListSectionTests({ render: renderListSection, screen });

    const setupListSection = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderListSection, screen });

    // Common tests suite
    commonTestsSuiteVTL(setupListSection, {
        baseClassName: CLASSNAME,
        forwardClassName: 'listSection',
        forwardAttributes: 'listSection',
        forwardRef: 'listSection',
    });
});
