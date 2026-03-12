import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import BaseInlineListTests from '@lumx/core/js/components/InlineList/Tests';
import { InlineList, InlineListProps } from '.';

const CLASSNAME = InlineList.className as string;

const setup = (propsOverride: Partial<InlineListProps> = {}) => {
    render(<InlineList {...propsOverride} />);
    const inlineList = queryByClassName(document.body, CLASSNAME);
    return { props: propsOverride, inlineList };
};

describe(`<${InlineList.displayName}>`, () => {
    // Run core tests (items array passed as children via the React wrapper)
    BaseInlineListTests({
        render: ({ items, ...props }: any) => render(<InlineList {...props}>{items}</InlineList>),
        screen,
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'inlineList',
        forwardAttributes: 'inlineList',
    });
});
