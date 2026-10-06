import userEvent from '@testing-library/user-event';
import { screen, within } from '@testing-library/dom';
import { mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiCheckCircle, mdiPencil, mdiRadioboxBlank } from '@lumx/icons';

// ─── Fixtures ────────────────────────────────────────────────────

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Kiwi'];

// ─── Types ───────────────────────────────────────────────────────

/** Internal listbox components namespace type. */
export interface ListboxNamespace {
    /** Standalone listbox provider (creates the listbox handle). */
    Provider: any;
    /** List (listbox pattern by default, grid pattern with `type="grid"`). */
    List: any;
    Option: any;
    OptionAction: any;
    Section: any;
    SelectionIcon: any;
}

type RenderResult = { unmount: () => void; container: HTMLElement };

/**
 * Options to set up the listbox test suite.
 * Injected by the framework-specific test file (React or Vue).
 */
export interface ListboxTestSetup {
    components: {
        Listbox: ListboxNamespace;
        IconButton: any;
    };
    /**
     * Render a template with controlled state management.
     * Mirrors the withValueOnChange Storybook decorator.
     */
    renderWithState: (
        template: (props: any) => any,
        initialArgs?: Record<string, any>,
        options?: { onChangeProp?: string; valueExtract?: (v: any) => any },
    ) => RenderResult;
}

// ─── DOM Helpers ─────────────────────────────────────────────────

/** Label of the option referenced by the listbox `aria-activedescendant`. */
function getActiveOptionLabel(listbox: HTMLElement): string | null {
    const id = listbox.getAttribute('aria-activedescendant');
    return id ? document.getElementById(id)?.textContent?.trim() ?? null : null;
}

const WITH_SELECT_STATE = { onChangeProp: 'onSelect', valueExtract: (option: { value: string }) => option.value };

// ─── Test suite ──────────────────────────────────────────────────

export default function listboxTests({ components: { Listbox, IconButton }, renderWithState }: ListboxTestSetup) {
    /** Render a single-select standalone listbox between two buttons. */
    const setupSingle = (initialArgs: Record<string, any> = {}) => {
        const onSelect = vi.fn();
        renderWithState(
            ({ value, onSelect: handleSelect }) => (
                <>
                    <button type="button">Before</button>
                    <Listbox.Provider onSelect={handleSelect}>
                        <Listbox.List aria-label="Fruits">
                            {FRUITS.map((fruit) => (
                                <Listbox.Option
                                    key={fruit}
                                    value={fruit}
                                    isSelected={fruit === value}
                                    isDisabled={fruit === 'Kiwi'}
                                >
                                    {fruit}
                                </Listbox.Option>
                            ))}
                        </Listbox.List>
                    </Listbox.Provider>
                    <button type="button">After</button>
                </>
            ),
            { value: '', ...initialArgs, onSelect },
            WITH_SELECT_STATE,
        );
        return { onSelect, listbox: screen.getByRole('listbox', { name: 'Fruits' }) };
    };

    describe('Standalone listbox', () => {
        describe('Rendering', () => {
            it('should render a focusable listbox with non-focusable options', () => {
                const { listbox } = setupSingle();
                expect(listbox).toHaveAttribute('tabindex', '0');
                expect(listbox).not.toHaveAttribute('aria-expanded');
                const options = within(listbox).getAllByRole('option');
                expect(options).toHaveLength(FRUITS.length);
                for (const option of options) expect(option).toHaveAttribute('tabindex', '-1');
            });
        });

        describe('Focus', () => {
            it('should be a single tab stop', async () => {
                const { listbox } = setupSingle();
                await userEvent.tab();
                await userEvent.tab();
                expect(listbox).toHaveFocus();
                await userEvent.tab();
                expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
            });

            it('should activate the first option on focus when nothing is selected', async () => {
                const { listbox } = setupSingle();
                await userEvent.click(screen.getByRole('button', { name: 'Before' }));
                await userEvent.tab();
                expect(getActiveOptionLabel(listbox)).toBe('Apple');
            });

            it('should activate the selected option on focus', async () => {
                const { listbox } = setupSingle({ value: 'Cherry' });
                await userEvent.click(screen.getByRole('button', { name: 'Before' }));
                await userEvent.tab();
                expect(getActiveOptionLabel(listbox)).toBe('Cherry');
            });

            it('should show the focus ring on keyboard focus only', async () => {
                const { listbox } = setupSingle();
                const getRingOption = () => listbox.querySelector('[data-focus-visible-added]');

                // Click: the clicked option is active, without focus ring.
                await userEvent.click(within(listbox).getByRole('option', { name: 'Cherry' }));
                expect(getActiveOptionLabel(listbox)).toBe('Cherry');
                expect(getRingOption()).toBeNull();

                // Next key press: the focus ring shows on the new active option.
                await userEvent.keyboard('{ArrowDown}');
                expect(getActiveOptionLabel(listbox)).toBe('Kiwi');
                expect(getRingOption()).toHaveTextContent('Kiwi');

                // Tab out and back in (keyboard focus): the focus ring shows.
                await userEvent.tab();
                await userEvent.tab({ shift: true });
                expect(listbox).toHaveFocus();
                expect(getRingOption()).not.toBeNull();
            });

            it('should clear the active option on blur', async () => {
                const { listbox } = setupSingle();
                await userEvent.click(screen.getByRole('button', { name: 'Before' }));
                await userEvent.tab();
                expect(getActiveOptionLabel(listbox)).toBe('Apple');
                await userEvent.tab();
                expect(getActiveOptionLabel(listbox)).toBeNull();
            });
        });

        describe('Keyboard navigation', () => {
            it('should move the active option with ArrowDown/ArrowUp/Home/End', async () => {
                const { listbox } = setupSingle();
                await userEvent.click(screen.getByRole('button', { name: 'Before' }));
                await userEvent.tab();
                await userEvent.keyboard('{ArrowDown}');
                expect(getActiveOptionLabel(listbox)).toBe('Banana');
                await userEvent.keyboard('{ArrowUp}');
                expect(getActiveOptionLabel(listbox)).toBe('Apple');
                await userEvent.keyboard('{End}');
                expect(getActiveOptionLabel(listbox)).toBe('Kiwi');
                await userEvent.keyboard('{Home}');
                expect(getActiveOptionLabel(listbox)).toBe('Apple');
            });

            it('should move the active option with typeahead', async () => {
                const { listbox } = setupSingle();
                await userEvent.click(screen.getByRole('button', { name: 'Before' }));
                await userEvent.tab();
                await userEvent.keyboard('c');
                expect(getActiveOptionLabel(listbox)).toBe('Cherry');
            });
        });

        describe('Selection', () => {
            it('should select the active option on Enter and keep the listbox', async () => {
                const { listbox, onSelect } = setupSingle();
                await userEvent.click(screen.getByRole('button', { name: 'Before' }));
                await userEvent.tab();
                await userEvent.keyboard('{ArrowDown}{Enter}');
                expect(onSelect).toHaveBeenLastCalledWith({ value: 'Banana' });
                expect(within(listbox).getByRole('option', { name: 'Banana' })).toHaveAttribute(
                    'aria-selected',
                    'true',
                );
                expect(listbox).toHaveFocus();
                expect(getActiveOptionLabel(listbox)).toBe('Banana');
            });

            it('should select the active option on Space', async () => {
                const { onSelect } = setupSingle();
                await userEvent.click(screen.getByRole('button', { name: 'Before' }));
                await userEvent.tab();
                await userEvent.keyboard(' ');
                expect(onSelect).toHaveBeenLastCalledWith({ value: 'Apple' });
            });

            it('should select on click, focus the listbox and activate the clicked option', async () => {
                const { listbox, onSelect } = setupSingle();
                await userEvent.click(within(listbox).getByRole('option', { name: 'Cherry' }));
                expect(onSelect).toHaveBeenLastCalledWith({ value: 'Cherry' });
                expect(listbox).toHaveFocus();
                expect(getActiveOptionLabel(listbox)).toBe('Cherry');
            });

            it('should not select a disabled option', async () => {
                const { listbox, onSelect } = setupSingle();
                await userEvent.click(screen.getByRole('button', { name: 'Before' }));
                await userEvent.tab();
                await userEvent.keyboard('{End}');
                expect(getActiveOptionLabel(listbox)).toBe('Kiwi');
                await userEvent.keyboard('{Enter}');
                await userEvent.click(within(listbox).getByRole('option', { name: 'Kiwi' }));
                expect(onSelect).not.toHaveBeenCalled();
            });

            it('should not clear the selection on Escape', async () => {
                const { onSelect } = setupSingle({ value: 'Banana' });
                await userEvent.click(screen.getByRole('button', { name: 'Before' }));
                await userEvent.tab();
                await userEvent.keyboard('{Escape}');
                expect(onSelect).not.toHaveBeenCalled();
            });

            it('should toggle options in multiple selection', async () => {
                const onSelect = vi.fn();
                renderWithState(
                    ({ onSelect: handleSelect }) => (
                        <Listbox.Provider onSelect={handleSelect}>
                            <Listbox.List aria-label="Fruits" aria-multiselectable>
                                {FRUITS.map((fruit) => (
                                    <Listbox.Option key={fruit} value={fruit}>
                                        {fruit}
                                    </Listbox.Option>
                                ))}
                            </Listbox.List>
                        </Listbox.Provider>
                    ),
                    { onSelect },
                    WITH_SELECT_STATE,
                );
                const listbox = screen.getByRole('listbox', { name: 'Fruits' });
                expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
                await userEvent.tab();
                await userEvent.keyboard(' {ArrowDown} ');
                expect(onSelect).toHaveBeenNthCalledWith(1, { value: 'Apple' });
                expect(onSelect).toHaveBeenNthCalledWith(2, { value: 'Banana' });
                expect(getActiveOptionLabel(listbox)).toBe('Banana');
            });
        });

        describe('SelectionIcon', () => {
            const getIconPaths = (listbox: HTMLElement) =>
                Array.from(listbox.querySelectorAll('.lumx-listbox-option__selection-icon path')).map((path) =>
                    path.getAttribute('d'),
                );

            it('should render radio icons in a single selection list', () => {
                renderWithState(
                    () => (
                        <Listbox.Provider>
                            <Listbox.List aria-label="Fruits">
                                <Listbox.Option value="Apple" isSelected after={<Listbox.SelectionIcon />}>
                                    Apple
                                </Listbox.Option>
                                <Listbox.Option value="Banana" after={<Listbox.SelectionIcon />}>
                                    Banana
                                </Listbox.Option>
                            </Listbox.List>
                        </Listbox.Provider>
                    ),
                    {},
                    WITH_SELECT_STATE,
                );
                expect(getIconPaths(screen.getByRole('listbox', { name: 'Fruits' }))).toEqual([
                    mdiCheckCircle,
                    mdiRadioboxBlank,
                ]);
            });

            it('should render checkbox icons in a multiple selection list', () => {
                renderWithState(
                    () => (
                        <Listbox.Provider>
                            <Listbox.List aria-label="Fruits" aria-multiselectable>
                                <Listbox.Option value="Apple" isSelected after={<Listbox.SelectionIcon />}>
                                    Apple
                                </Listbox.Option>
                                <Listbox.Option value="Banana" after={<Listbox.SelectionIcon />}>
                                    Banana
                                </Listbox.Option>
                            </Listbox.List>
                        </Listbox.Provider>
                    ),
                    {},
                    WITH_SELECT_STATE,
                );
                expect(getIconPaths(screen.getByRole('listbox', { name: 'Fruits' }))).toEqual([
                    mdiCheckboxMarked,
                    mdiCheckboxBlankOutline,
                ]);
            });
        });

        describe('Sections', () => {
            it('should navigate across sections', async () => {
                renderWithState(
                    ({ onSelect }) => (
                        <Listbox.Provider onSelect={onSelect}>
                            <Listbox.List aria-label="Fruits">
                                <Listbox.Section label="First">
                                    <Listbox.Option value="Apple">Apple</Listbox.Option>
                                </Listbox.Section>
                                <Listbox.Section label="Second">
                                    <Listbox.Option value="Banana">Banana</Listbox.Option>
                                </Listbox.Section>
                            </Listbox.List>
                        </Listbox.Provider>
                    ),
                    {},
                    WITH_SELECT_STATE,
                );
                const listbox = screen.getByRole('listbox', { name: 'Fruits' });
                expect(within(listbox).getAllByRole('group')).toHaveLength(2);
                await userEvent.tab();
                expect(getActiveOptionLabel(listbox)).toBe('Apple');
                await userEvent.keyboard('{ArrowDown}');
                expect(getActiveOptionLabel(listbox)).toBe('Banana');
            });
        });

        describe('Grid mode', () => {
            it('should not render the option actions outside grid mode', () => {
                const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
                renderWithState(
                    ({ onSelect: handleSelect }) => (
                        <Listbox.Provider onSelect={handleSelect}>
                            <Listbox.List aria-label="Fruits">
                                <Listbox.Option
                                    value="Apple"
                                    after={
                                        <Listbox.OptionAction
                                            as={IconButton}
                                            icon={mdiPencil}
                                            label="Edit"
                                            hideTooltip
                                        />
                                    }
                                >
                                    Apple
                                </Listbox.Option>
                            </Listbox.List>
                        </Listbox.Provider>
                    ),
                    {},
                    WITH_SELECT_STATE,
                );
                expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
                expect(screen.queryByRole('gridcell')).not.toBeInTheDocument();
                expect(screen.queryByRole('button', { hidden: true })).not.toBeInTheDocument();
                expect(warn).toHaveBeenCalledTimes(1);
                warn.mockRestore();
            });

            it('should move to the option actions with ArrowRight and not select on action click', async () => {
                const onSelect = vi.fn();
                const onEdit = vi.fn();
                renderWithState(
                    ({ onSelect: handleSelect }) => (
                        <Listbox.Provider onSelect={handleSelect}>
                            <Listbox.List type="grid" aria-label="Fruits">
                                {FRUITS.slice(0, 2).map((fruit) => (
                                    <Listbox.Option
                                        key={fruit}
                                        value={fruit}
                                        after={
                                            <Listbox.OptionAction
                                                as={IconButton}
                                                icon={mdiPencil}
                                                label={`Edit ${fruit}`}
                                                hideTooltip
                                                onClick={onEdit}
                                            />
                                        }
                                    >
                                        {fruit}
                                    </Listbox.Option>
                                ))}
                            </Listbox.List>
                        </Listbox.Provider>
                    ),
                    { onSelect },
                    WITH_SELECT_STATE,
                );
                const grid = screen.getByRole('grid', { name: 'Fruits' });
                expect(grid).toHaveAttribute('tabindex', '0');
                await userEvent.tab();
                await userEvent.keyboard('{ArrowRight}');
                const activeId = grid.getAttribute('aria-activedescendant') as string;
                expect(document.getElementById(activeId)).toHaveAccessibleName('Edit Apple');
                await userEvent.keyboard('{Enter}');
                expect(onEdit).toHaveBeenCalledTimes(1);
                expect(onSelect).not.toHaveBeenCalled();
            });
        });

        describe('Tooltip on active option', () => {
            it('should show the tooltip of the active option', async () => {
                renderWithState(
                    ({ onSelect }) => (
                        <Listbox.Provider onSelect={onSelect}>
                            <Listbox.List aria-label="Fruits">
                                {['Apple', 'Banana'].map((fruit) => (
                                    <Listbox.Option key={fruit} value={fruit} tooltipProps={{ label: `${fruit} info` }}>
                                        {fruit}
                                    </Listbox.Option>
                                ))}
                            </Listbox.List>
                        </Listbox.Provider>
                    ),
                    {},
                    WITH_SELECT_STATE,
                );
                await userEvent.tab();
                expect(await screen.findByRole('tooltip', { name: 'Apple info' })).toBeInTheDocument();
            });
        });
    });
}
