import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useImageLightbox } from './useImageLightbox';

const TestComponent = () => {
    const { getTriggerProps, imageLightboxProps } = useImageLightbox({
        images: [{ image: 'https://example.com/image.png', alt: 'Image 1' }],
    });
    return (
        <>
            <button type="button" {...(getTriggerProps() as any)}>
                Open
            </button>
            <div data-testid="is-open">{String(imageLightboxProps.isOpen)}</div>
        </>
    );
};

describe('useImageLightbox', () => {
    it('should set aria-haspopup="dialog" on trigger props', () => {
        render(<TestComponent />);
        expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('aria-haspopup', 'dialog');
    });

    it('should open the lightbox on trigger click', async () => {
        render(<TestComponent />);
        expect(screen.getByTestId('is-open')).toHaveTextContent('false');

        await userEvent.click(screen.getByRole('button', { name: 'Open' }));

        expect(screen.getByTestId('is-open')).toHaveTextContent('true');
    });
});
