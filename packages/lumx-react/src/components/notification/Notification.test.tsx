import { IconButton, Kind } from '@lumx/react';
import { mdiClose } from '@lumx/icons';
import { render, within, screen } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import userEvent from '@testing-library/user-event';

import { Notification, NotificationProps } from './Notification';

const CLASSNAME = Notification.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<NotificationProps<typeof IconButton>> = {}) => {
    render(<Notification isOpen type={Kind.info} {...props} />);
    const notification = queryByClassName(document.body, CLASSNAME);

    const icon = notification && queryByClassName(notification, `${CLASSNAME}__icon`);
    const action = notification && queryByClassName(notification, `${CLASSNAME}__action`);
    const actionButton = action && within(action).queryByRole('button');

    return { action, actionButton, icon, notification, props };
};

describe(`<${Notification.displayName}>`, () => {
    it('should not render without type', () => {
        const { notification } = setup({ type: undefined });
        expect(notification).not.toBeInTheDocument();
    });

    it('should not render when closed', () => {
        const { notification } = setup({ isOpen: false });
        expect(notification).not.toBeInTheDocument();
    });

    it('should render content', () => {
        const content = 'Content';
        const { notification, icon } = setup({ content });
        expect(notification).toBeInTheDocument();
        expect(notification).toHaveTextContent(content);
        expect(icon).toBeInTheDocument();
    });

    it('should render content & action', async () => {
        const onClick = vi.fn();
        const onActionClick = vi.fn();
        const content = 'Content';
        const actionLabel = 'actionLabel';
        const { notification, action, actionButton } = setup({ content, actionLabel, onClick, onActionClick });

        expect(notification).toBeInTheDocument();
        expect(notification).toHaveTextContent(content);

        expect(action).toBeInTheDocument();
        expect(actionButton).toBeInTheDocument();
        expect(actionButton).toHaveTextContent(actionLabel);

        // Click action button
        await userEvent.click(actionButton as any);
        expect(onActionClick).toHaveBeenCalledWith();
        expect(onClick).not.toHaveBeenCalled();

        // Click notification
        await userEvent.click(notification as any);
        expect(onClick).toHaveBeenCalled();
    });

    it('should render the action from actionProps', async () => {
        const onClick = vi.fn();
        const onActionClick = vi.fn();
        const { action } = setup({ onClick, actionProps: { label: 'Undo', onClick: onActionClick } });

        const actionButton = within(action as HTMLElement).getByRole('button', { name: 'Undo' });
        expect(actionButton).toHaveClass('lumx-button--emphasis-medium');

        await userEvent.click(actionButton);
        expect(onActionClick).toHaveBeenCalled();
        expect(onClick).not.toHaveBeenCalled();
    });

    it('should prefer actionProps over the deprecated action props', async () => {
        const onActionClick = vi.fn();
        const onActionPropsClick = vi.fn();
        setup({
            actionLabel: 'Old label',
            onActionClick,
            actionProps: { label: 'New label', onClick: onActionPropsClick },
        });

        expect(screen.queryByRole('button', { name: 'Old label' })).not.toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: 'New label' }));
        expect(onActionPropsClick).toHaveBeenCalled();
        expect(onActionClick).not.toHaveBeenCalled();
    });

    it('should render the action as an icon button', async () => {
        const onClick = vi.fn();
        const onClose = vi.fn();
        const { action } = setup({
            onClick,
            actionProps: { as: IconButton, icon: mdiClose, label: 'Close', emphasis: 'low', onClick: onClose },
        });

        const closeButton = within(action as HTMLElement).getByRole('button', { name: 'Close' });
        expect(closeButton).toHaveClass('lumx-button--variant-icon');
        expect(closeButton).toHaveClass('lumx-button--emphasis-low');

        await userEvent.click(closeButton);
        expect(onClose).toHaveBeenCalled();
        expect(onClick).not.toHaveBeenCalled();
    });

    it('should fall back to actionLabel when actionProps has no label', async () => {
        const onActionPropsClick = vi.fn();
        setup({ actionLabel: 'Undo', actionProps: { onClick: onActionPropsClick } });

        await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
        expect(onActionPropsClick).toHaveBeenCalled();
    });

    it('should fall back to onActionClick when actionProps has no onClick', async () => {
        const onActionClick = vi.fn();
        setup({ onActionClick, actionProps: { label: 'Undo' } });

        await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
        expect(onActionClick).toHaveBeenCalledWith();
    });

    it('should not render the action with actionLabel alone', () => {
        const { action } = setup({ actionLabel: 'Undo' });
        expect(action).not.toBeInTheDocument();
    });

    it('should not render a button action without a label', () => {
        const { action } = setup({ actionProps: { onClick: vi.fn() } });
        expect(action).not.toBeInTheDocument();
    });

    it('should render outside a portal', () => {
        const parentId = '123';
        render(
            <div data-testid={parentId}>
                <Notification isOpen type="info" usePortal={false} />
            </div>,
        );
        const parent = screen.getByTestId(parentId);
        const notification = queryByClassName(parent, CLASSNAME);
        expect(notification).toBeInTheDocument();
    });

    it('should forward styles', () => {
        const { notification } = setup({ style: { color: 'red' } });

        expect(notification).toBeInTheDocument();
        expect(notification).toHaveStyle('color: rgb(255, 0, 0)');
    });

    it('should apply zIndex', () => {
        const { notification } = setup({ zIndex: 1234 });
        expect(notification).toHaveStyle('z-index: 1234');
    });

    it.each(Object.values(Kind))('should render notification of type %s', (type) => {
        const { notification } = setup({ type });
        expect(notification).toHaveClass(
            // eslint-disable-next-line no-nested-ternary
            `${CLASSNAME}--color-${type === Kind.error ? 'red' : type === Kind.warning ? 'yellow' : type === Kind.success ? 'green' : 'blue'}`,
        );
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'notification',
        forwardAttributes: 'notification',
        forwardRef: 'notification',
    });
});
