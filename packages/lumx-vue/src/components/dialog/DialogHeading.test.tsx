import { cleanup, render, screen } from '@testing-library/vue';

import { CLASSNAME } from '@lumx/core/js/components/Heading';
import { commonTestsSuiteVTL, type SetupRenderOptions } from '@lumx/vue/testing';
import { getByClassName } from '@lumx/core/testing/queries';
import { DialogHeadingTests } from '@lumx/core/js/components/Dialog/DialogHeadingTests';

import { DialogHeading, type DialogHeadingProps } from '.';

const setup = (
    props: Partial<DialogHeadingProps> & { className?: string } = {},
    options: SetupRenderOptions<any> = {},
) => {
    const { children, ...restProps } = props as any;
    const { container } = render(DialogHeading, {
        ...options,
        props: restProps,
        slots: { default: () => children ?? 'Title' },
    });
    return { props, container, dialogHeading: getByClassName(container as HTMLElement, CLASSNAME) };
};

afterEach(cleanup);

describe('<DialogHeading>', () => {
    // Core shared tests: standalone render (id generation, heading role).
    DialogHeadingTests({
        render: ({ children, ...props }: any) => render(DialogHeading, { props, slots: { default: () => children } }),
        screen,
    });

    // Common tests suite.
    commonTestsSuiteVTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'dialogHeading',
        forwardAttributes: 'dialogHeading',
    });
});
