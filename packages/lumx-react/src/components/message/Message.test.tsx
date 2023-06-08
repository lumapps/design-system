import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { Kind } from '@lumx/react';

import React from 'react';
import { render } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { mdiAbTesting } from '@lumx/icons';
import { Message, MessageProps } from './Message';

const CLASSNAME = Message.className as string;

type SetupProps = Partial<MessageProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}) => {
    const props: any = { ...propsOverride };
    render(<Message {...props} />);
    const message = getByClassName(document.body, CLASSNAME);
    const icon = queryByClassName(message, `${CLASSNAME}__icon`);
    return { message, icon, props };
};

describe(`<${Message.displayName}>`, () => {
    describe('Props', () => {
        it('should render default', () => {
            const { message, icon } = setup({ children: 'Message text' });
            expect(message).toBeInTheDocument();
            expect(message.className).toMatchInlineSnapshot(`"lumx-message"`);
            expect(message).toHaveTextContent('Message text');

            expect(icon).not.toBeInTheDocument();
        });

        it('should render hasBackground', () => {
            const { message } = setup({ hasBackground: true });
            expect(message).toHaveClass(`${CLASSNAME}--has-background`);
        });

        it('should render icon', () => {
            const { icon } = setup({ icon: mdiAbTesting });
            expect(icon).toBeInTheDocument();
        });

        it.each(Object.values(Kind))('should render kind %s', (kind) => {
            const { message, icon } = setup({ kind });
            expect(message.className).toEqual(expect.stringMatching(/\blumx-message--color-\w+\b/));
            expect(icon).toBeInTheDocument();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, { baseClassName: CLASSNAME, forwardClassName: 'message', forwardAttributes: 'message' });
});
