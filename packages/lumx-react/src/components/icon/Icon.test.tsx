import React from 'react';

import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';

import { getByClassName, getByTagName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';
import Tests from '@lumx/core/js/components/Icon/Tests';
import { Icon, IconProps } from './Icon';

const CLASSNAME = Icon.className as string;

type SetupProps = Partial<IconProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: IconProps = {
        icon: 'mdiPlus',
        ...propsOverride,
    };
    render(<Icon {...props} />, { wrapper });
    const i = getByClassName(document.body, CLASSNAME);
    const svg = getByTagName(i, 'svg');
    const path = getByTagName(svg, 'path');

    return { i, svg, path, props };
};

describe(`<${Icon.displayName}>`, () => {
    Tests((props: IconProps, { wrapper }: any) => render(<Icon {...props} />, { wrapper }));

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'i',
        forwardAttributes: 'i',
        applyTheme: {
            affects: [{ element: 'i', classModifier: 'color', inverted: true }],
            viaProp: true,
            viaContext: true,
        },
    });
});
