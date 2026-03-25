/**
 * Browser-only test stories for Combobox.
 *
 * These tests require a real browser environment (Playwright via Vitest browser mode)
 * because they rely on hover events, click-away detection, or secondary popover positioning
 * that does not work reliably in jsdom.
 *
 * The majority of combobox tests have been migrated to jsdom in Tests.tsx.
 */
import { expect, userEvent, within, waitFor } from 'storybook/test';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { createTemplates, type ComboboxNamespace } from './Tests';

// ─── Fixtures ────────────────────────────────────────────────────

const MORE_INFO_FRUITS = ['Apple', 'Banana', 'Cherry'];

// ─── Helpers ─────────────────────────────────────────────────────

function getInput(canvasElement: HTMLElement): HTMLInputElement {
    return within(canvasElement).getByPlaceholderText('Pick a fruit…') as HTMLInputElement;
}

function getActiveOption(): HTMLElement | null {
    return document.body.querySelector('[role="option"][data-focus-visible-added="true"]');
}

function getVisibleOptions(): HTMLElement[] {
    return Array.from(document.body.querySelectorAll<HTMLElement>('[role="option"]:not([data-filtered])'));
}

/** Helper: get all OptionMoreInfo info icon buttons. */
function getMoreInfoButtons(): HTMLElement[] {
    return Array.from(document.body.querySelectorAll<HTMLElement>('.lumx-combobox-option-more-info'));
}

/** Helper: get a visible (open) OptionMoreInfo popover element. */
function getVisibleMoreInfoPopover(): HTMLElement | null {
    return document.body.querySelector('.lumx-combobox-option-more-info__popover:not(.lumx-popover--is-hidden)');
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
    // Reuse templates from Tests.tsx for the input template
    const { inputTemplate } = createTemplates(Combobox, IconButton);

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

    const AutoFilterOptions = {
        ...comboboxInputStory,
        play: async ({ canvasElement }: any) => {
            const input = getInput(canvasElement);
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            // All 10 options should be visible initially
            let visibleOptions = getVisibleOptions();
            expect(visibleOptions).toHaveLength(10);

            // Type "B" → "Banana" and "Blueberry" match (case-insensitive startsWith)
            await userEvent.type(input, 'B');

            await waitFor(() => {
                visibleOptions = getVisibleOptions();
                expect(visibleOptions).toHaveLength(2);
                expect(visibleOptions.map((o) => o.textContent)).toEqual(['Banana', 'Blueberry']);
            });

            // Continue typing "a" (input now "Ba") → only "Banana" matches
            await userEvent.type(input, 'a');

            await waitFor(() => {
                visibleOptions = getVisibleOptions();
                expect(visibleOptions).toHaveLength(1);
                expect(visibleOptions[0].textContent).toBe('Banana');
            });

            // Clear input → all options visible again
            await userEvent.clear(input);

            await waitFor(() => {
                visibleOptions = getVisibleOptions();
                expect(visibleOptions).toHaveLength(10);
            });
        },
    };

    const MouseHoverDoesNotActivateOption = {
        ...comboboxInputStory,
        play: async ({ canvasElement }: any) => {
            const input = getInput(canvasElement);
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const options = getVisibleOptions();
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
            const input = getInput(canvasElement);

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
            const input = getInput(canvasElement);
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const options = getVisibleOptions();
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
            const input = getInput(canvasElement);
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
            const input = getInput(canvasElement);
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await expect(getVisibleMoreInfoPopover()).toBeNull();

            const infoButtons = getMoreInfoButtons();
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
            const input = getInput(canvasElement);
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

    return {
        meta,
        AutoFilterOptions,
        MouseHoverDoesNotActivateOption,
        ClickAwayClosesPopup,
        MouseHoverThenKeyboardNav,
        OptionMoreInfoKeyboardHighlight,
        OptionMoreInfoMouseHover,
        OptionMoreInfoAriaDescribedBy,
    };
}
