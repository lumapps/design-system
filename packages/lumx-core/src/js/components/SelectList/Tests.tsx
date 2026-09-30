import userEvent from '@testing-library/user-event';
import { screen, within } from '@testing-library/dom';
import { mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiCheckCircle, mdiRadioboxBlank } from '@lumx/icons';
import { CLASSNAME as LIST_ITEM_CLASSNAME } from '../List/ListItem';
import { IconClassName as ICON_CLASSNAME } from '../Icon';
import { CLASSNAME as OPTION_SKELETON_CLASSNAME } from '../Listbox/ListboxOptionSkeleton';
import { CLASSNAME as STATE_CLASSNAME } from '../Listbox/ListboxState';
import { INFINITE_SCROLL_CLASSNAME } from '../../utils/InfiniteScroll';

// ─── Fixtures ────────────────────────────────────────────────────

interface Fruit {
    id: string;
    name: string;
    category: string;
    description?: string;
}

const FRUITS: Fruit[] = [
    { id: 'apple', name: 'Apple', category: 'Pome', description: 'A sweet red fruit' },
    { id: 'banana', name: 'Banana', category: 'Tropical', description: 'A long yellow fruit' },
    { id: 'cherry', name: 'Cherry', category: 'Stone', description: 'A small red fruit' },
    { id: 'peach', name: 'Peach', category: 'Stone', description: 'A soft fuzzy fruit' },
];

export const TRANSLATIONS = {
    loadingMessage: 'Loading fruits…',
    emptyMessage: 'No results found',
    errorMessage: 'Failed to load',
    errorTryReloadMessage: 'Please try again later',
    nbOptionMessage: (n: number) => `${n} result(s) available`,
};

// ─── Types ───────────────────────────────────────────────────────

type RenderResult = { unmount: () => void; container: HTMLElement };

/**
 * Options to set up the SelectList test suite.
 * Injected by the framework-specific test file (React or Vue).
 */
export interface SelectListTestSetup {
    components: {
        SelectList: any;
        /** Option component to use in `renderOption` (SelectList.Option / SelectListOption). */
        Option: any;
        /** Option "more info" component (SelectList.OptionMoreInfo / SelectListOptionMoreInfo). */
        OptionMoreInfo: any;
    };
    /**
     * Render a SelectList template with controlled state management.
     *
     * @param template    JSX render function receiving `{ value, onChange, ... }`.
     * @param initialArgs Initial props (value, spies, etc.).
     */
    renderWithState: (template: (props: any) => any, initialArgs?: Record<string, any>) => RenderResult;
}

// ─── DOM Helpers ─────────────────────────────────────────────────

/** Icon paths (`d` attribute) rendered in the `before`/`after` slots of an option. */
function getOptionSlotIcons(option: HTMLElement, slot: 'before' | 'after'): string[] {
    const listItem = option.closest(`.${LIST_ITEM_CLASSNAME}`) as HTMLElement;
    const slotElement = listItem.querySelector(`.${LIST_ITEM_CLASSNAME}__${slot}`);
    return Array.from(slotElement?.querySelectorAll('path') || []).map((path) => path.getAttribute('d') as string);
}

/** Root icon element of a `path` (to check the icon color class). */
const getIconElement = (path: Element) => path.closest(`.${ICON_CLASSNAME}`) as HTMLElement;

/** Label of the option referenced by the listbox `aria-activedescendant`. */
function getActiveOptionLabel(listbox: HTMLElement): string | null {
    const id = listbox.getAttribute('aria-activedescendant');
    return id ? document.getElementById(id)?.textContent?.trim() ?? null : null;
}

const getState = () => document.body.querySelector(`.${STATE_CLASSNAME}`);

// ═══════════════════════════════════════════════════════════════════
// Main test suite
// ═══════════════════════════════════════════════════════════════════

export default function selectListTests({ components, renderWithState }: SelectListTestSetup) {
    const { SelectList, Option, OptionMoreInfo } = components;

    /** Default single-select template. */
    const defaultTemplate = (props: any) => (
        <SelectList aria-label="Fruits" options={FRUITS} getOptionId="id" getOptionName="name" {...props} />
    );

    /** Multi-select template. */
    const multiTemplate = (props: any) => (
        <SelectList
            selectionType="multiple"
            aria-label="Fruits"
            options={FRUITS}
            getOptionId="id"
            getOptionName="name"
            {...props}
        />
    );

    // ─── Static rendering ────────────────────────────────────────

    describe('Static rendering', () => {
        it('should render a focusable listbox with the options always visible', () => {
            renderWithState(defaultTemplate);
            const listbox = screen.getByRole('listbox', { name: 'Fruits' });
            expect(listbox).toHaveAttribute('tabindex', '0');
            expect(listbox).not.toHaveAttribute('aria-expanded');
            const options = within(listbox).getAllByRole('option');
            expect(options.map((option) => option.textContent?.trim())).toEqual(FRUITS.map((f) => f.name));
            for (const option of options) expect(option).toHaveAttribute('tabindex', '-1');
        });

        it('should mark the selected option with aria-selected', () => {
            renderWithState(defaultTemplate, { value: FRUITS[1] });
            expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute('aria-selected', 'true');
            expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'false');
        });

        it('should render option descriptions when getOptionDescription is provided', () => {
            renderWithState(defaultTemplate, { getOptionDescription: 'description' });
            expect(screen.getByRole('option', { name: 'Apple' })).toHaveAccessibleDescription('A sweet red fruit');
        });

        it('should use aria-labelledby as the accessible name', () => {
            renderWithState((props: any) => (
                <>
                    <h2 id="fruits-title">Favorite fruits</h2>
                    <SelectList
                        aria-labelledby="fruits-title"
                        options={FRUITS}
                        getOptionId="id"
                        getOptionName="name"
                        {...props}
                    />
                </>
            ));
            expect(screen.getByRole('listbox', { name: 'Favorite fruits' })).toBeInTheDocument();
        });

        it('should not set a minimum width by default, and set the given minWidth', () => {
            const { unmount } = renderWithState(defaultTemplate, { className: 'select-list-default' });
            expect((document.body.querySelector('.select-list-default') as HTMLElement).style.minWidth).toBe('');
            unmount();
            renderWithState(defaultTemplate, { minWidth: 'l', className: 'select-list-min-l' });
            expect(document.body.querySelector('.select-list-min-l')).toHaveStyle({ minWidth: 'var(--lumx-size-l)' });
        });

        it('should set the width from a size token or a percentage', () => {
            const { unmount } = renderWithState(defaultTemplate, { width: 'xl', className: 'select-list-xl' });
            expect(document.body.querySelector('.select-list-xl')).toHaveStyle({ width: 'var(--lumx-size-xl)' });
            unmount();
            renderWithState(defaultTemplate, { width: '50%', className: 'select-list-half' });
            expect(document.body.querySelector('.select-list-half')).toHaveStyle({ width: '50%' });
        });

        it('should render sections as ARIA groups', () => {
            renderWithState(defaultTemplate, { getSectionId: 'category' });
            const groups = screen.getAllByRole('group');
            expect(groups).toHaveLength(3);
            expect(
                within(groups[2])
                    .getAllByRole('option')
                    .map((o) => o.textContent?.trim()),
            ).toEqual(['Cherry', 'Peach']);
        });
    });

    // ─── Custom option render ────────────────────────────────────

    describe('Custom option render', () => {
        it('should render custom option content with the core-computed props', async () => {
            const onChange = vi.fn();
            renderWithState(defaultTemplate, {
                onChange,
                value: FRUITS[1],
                getOptionDescription: 'description',
                renderOption: (fruit: Fruit) => (
                    <Option value={fruit.id}>
                        <strong>{fruit.name}</strong>
                    </Option>
                ),
            });
            const option = screen.getByRole('option', { name: 'Banana' });
            expect(within(option).getByText('Banana').tagName).toBe('STRONG');
            // Core-computed props are injected (selection, description).
            expect(option).toHaveAttribute('aria-selected', 'true');
            expect(option).toHaveAccessibleDescription('A long yellow fruit');
            await userEvent.click(screen.getByRole('option', { name: 'Cherry' }));
            expect(onChange).toHaveBeenLastCalledWith(FRUITS[2]);
        });

        it('should show the option more info popover on the active option', async () => {
            renderWithState(defaultTemplate, {
                renderOption: (fruit: Fruit) => (
                    <Option value={fruit.id} after={<OptionMoreInfo>{fruit.description}</OptionMoreInfo>}>
                        {fruit.name}
                    </Option>
                ),
            });
            // The more info button is a hover target only (hidden from assistive technologies).
            expect(screen.getAllByRole('button', { hidden: true })).toHaveLength(FRUITS.length);
            expect(screen.queryByText(FRUITS[0].description as string)).not.toBeInTheDocument();
            // Keyboard focus on the first option opens its popover.
            await userEvent.tab();
            expect(getActiveOptionLabel(screen.getByRole('listbox'))).toBe('Apple');
            expect(await screen.findByText(FRUITS[0].description as string)).toBeInTheDocument();
        });
    });

    // ─── Infinite scroll ─────────────────────────────────────────

    describe('Infinite scroll', () => {
        const getSentinel = () => document.body.querySelector(`.${INFINITE_SCROLL_CLASSNAME}`);

        it('should render the infinite scroll sentinel after the options when onLoadMore is provided', () => {
            renderWithState(defaultTemplate, { onLoadMore: vi.fn() });
            const sentinel = getSentinel();
            expect(sentinel).toBeInTheDocument();
            expect(screen.getByRole('listbox')).toContainElement(sentinel as HTMLElement);
            // Rendered after the last option.
            const options = screen.getAllByRole('option');
            const lastOption = options[options.length - 1];
            const lastItem = lastOption.closest('[role="listbox"] > *') as HTMLElement;
            expect(lastItem.nextElementSibling).toBe(sentinel);
        });

        it('should not render the infinite scroll sentinel without onLoadMore', () => {
            renderWithState(defaultTemplate);
            expect(getSentinel()).not.toBeInTheDocument();
        });
    });

    // ─── Selection icons ─────────────────────────────────────────

    describe('Selection icons', () => {
        it('should render a check circle or blank radio icon after every option (single selection)', () => {
            renderWithState(defaultTemplate, { value: FRUITS[1] });
            const selected = screen.getByRole('option', { name: 'Banana' });
            expect(getOptionSlotIcons(selected, 'after')).toEqual([mdiCheckCircle]);
            expect(getOptionSlotIcons(selected, 'before')).toEqual([]);
            const selectedIcon = getIconElement(selected.closest('li')!.querySelector('path')!);
            expect(selectedIcon).toHaveClass(`${ICON_CLASSNAME}--color-primary`);

            const unselected = screen.getByRole('option', { name: 'Apple' });
            expect(getOptionSlotIcons(unselected, 'after')).toEqual([mdiRadioboxBlank]);
            expect(getOptionSlotIcons(unselected, 'before')).toEqual([]);
            const unselectedIcon = getIconElement(unselected.closest('li')!.querySelector('path')!);
            expect(unselectedIcon).not.toHaveClass(`${ICON_CLASSNAME}--color-primary`);
        });

        it('should render a checkbox icon after every option (multiple selection)', () => {
            renderWithState(multiTemplate, { value: [FRUITS[1]] });
            const selected = screen.getByRole('option', { name: 'Banana' });
            expect(getOptionSlotIcons(selected, 'after')).toEqual([mdiCheckboxMarked]);
            expect(getOptionSlotIcons(selected, 'before')).toEqual([]);
            const selectedIcon = getIconElement(selected.closest('li')!.querySelector('path')!);
            expect(selectedIcon).toHaveClass(`${ICON_CLASSNAME}--color-primary`);

            const unselected = screen.getByRole('option', { name: 'Apple' });
            expect(getOptionSlotIcons(unselected, 'after')).toEqual([mdiCheckboxBlankOutline]);
            expect(getOptionSlotIcons(unselected, 'before')).toEqual([]);
            const unselectedIcon = getIconElement(unselected.closest('li')!.querySelector('path')!);
            expect(unselectedIcon).not.toHaveClass(`${ICON_CLASSNAME}--color-primary`);
        });

        it('should append the selection icon after a custom `after` (single selection)', () => {
            renderWithState(defaultTemplate, {
                value: FRUITS[1],
                renderOption: (fruit: Fruit) => (
                    <Option value={fruit.id} after={<span data-testid="custom-after" />}>
                        {fruit.name}
                    </Option>
                ),
            });
            const selected = screen.getByRole('option', { name: 'Banana' });
            const listItem = selected.closest(`.${LIST_ITEM_CLASSNAME}`) as HTMLElement;
            const after = listItem.querySelector(`.${LIST_ITEM_CLASSNAME}__after`) as HTMLElement;
            const customAfter = within(after).getByTestId('custom-after');
            const icon = after.querySelector('path') as HTMLElement;
            expect(icon).toHaveAttribute('d', mdiCheckCircle);
            // Custom content comes first, then the selection icon.
            expect(after.firstElementChild).toBe(customAfter);
            expect(after.lastElementChild).toContainElement(icon);

            const unselected = screen.getByRole('option', { name: 'Apple' });
            expect(getOptionSlotIcons(unselected, 'after')).toEqual([mdiRadioboxBlank]);
        });

        it('should append the checkbox icon after a custom `after` (multiple selection)', () => {
            renderWithState(multiTemplate, {
                value: [FRUITS[1]],
                renderOption: (fruit: Fruit) => (
                    <Option value={fruit.id} after={<span data-testid="custom-after" />}>
                        {fruit.name}
                    </Option>
                ),
            });
            const selected = screen.getByRole('option', { name: 'Banana' });
            const listItem = selected.closest(`.${LIST_ITEM_CLASSNAME}`) as HTMLElement;
            const after = listItem.querySelector(`.${LIST_ITEM_CLASSNAME}__after`) as HTMLElement;
            const customAfter = within(after).getByTestId('custom-after');
            const icon = after.querySelector('path') as unknown as HTMLElement;
            expect(icon).toHaveAttribute('d', mdiCheckboxMarked);
            // Custom content comes first, then the checkbox icon.
            expect(after.firstElementChild).toBe(customAfter);
            expect(after.lastElementChild).toContainElement(icon);

            const unselected = screen.getByRole('option', { name: 'Apple' });
            expect(getOptionSlotIcons(unselected, 'after')).toEqual([mdiCheckboxBlankOutline]);
        });
    });

    // ─── Single selection ────────────────────────────────────────

    describe('Single selection', () => {
        it('should select an option on click (with the option object)', async () => {
            const onChange = vi.fn();
            renderWithState(defaultTemplate, { onChange });
            await userEvent.click(screen.getByRole('option', { name: 'Cherry' }));
            expect(onChange).toHaveBeenLastCalledWith(FRUITS[2]);
            expect(screen.getByRole('option', { name: 'Cherry' })).toHaveAttribute('aria-selected', 'true');
            expect(screen.getByRole('listbox')).toHaveFocus();
        });

        it('should navigate with the keyboard and select with Enter', async () => {
            const onChange = vi.fn();
            renderWithState(defaultTemplate, { onChange });
            const listbox = screen.getByRole('listbox');
            await userEvent.tab();
            expect(listbox).toHaveFocus();
            expect(getActiveOptionLabel(listbox)).toBe('Apple');
            await userEvent.keyboard('{ArrowDown}{Enter}');
            expect(onChange).toHaveBeenLastCalledWith(FRUITS[1]);
            // The list stays visible and the active option stays.
            expect(getActiveOptionLabel(listbox)).toBe('Banana');
        });

        it('should deselect the selected option when it is selected again', async () => {
            const onChange = vi.fn();
            renderWithState(defaultTemplate, { value: FRUITS[1], onChange });
            await userEvent.click(screen.getByRole('option', { name: 'Banana' }));
            expect(onChange).toHaveBeenLastCalledWith(undefined);
            expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute('aria-selected', 'false');
        });

        it('should activate the selected option on focus', async () => {
            renderWithState(defaultTemplate, { value: FRUITS[2] });
            await userEvent.tab();
            expect(getActiveOptionLabel(screen.getByRole('listbox'))).toBe('Cherry');
        });
    });

    // ─── Multiple selection ──────────────────────────────────────

    describe('Multiple selection', () => {
        it('should set aria-multiselectable on the listbox', () => {
            renderWithState(multiTemplate, { value: [] });
            expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
        });

        it('should add and remove options (toggle)', async () => {
            const onChange = vi.fn();
            renderWithState(multiTemplate, { value: [FRUITS[0]], onChange });
            await userEvent.click(screen.getByRole('option', { name: 'Banana' }));
            expect(onChange).toHaveBeenLastCalledWith([FRUITS[0], FRUITS[1]]);
            await userEvent.keyboard(' ');
            expect(onChange).toHaveBeenLastCalledWith([FRUITS[0]]);
            expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute('aria-selected', 'false');
        });
    });

    // ─── List status ─────────────────────────────────────────────

    describe('List status', () => {
        it('should render skeleton placeholders when listStatus="loading"', async () => {
            renderWithState(defaultTemplate, { listStatus: 'loading', options: [] });
            expect(document.body.querySelectorAll(`.${OPTION_SKELETON_CLASSNAME}`).length).toBeGreaterThan(0);
            expect(screen.queryAllByRole('option')).toHaveLength(0);
            await vi.waitFor(() => expect(screen.getByRole('listbox')).toHaveAttribute('aria-busy', 'true'));
        });

        it('should announce the loading message after a delay', async () => {
            renderWithState(defaultTemplate, { listStatus: 'loading', options: [], translations: TRANSLATIONS });
            expect(getState()?.textContent).not.toContain(TRANSLATIONS.loadingMessage);
            await vi.waitFor(() => expect(getState()?.textContent).toContain(TRANSLATIONS.loadingMessage), {
                timeout: 1500,
            });
        });

        it('should append a skeleton when listStatus="loadingMore"', () => {
            renderWithState(defaultTemplate, { listStatus: 'loadingMore', options: FRUITS.slice(0, 2) });
            expect(screen.getAllByRole('option')).toHaveLength(2);
            expect(document.body.querySelectorAll(`.${OPTION_SKELETON_CLASSNAME}`).length).toBeGreaterThan(0);
        });

        it('should render the error message when listStatus="error"', async () => {
            renderWithState(defaultTemplate, { listStatus: 'error', options: [], translations: TRANSLATIONS });
            await vi.waitFor(() => {
                expect(getState()?.textContent).toContain(TRANSLATIONS.errorMessage);
                expect(getState()?.textContent).toContain(TRANSLATIONS.errorTryReloadMessage);
            });
        });

        it('should render the empty message when there is no option', async () => {
            renderWithState(defaultTemplate, { options: [], translations: TRANSLATIONS });
            await vi.waitFor(() => expect(getState()?.textContent).toContain(TRANSLATIONS.emptyMessage));
        });

        it('should render the option count message', async () => {
            renderWithState(defaultTemplate, { translations: TRANSLATIONS });
            await vi.waitFor(() =>
                expect(getState()?.textContent).toContain(TRANSLATIONS.nbOptionMessage(FRUITS.length)),
            );
        });
    });
}
