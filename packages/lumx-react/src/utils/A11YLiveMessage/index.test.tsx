import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { A11YLiveMessage, A11YLiveMessageProps } from './index';

type SetupProps = Partial<A11YLiveMessageProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}) => {
    const props: A11YLiveMessageProps = { ...propsOverride };
    const { container } = render(<A11YLiveMessage {...props} />);

    // Query for the live region by aria-live attribute since it may not have a role
    const liveRegion = container.querySelector('[aria-live]') as HTMLElement;

    return { props, liveRegion, container };
};

describe('A11YLiveMessage', () => {
    describe('Default behavior', () => {
        it('should render with default polite aria-live', () => {
            const { liveRegion } = setup();

            expect(liveRegion).toBeInTheDocument();
            expect(liveRegion).toHaveAttribute('aria-live', 'polite');
            expect(liveRegion).not.toHaveAttribute('aria-relevant');
            expect(liveRegion).not.toHaveAttribute('aria-atomic');
            expect(liveRegion).not.toHaveAttribute('role');
        });

        it('should not be visually hidden by default', () => {
            const { liveRegion } = setup();

            expect(liveRegion).not.toHaveClass('visually-hidden');
        });

        it('should render empty content by default', () => {
            const { liveRegion } = setup();

            expect(liveRegion).toHaveTextContent('');
        });

        it('should render with text content', () => {
            const message = 'Test message for screen readers';
            const { liveRegion } = setup({ children: message });

            expect(liveRegion).toHaveTextContent(message);
        });
    });

    describe('Type prop', () => {
        it('should render with polite type', () => {
            const { liveRegion } = setup({ type: 'polite' });

            expect(liveRegion).toHaveAttribute('aria-live', 'polite');
        });

        it('should render with assertive type', () => {
            const { liveRegion } = setup({ type: 'assertive' });

            expect(liveRegion).toHaveAttribute('aria-live', 'assertive');
        });
    });

    describe('Atomic and relevant props', () => {
        it('should render with atomic and relevant attributes', () => {
            const { liveRegion } = setup({
                atomic: true,
                relevant: 'additions',
            });

            expect(liveRegion).toHaveAttribute('aria-live', 'polite');
            expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
            expect(liveRegion).toHaveAttribute('aria-relevant', 'additions');
        });

        it('should render with atomic false', () => {
            const { liveRegion } = setup({
                atomic: false,
            });

            expect(liveRegion).toHaveAttribute('aria-atomic', 'false');
        });
    });

    describe('Hidden prop', () => {
        it('should be visually hidden when hidden prop is true', () => {
            const { liveRegion } = setup({ hidden: true });

            expect(liveRegion).toHaveClass('visually-hidden');
        });

        it('should not be visually hidden when hidden prop is false', () => {
            const { liveRegion } = setup({ hidden: false });

            expect(liveRegion).not.toHaveClass('visually-hidden');
        });
    });

    describe('Role prop', () => {
        it('should render with status role', () => {
            const { liveRegion } = setup({ role: 'status' });

            expect(liveRegion).toHaveAttribute('role', 'status');
        });

        it('should render with alert role', () => {
            const { liveRegion } = setup({ role: 'alert' });

            expect(liveRegion).toHaveAttribute('role', 'alert');
        });
    });

    describe('Dynamic content updates', () => {
        it('should update content when children change', () => {
            const initialMessage = 'Initial message';
            const updatedMessage = 'Updated message';

            const { liveRegion, container } = setup({ children: initialMessage });
            expect(liveRegion).toHaveTextContent(initialMessage);

            // Re-render with new content
            const { container: newContainer } = render(<A11YLiveMessage>{updatedMessage}</A11YLiveMessage>, {
                container,
            });

            const updatedLiveRegion = newContainer.querySelector('[aria-live]') as HTMLElement;
            expect(updatedLiveRegion).toHaveTextContent(updatedMessage);
        });
    });

    describe('ClassName prop', () => {
        it('should apply custom className', () => {
            const customClass = 'custom-live-region';
            const { liveRegion } = setup({ className: customClass });

            expect(liveRegion).toHaveClass(customClass);
        });

        it('should combine custom className with visually-hidden', () => {
            const customClass = 'custom-live-region';
            const { liveRegion } = setup({
                className: customClass,
                hidden: true,
            });

            expect(liveRegion).toHaveClass(customClass);
            expect(liveRegion).toHaveClass('visually-hidden');
        });
    });

    describe('Integration with form submission', () => {
        it('should update message on form submit', async () => {
            const user = userEvent.setup();
            const testMessage = 'Form submitted successfully';

            const TestComponent = () => {
                const [message, setMessage] = React.useState('');

                const handleSubmit = (e: React.FormEvent) => {
                    e.preventDefault();
                    setMessage(testMessage);
                };

                return (
                    <>
                        <A11YLiveMessage>{message}</A11YLiveMessage>
                        <form onSubmit={handleSubmit}>
                            <button type="submit">Submit</button>
                        </form>
                    </>
                );
            };

            const { container } = render(<TestComponent />);
            const liveRegion = container.querySelector('[aria-live]') as HTMLElement;
            const button = screen.getByRole('button', { name: 'Submit' });

            expect(liveRegion).toHaveTextContent('');

            await user.click(button);

            expect(liveRegion).toHaveTextContent(testMessage);
        });
    });
});
