/**
 * Browser-only test stories for Combobox.
 *
 * These tests require a real browser environment (Playwright via Vitest browser mode)
 * because they rely on hover events, click-away detection, or secondary popover positioning
 * that does not work reliably in jsdom.
 *
 * The majority of combobox tests have been migrated to jsdom in Tests.tsx.
 */
import { expect, screen, userEvent, within, waitFor } from 'storybook/test';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { queryAllByClassName } from '../../../testing/queries';
import { CLASSNAME as COMBOBOX_OPTION_MORE_INFO_CLASSNAME } from './ComboboxOptionMoreInfo';
import { createTemplates, getActiveOption, type ComboboxNamespace } from './Tests';

// ─── Fixtures ────────────────────────────────────────────────────

const MORE_INFO_FRUITS = ['Apple', 'Banana', 'Cherry'];

// ─── Helpers ─────────────────────────────────────────────────────

/** Helper: get a visible (open) OptionMoreInfo popover element. */
function getVisibleMoreInfoPopover(): HTMLElement | null {
    const popovers = queryAllByClassName(document.body, 'lumx-combobox-option-more-info__popover');
    return popovers.find((p) => !p.classList.contains('lumx-popover--is-hidden')) ?? null;
}

// ═══════════════════════════════════════════════════════════════════
// Setup
// ═══════════════════════════════════════════════════════════════════

export function setup({
    components: { Combobox, IconButton, Button },
    decorators: { withValueOnChange },
}: SetupStoriesOptions<{
    components: {
        Combobox: ComboboxNamespace;
        IconButton: any;
        Button: any;
    };
    decorators: 'withValueOnChange';
}>) {
    // Reuse templates from Tests.tsx for the input and button templates
    const { inputTemplate, buttonTemplate } = createTemplates(Combobox, IconButton);

    // ─── Browser-only templates ──────────────────────────────────

    /** Combobox with OptionMoreInfo in the `after` slot of each option. */
    const renderComboboxWithOptionMoreInfo = ({
        value,
        onChange,
        onToggle,
    }: {
        value: string;
        onChange: (v: string) => void;
        onToggle?: (isOpen: boolean) => void;
    }) => (
        <Combobox.Provider>
            <Combobox.Input
                value={value}
                onChange={onChange}
                placeholder="Pick a fruit…"
                toggleButtonProps={{ label: 'Fruits' }}
            />
            <Combobox.Popover>
                <Combobox.List aria-label="Fruits">
                    {MORE_INFO_FRUITS.map((fruit) => (
                        <Combobox.Option
                            key={fruit}
                            value={fruit}
                            after={
                                <Combobox.OptionMoreInfo onToggle={onToggle}>
                                    <p data-testid={`more-info-${fruit.toLowerCase()}`}>Details about {fruit}</p>
                                </Combobox.OptionMoreInfo>
                            }
                        >
                            {fruit}
                        </Combobox.Option>
                    ))}
                </Combobox.List>
            </Combobox.Popover>
        </Combobox.Provider>
    );

    // ─── Base story configs ──────────────────────────────────────

    const comboboxInputStory = {
        args: { value: '' },
        decorators: [withValueOnChange()],
        render: inputTemplate,
    };

    const comboboxButtonStory = {
        args: { value: '' },
        decorators: [withValueOnChange({ onChangeProp: 'onSelect', valueExtract: (v: any) => v?.value })],
        render: buttonTemplate,
    };

    const optionMoreInfoStory = {
        args: { value: '' },
        argTypes: { onToggle: { action: 'toggle' } },
        decorators: [withValueOnChange()],
        render: renderComboboxWithOptionMoreInfo,
    };

    const meta = {
        component: Combobox.Provider,
        tags: ['!snapshot'],
        parameters: { chromatic: { disable: true } },
    };

    // ═══════════════════════════════════════════════════════════════
    // Browser-only tests
    // ═══════════════════════════════════════════════════════════════

    const MouseHoverDoesNotActivateOption = {
        ...comboboxInputStory,
        play: async ({ canvasElement }: any) => {
            const input = within(canvasElement).getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const options = screen.queryAllByRole('option');
            const bananaOption = options.find((o) => o.textContent === 'Banana')!;
            await userEvent.hover(bananaOption);

            await expect(bananaOption).not.toHaveAttribute('data-focus-visible-added');
            await expect(input).toHaveAttribute('aria-activedescendant', '');
            await expect(getActiveOption()).toBeNull();
        },
    };

    const ClickAwayClosesPopup = {
        ...comboboxInputStory,
        render: (args: any) => (
            <div>
                {inputTemplate(args)}
                <Button type="button" data-testid="outside">
                    Outside
                </Button>
            </div>
        ),
        play: async ({ canvasElement }: any) => {
            const input = within(canvasElement).getByRole<HTMLInputElement>('combobox');

            await userEvent.click(input);
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const outsideButton = within(canvasElement).getByTestId('outside');
            await userEvent.click(outsideButton);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'false');
            });
        },
    };

    const MouseHoverThenKeyboardNav = {
        ...comboboxInputStory,
        play: async ({ canvasElement }: any) => {
            const input = within(canvasElement).getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const options = screen.queryAllByRole('option');
            const cherryOption = options.find((o) => o.textContent === 'Cherry')!;
            await userEvent.hover(cherryOption);
            await expect(getActiveOption()).toBeNull();

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                const active = getActiveOption();
                expect(active).not.toBeNull();
                expect(active!.textContent).toBe('Apple');
                expect(input).toHaveAttribute('aria-activedescendant', active!.id);
            });
        },
    };

    // ─── OptionMoreInfo tests ────────────────────────────────────

    const OptionMoreInfoKeyboardHighlight = {
        ...optionMoreInfoStory,
        play: async ({ canvasElement }: any) => {
            const input = within(canvasElement).getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await expect(getVisibleMoreInfoPopover()).toBeNull();

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                const activeOption = getActiveOption();
                expect(activeOption).not.toBeNull();
                expect(activeOption!.textContent).toBe('Apple');
            });

            await waitFor(() => {
                const popover = getVisibleMoreInfoPopover();
                expect(popover).not.toBeNull();
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                const activeOption = getActiveOption();
                expect(activeOption).not.toBeNull();
                expect(activeOption!.textContent).toBe('Banana');
            });

            await waitFor(() => {
                const popover = getVisibleMoreInfoPopover();
                expect(popover).not.toBeNull();
            });
        },
    };

    const OptionMoreInfoMouseHover = {
        ...optionMoreInfoStory,
        play: async ({ canvasElement }: any) => {
            const input = within(canvasElement).getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await expect(getVisibleMoreInfoPopover()).toBeNull();

            const infoButtons = queryAllByClassName(document.body, COMBOBOX_OPTION_MORE_INFO_CLASSNAME);
            await expect(infoButtons.length).toBeGreaterThan(0);
            await userEvent.hover(infoButtons[0]);

            await waitFor(() => {
                const popover = getVisibleMoreInfoPopover();
                expect(popover).not.toBeNull();

                // Verify popover is positioned near the anchor (info icon button),
                // not at (0,0) or far away from the button.
                const anchorRect = infoButtons[0].getBoundingClientRect();
                const popoverRect = popover!.getBoundingClientRect();

                // Anchor must have real dimensions (not display:contents or hidden)
                expect(anchorRect.width).toBeGreaterThan(0);
                expect(anchorRect.height).toBeGreaterThan(0);

                // Popover should be vertically near the anchor (placement="bottom-start")
                // i.e., the popover's top should be close to the anchor's bottom
                expect(popoverRect.top).toBeGreaterThanOrEqual(anchorRect.bottom - 5);
                expect(popoverRect.top).toBeLessThan(anchorRect.bottom + 30);
            });

            await userEvent.unhover(infoButtons[0]);

            await waitFor(() => {
                const popover = getVisibleMoreInfoPopover();
                expect(popover).toBeNull();
            });
        },
    };

    const OptionMoreInfoAriaDescribedBy = {
        ...optionMoreInfoStory,
        play: async ({ canvasElement }: any) => {
            const input = within(canvasElement).getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{ArrowDown}');
            const activeOption = await waitFor(() => {
                const option = getActiveOption();
                expect(option).not.toBeNull();
                return option!;
            });

            const describedBy = activeOption.getAttribute('aria-describedby');
            expect(describedBy).toBeTruthy();
            const moreInfoId = describedBy!.split(' ').find((id) => id.endsWith('-more-info'));
            expect(moreInfoId).toBeTruthy();

            const moreInfoEl = document.getElementById(moreInfoId!);
            expect(moreInfoEl).not.toBeNull();
            expect(moreInfoEl!.textContent).toContain('Details about Apple');
        },
    };

    const ButtonTypeaheadFromClosed = {
        ...comboboxButtonStory,
        play: async ({ canvasElement }: any) => {
            const button = within(canvasElement).getByTestId('combobox-button');
            button.focus();
            await expect(button).toHaveAttribute('aria-expanded', 'false');

            // Single printable char from closed: opens and lands on the first match.
            await userEvent.keyboard('b');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                const banana = screen.queryAllByRole('option').find((o) => o.textContent === 'Banana');
                expect(banana).toBeTruthy();
                expect(button).toHaveAttribute('aria-activedescendant', banana!.id);
            });
        },
    };

    const ButtonTypeaheadWhileOpen = {
        ...comboboxButtonStory,
        play: async ({ canvasElement }: any) => {
            const button = within(canvasElement).getByTestId('combobox-button');
            button.focus();

            // Open first (no active option).
            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(screen.queryAllByRole('option').length).toBeGreaterThan(0);
            });
            await expect(button).toHaveAttribute('aria-activedescendant', '');

            // Typeahead while open lands on the match synchronously.
            await userEvent.keyboard('o');
            await waitFor(() => {
                const orange = screen.queryAllByRole('option').find((o) => o.textContent === 'Orange');
                expect(orange).toBeTruthy();
                expect(button).toHaveAttribute('aria-activedescendant', orange!.id);
            });
        },
    };

    const ButtonEndFromClosed = {
        ...comboboxButtonStory,
        play: async ({ canvasElement }: any) => {
            const button = within(canvasElement).getByTestId('combobox-button');
            button.focus();
            await expect(button).toHaveAttribute('aria-expanded', 'false');

            await userEvent.keyboard('{End}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                const options = screen.queryAllByRole('option');
                const last = options[options.length - 1];
                expect(last).toBeTruthy();
                expect(button).toHaveAttribute('aria-activedescendant', last.id);
            });
        },
    };

    const ButtonHomeFromClosed = {
        ...comboboxButtonStory,
        play: async ({ canvasElement }: any) => {
            const button = within(canvasElement).getByTestId('combobox-button');
            button.focus();
            await expect(button).toHaveAttribute('aria-expanded', 'false');

            await userEvent.keyboard('{Home}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                const first = screen.queryAllByRole('option')[0];
                expect(first).toBeTruthy();
                expect(button).toHaveAttribute('aria-activedescendant', first.id);
            });
        },
    };

    const ButtonArrowDownFromClosed = {
        ...comboboxButtonStory,
        play: async ({ canvasElement }: any) => {
            const button = within(canvasElement).getByTestId('combobox-button');
            button.focus();
            await expect(button).toHaveAttribute('aria-expanded', 'false');

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                const first = screen.queryAllByRole('option')[0];
                expect(first).toBeTruthy();
                expect(button).toHaveAttribute('aria-activedescendant', first.id);
            });
        },
    };

    return {
        meta,
        MouseHoverDoesNotActivateOption,
        ClickAwayClosesPopup,
        MouseHoverThenKeyboardNav,
        OptionMoreInfoKeyboardHighlight,
        OptionMoreInfoMouseHover,
        OptionMoreInfoAriaDescribedBy,
        ButtonTypeaheadFromClosed,
        ButtonTypeaheadWhileOpen,
        ButtonEndFromClosed,
        ButtonHomeFromClosed,
        ButtonArrowDownFromClosed,
    };
}
