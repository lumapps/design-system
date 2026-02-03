import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import BaseMessageTests, { setup } from '@lumx/core/js/components/Message/Tests';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';
import { Kind } from '@lumx/core/js/constants';

import { Message, MessageProps } from '.';

const CLASSNAME = Message.className as string;

describe('<Message />', () => {
    const renderMessage = (props: MessageProps, options?: SetupRenderOptions<MessageProps>) =>
        render(Message, { props, ...options, slots: { default: props.children } });

    BaseMessageTests({ render: renderMessage, screen });

    const setupMessage = (props: Partial<MessageProps> = {}, options: SetupRenderOptions<MessageProps> = {}) =>
        setup(props, { ...options, render: renderMessage, screen });

    describe('Props', () => {
        it('should render close button', async () => {
            const onClick = vi.fn();
            const { closeButton } = setupMessage({
                hasBackground: true,
                kind: Kind.info,
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

    commonTestsSuiteVTL(setupMessage, {
        baseClassName: CLASSNAME,
        forwardClassName: 'message',
        forwardAttributes: 'message',
    });
});
