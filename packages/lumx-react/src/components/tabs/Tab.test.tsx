import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import BaseTabTests from '@lumx/core/js/components/Tabs/Tests';

import { Tab, TabProps } from './Tab';

const CLASSNAME = Tab.className as string;

const setup = (propsOverride: Partial<TabProps> = {}) => {
    const props = { label: 'Label', ...propsOverride };
    render(<Tab {...props} />);
    const tab = getByClassName(document.body, CLASSNAME);
    return { props, tab };
};

describe(`<${Tab.displayName}>`, () => {
    BaseTabTests({
        render: (props: TabProps) => render(<Tab {...props} />),
        screen,
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tab',
        forwardAttributes: 'tab',
        forwardRef: 'tab',
    });
});
