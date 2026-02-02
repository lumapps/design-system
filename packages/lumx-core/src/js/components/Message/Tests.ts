import { queryByRole } from '@testing-library/dom';
import { Kind } from '../../constants';
import { SetupOptions } from '../../../testing';
import { getByClassName, queryByClassName } from '../../../testing/queries';
import { MessageProps, CLASSNAME } from '.';

type SetupProps = Partial<MessageProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: SetupProps = {}, { render, ...options }: SetupOptions<MessageProps>) => {
    const props: MessageProps = {
        children: 'Message text',
        ...propsOverride,
    };

    render(props, options);

    const message = getByClassName(document.body, CLASSNAME);
    const icon = queryByClassName(message, `${CLASSNAME}__icon`);
    const closeButton = queryByRole(message, 'button', { name: props.closeButtonProps?.label });

    return { message, icon, closeButton, props };
};

export default (renderOptions: SetupOptions<MessageProps>) => {
    describe('Props', () => {
        it('should render default', () => {
            const { message, icon } = setup({ children: 'Message text' }, renderOptions);
            expect(message).toBeInTheDocument();
            expect(message).toHaveClass(CLASSNAME);
            expect(message).toHaveTextContent('Message text');

            expect(icon).not.toBeInTheDocument();
        });

        it('should render hasBackground', () => {
            const { message } = setup({ hasBackground: true }, renderOptions);
            expect(message).toHaveClass(`${CLASSNAME}--has-background`);
        });

        it('should render icon', () => {
            const { icon } = setup({ icon: 'M123' }, renderOptions);
            expect(icon).toBeInTheDocument();
        });

        it.each(Object.values(Kind))('should render kind %s', (kind) => {
            const { message, icon, closeButton } = setup({ kind }, renderOptions);
            expect(message.className).toMatch(new RegExp(String.raw`\b${CLASSNAME}--color-\w+\b`));
            expect(icon).toBeInTheDocument();
            expect(closeButton).not.toBeInTheDocument();
        });

        it('should use correct icon color based on kind', () => {
            const { icon } = setup({ kind: Kind.error }, renderOptions);
            expect(icon).toHaveClass('lumx-icon--color-red');
        });

        it('should render close button', () => {
            const { closeButton } = setup(
                {
                    hasBackground: true,
                    kind: Kind.info,
                    closeButtonProps: {
                        label: 'Close',
                        onClick: () => {},
                    },
                },
                renderOptions,
            );

            expect(closeButton).toBeInTheDocument();
        });
    });
};
