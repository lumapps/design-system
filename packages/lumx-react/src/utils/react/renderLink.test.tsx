import { render, screen } from '@testing-library/react';
import { renderLink } from './renderLink';

describe('renderLink', () => {
    it('should render anchor by default', () => {
        const link = renderLink({ href: '#' } as any, 'Link');
        render(link);
        const element = screen.getByRole('link');
        expect(element.tagName).toBe('A');
        expect(element).toHaveAttribute('href', '#');
    });

    it('should render custom component', () => {
        const link = renderLink({ linkAs: 'span' }, 'Link');
        render(link);
        expect(screen.getByText('Link').tagName).toBe('SPAN');
    });
});
