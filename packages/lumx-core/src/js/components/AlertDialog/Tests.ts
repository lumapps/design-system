import { queryByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';
import { Kind } from '../../constants';

const CLASSNAME = 'lumx-alert-dialog';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = {
        isOpen: true,
        title: 'Alert',
        confirmProps: { onClick: () => {}, label: 'OK' },
        id: 'test-id',
        ...propsOverride,
    };
    const wrapper = render(props, options);

    const alertDialog = queryByClassName(document.body, CLASSNAME);
    return { props, alertDialog, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    const { screen } = renderOptions;

    describe('AlertDialog core tests', () => {
        describe('Accessibility', () => {
            it('has the correct role and aria attributes', () => {
                setup({ children: 'Content' }, renderOptions);
                const dialog = screen.getByRole('alertdialog');
                expect(dialog).toBeInTheDocument();
                expect(dialog.getAttribute('aria-labelledby')).toBe('test-id-title');
                expect(dialog.getAttribute('aria-describedby')).toBe('test-id-description');
                expect(document.getElementById('test-id-title')?.textContent).toBe('Alert');
                expect(document.getElementById('test-id-description')?.textContent).toBe('Content');
            });
        });

        describe('Content Rendering', () => {
            it('renders the title', () => {
                setup({ title: 'Custom Title' }, renderOptions);
                expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Custom Title');
            });

            it('renders children as a paragraph when string', () => {
                setup({ children: 'String content' }, renderOptions);
                const content = screen.getByText('String content');
                expect(content.tagName).toBe('P');
            });
        });

        describe('Buttons', () => {
            it('does not render cancel button when props not provided', () => {
                setup({ cancelProps: undefined }, renderOptions);
                expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
            });
        });

        describe('Variants', () => {
            it('applies correct color to confirm button based on kind (error)', () => {
                setup({ kind: Kind.error }, renderOptions);
                const btn = screen.getByRole('button', { name: 'OK' });
                expect(btn.className).toContain('lumx-button--color-red');
            });

            it('applies correct color to confirm button based on kind (success)', () => {
                setup({ kind: Kind.success }, renderOptions);
                const btn = screen.getByRole('button', { name: 'OK' });
                expect(btn.className).toContain('lumx-button--color-green');
            });
        });
    });
};
