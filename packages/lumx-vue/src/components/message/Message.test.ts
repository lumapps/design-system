import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { queryByRole } from '@testing-library/dom';

import BaseMessageTests, { setup } from '@lumx/core/js/components/Message/Tests';
import { MessageProps, CLASSNAME } from '@lumx/core/js/components/Message';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';
import { Kind } from '@lumx/core/js/constants';
import { getByClassName } from '@lumx/core/testing/queries';

import { Message } from '.';
import type { MessageProps as VueMessageProps } from './Message';

describe('<Message />', () => {
    // Translate core MessageProps to Vue MessageProps
    const renderMessage = (props: MessageProps, options?: SetupRenderOptions<MessageProps>) => {
        const { closeButtonProps, ...restProps } = props;
        const vueProps: any = {
            ...restProps,
            closeButtonLabel: closeButtonProps?.label,
        };
        return render(Message, { props: vueProps, ...options, slots: { default: props.children } });
    };

    BaseMessageTests({ render: renderMessage, screen });

    const setupMessage = (props: Partial<MessageProps> = {}, options: SetupRenderOptions<MessageProps> = {}) =>
        setup(props, { ...options, render: renderMessage, screen });

    // Custom setup for Vue-specific tests
    const setupVueMessage = (
        propsOverride: Partial<VueMessageProps> = {},
        options: SetupRenderOptions<VueMessageProps> = {},
    ) => {
        const props: VueMessageProps = {
            ...propsOverride,
        };

        const renderResult = render(Message, {
            props,
            ...options,
            slots: { default: () => 'Message text' },
        });

        const message = getByClassName(document.body, CLASSNAME);
        const closeButton = queryByRole(message, 'button', { name: props.closeButtonLabel });

        return { message, closeButton, props, ...renderResult };
    };

    describe('Props', () => {
        it('should render close button', async () => {
            const { closeButton } = setupVueMessage({
                hasBackground: true,
                kind: Kind.info,
                closeButtonLabel: 'Close',
            });

            expect(closeButton).toBeInTheDocument();
        });
    });

    describe('Emits', () => {
        it('should emit close event when close button is clicked', async () => {
            const { closeButton, emitted } = setupVueMessage({
                hasBackground: true,
                kind: Kind.info,
                closeButtonLabel: 'Close',
            });

            expect(closeButton).toBeInTheDocument();

            await userEvent.click(closeButton as HTMLElement);

            expect(emitted()).toHaveProperty('close');
            expect(emitted().close).toHaveLength(1);
        });
    });

    commonTestsSuiteVTL(setupMessage, {
        baseClassName: CLASSNAME,
        forwardClassName: 'message',
        forwardAttributes: 'message',
    });
});
