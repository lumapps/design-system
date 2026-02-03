import { render, screen } from '@testing-library/react';

import BaseFlagTests, { setup } from '@lumx/core/js/components/Flag/Tests';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';

import { Flag } from './Flag';

const CLASSNAME = Flag.className as string;

describe(`<${Flag.displayName} />`, () => {
    const renderFlag = (props: any, options?: SetupRenderOptions) => {
        const { children, ...restProps } = props;
        return render(<Flag {...restProps} label={children} />, options);
    };

    BaseFlagTests({ render: renderFlag, screen });

    const setupFlag = (props: Partial<any> = {}, options: SetupRenderOptions = {}) =>
        setup(props, { ...options, render: renderFlag, screen });

    // Common tests suite.
    commonTestsSuiteRTL(setupFlag, {
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
