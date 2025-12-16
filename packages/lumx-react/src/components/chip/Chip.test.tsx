import { Theme } from '@lumx/react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { fireEvent, render, screen } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import userEvent from '@testing-library/user-event';
import { Chip, ChipProps } from './Chip';

const CLASSNAME = Chip.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propOverrides: Partial<ChipProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props = {
        ...propOverrides,
    };

    render(<Chip {...props} />, { wrapper });
    const chip = getByClassName(document.body, CLASSNAME);
    const before = queryByClassName(chip, `${CLASSNAME}__before`);
    const after = queryByClassName(chip, `${CLASSNAME}__after`);

    return { props, chip, before, after };
};

describe('<Chip />', () => {
    describe('Props', () => {
        it('should render default', () => {
            const { chip } = setup({ children: 'Chip text' });
            expect(chip).toBeInTheDocument();
            expect(chip).toHaveTextContent('Chip text');
            expect(chip.className).toMatchInlineSnapshot(
                '"lumx-chip lumx-chip--color-dark lumx-chip--size-m lumx-chip--is-unselected"',
            );
        });

        it('should render dark theme', () => {
            const { chip } = setup({ theme: Theme.dark });
            expect(chip).toHaveClass('lumx-chip--color-light');
        });

        it('should render clickable', () => {
            const onClick = vi.fn();
            const { chip } = setup({ children: 'Chip text', onClick });
            expect(chip).toHaveAttribute('role', 'button');
            expect(chip.className).toMatchInlineSnapshot(
                '"lumx-chip lumx-chip--is-clickable lumx-chip--color-dark lumx-chip--size-m lumx-chip--is-unselected"',
            );
        });

        it('should render a link', () => {
            setup({ children: 'Chip text', href: 'https://google.com', target: '_blank' });
            const chip = screen.getByRole('link', { name: 'Chip text' });
            expect(chip).toHaveAttribute('href', 'https://google.com');
            expect(chip).toHaveAttribute('target', '_blank');
            expect(chip).toHaveAttribute('tabIndex', '0');
        });

        it('should override the role', () => {
            setup({ children: 'Chip text', role: 'radio' });
            expect(screen.getByRole('radio', { name: 'Chip text' })).toBeInTheDocument();
        });

        it('should override the tabIndex', () => {
            const { chip } = setup({ children: 'Chip text', tabIndex: -1 });
            expect(chip).toHaveAttribute('tabIndex', '-1');
        });
    });

    describe('Events', () => {
        const onClick = vi.fn();
        const onAfterClick = vi.fn();
        const onBeforeClick = vi.fn();

        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('should trigger onBeforeClick only when clicking on the "before" element', async () => {
            const { after, before, chip } = setup({
                after: 'after',
                before: 'before',
                onAfterClick,
                onBeforeClick,
                onClick,
            });

            await userEvent.click(chip);
            expect(onBeforeClick).not.toHaveBeenCalled();

            vi.clearAllMocks();

            await userEvent.click(after as any);
            expect(onBeforeClick).not.toHaveBeenCalled();

            vi.clearAllMocks();

            await userEvent.click(before as any);
            expect(onBeforeClick).toHaveBeenCalled();
        });

        it('should trigger onClick when clicking on the label area', async () => {
            const { after, before, chip } = setup({
                after: 'after',
                before: 'before',
                onAfterClick,
                onBeforeClick,
                onClick,
            });

            await userEvent.click(chip);
            expect(onClick).toHaveBeenCalled();

            vi.clearAllMocks();

            await userEvent.click(after as any);
            expect(onClick).not.toHaveBeenCalled();

            vi.clearAllMocks();

            await userEvent.click(before as any);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should trigger onAfterClick only when clicking on the "after" element', async () => {
            const { after, before, chip } = setup({
                after: 'after',
                before: 'before',
                onAfterClick,
                onBeforeClick,
                onClick,
            });

            await userEvent.click(chip);
            expect(onAfterClick).not.toHaveBeenCalled();

            vi.clearAllMocks();

            await userEvent.click(after as any);
            expect(onAfterClick).toHaveBeenCalled();

            vi.clearAllMocks();

            await userEvent.click(before as any);
            expect(onAfterClick).not.toHaveBeenCalled();
        });

        it('should not stop propagation when clicking on a "before" or "after" element without an event handler', async () => {
            const { after, before } = setup({
                after: 'after',
                before: 'before',
                onClick,
            });

            await userEvent.click(before as any);
            expect(onClick).toHaveBeenCalled();

            onClick.mockClear();

            await userEvent.click(after as any);
            expect(onClick).toHaveBeenCalled();
        });

        it('should forward key down event', async () => {
            const onKeyDown = vi.fn();
            const { chip } = setup({ onClick, onKeyDown });

            fireEvent.keyDown(chip, { key: 'A', code: 'KeyA' });
            expect(onKeyDown).toHaveBeenCalled();
        });

        it('should forward key down event and trigger `onClick` when pressing Enter', async () => {
            const user = userEvent.setup();
            const onKeyDown = vi.fn();
            const { chip } = setup({ onClick, onKeyDown });

            await user.tab();
            expect(chip).toHaveFocus();

            await userEvent.keyboard('{Enter}');

            expect(onKeyDown).toHaveBeenCalled();
            expect(onClick).toHaveBeenCalled();
            onClick.mockClear();
        });
    });

    describe('Disabled state', () => {
        it('should render disabled chip button', async () => {
            const onClick = vi.fn();
            const { chip } = setup({ children: 'Label', isDisabled: true, onClick });
            expect(chip).toHaveAttribute('aria-disabled', 'true');
            await userEvent.click(chip);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should render disabled chip link', async () => {
            const onClick = vi.fn();
            const { chip } = setup({ children: 'Label', isDisabled: true, href: 'https://example.com', onClick });
            // Disabled link should not have an href.
            expect(chip).not.toHaveAttribute('href');
            expect(chip).toHaveAttribute('aria-disabled', 'true');
            await userEvent.click(chip);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should render aria-disabled chip button', async () => {
            const onClick = vi.fn();
            const { chip } = setup({ children: 'Label', 'aria-disabled': true, onClick });
            expect(chip).toHaveAttribute('aria-disabled', 'true');
            await userEvent.click(chip);
            // userEvent doesn't dispatch click on aria-disabled elements, but we check just in case.
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should render aria-disabled chip link', async () => {
            const onClick = vi.fn();
            const { chip } = setup({
                children: 'Label',
                'aria-disabled': true,
                href: 'https://example.com',
                onClick,
            });
            expect(chip).toHaveAttribute('href', 'https://example.com');
            expect(chip).toHaveAttribute('aria-disabled', 'true');
            await userEvent.click(chip);
            // userEvent doesn't dispatch click on aria-disabled elements, but we check just in case.
            expect(onClick).not.toHaveBeenCalled();
        });
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'chip',
        forwardAttributes: 'chip',
        applyTheme: {
            affects: [{ element: 'chip', classModifier: 'color', inverted: true }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
