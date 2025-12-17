import { Kind } from '@lumx/react';
import { render, within, screen } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import userEvent from '@testing-library/user-event';

import { Notification, NotificationProps } from './Notification';

const CLASSNAME = Notification.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<NotificationProps> = {}) => {
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
        expect(onActionClick).toHaveBeenCalled();
        expect(onClick).not.toHaveBeenCalled();

        // Click notification
        await userEvent.click(notification as any);
        expect(onClick).toHaveBeenCalled();
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

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'notification',
        forwardAttributes: 'notification',
        forwardRef: 'notification',
    });
});
