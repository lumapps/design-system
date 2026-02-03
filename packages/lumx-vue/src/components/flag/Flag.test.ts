import { render, screen } from '@testing-library/vue';

import BaseFlagTests, { setup } from '@lumx/core/js/components/Flag/Tests';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Flag, FlagProps } from '.';

const CLASSNAME = Flag.className as string;

describe('<Flag />', () => {
    const renderFlag = (props: FlagProps, options?: SetupRenderOptions<FlagProps>) =>
        render(Flag, { props, ...options, slots: { default: props.children } });

    BaseFlagTests({ render: renderFlag, screen });

    const setupFlag = (props: Partial<FlagProps> = {}, options: SetupRenderOptions<FlagProps> = {}) =>
        setup(props, { ...options, render: renderFlag, screen });

    commonTestsSuiteVTL(setupFlag, {
        baseClassName: CLASSNAME,
        forwardClassName: 'flag',
        forwardAttributes: 'flag',
        applyTheme: {
            affects: [{ element: 'flag', classModifier: 'color', inverted: true }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
