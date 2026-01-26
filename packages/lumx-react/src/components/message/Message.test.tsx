import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { Kind } from '@lumx/react';

import { queryByRole, render } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { mdiAbTesting } from '@lumx/icons';

import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
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
    const closeButton = queryByRole(message, 'button', { name: props.closeButtonProps?.label });
    return { message, icon, closeButton, props };
};

describe(`<${Message.displayName}>`, () => {
    describe('Props', () => {
        it('should render default', () => {
            const { message, icon } = setup({ children: 'Message text' });
            expect(message).toBeInTheDocument();
            expect(message.className).toMatchInlineSnapshot('"lumx-message"');
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
            const { message, icon, closeButton } = setup({ kind });
            expect(message.className).toEqual(expect.stringMatching(/\blumx-message--color-\w+\b/));
            expect(icon).toBeInTheDocument();
            expect(closeButton).not.toBeInTheDocument();
        });

        it('should use correct icon color based on kind', () => {
            const { icon } = setup({ kind: Kind.error });
            expect(icon).toHaveClass('lumx-icon--color-red');
        });

        it('should render close button', async () => {
            const onClick = vi.fn();
            const { closeButton } = setup({
                hasBackground: true,
                kind: 'info',
                closeButtonProps: {
                    label: 'Close',
                    onClick,
                },
            });

            expect(closeButton).toBeInTheDocument();

            await userEvent.click(closeButton as HTMLElement);

            expect(onClick).toHaveBeenCalled();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, { baseClassName: CLASSNAME, forwardClassName: 'message', forwardAttributes: 'message' });
});
