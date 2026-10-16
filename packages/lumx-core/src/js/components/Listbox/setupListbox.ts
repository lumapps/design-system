import { setupComposite } from '../Composite/setupComposite';
import type { CompositeFilterMode } from '../Composite/types';
import { getOptionValue } from '../Composite/utils';
import { notifySection } from './utils';
import { createGridNavigation, createListNavigation } from './navigation';
import type {
    ListboxHandle,
    ListboxOptions,
    ListboxType,
    OptionRegistration,
    SectionRegistration,
    SectionState,
} from './types';

/**
 * Set up listbox behavior (WAI-ARIA listbox or grid pattern) independent of any DOM element.
 *
 * Built on the composite base (see {@link setupComposite}: focus owner, focus navigation, keyboard,
 * selection, open state, skeletons, loading announcement and events). The listbox adds the
 * option/section registry, the option filter and the list and grid navigation modules.
 * The navigation module (listbox or grid pattern) is selected from the element role on mount.
 *
 * - Standalone (no `focusOwner` option): the listbox element owns DOM focus and
 *   `aria-activedescendant`, and handles its own keyboard navigation.
 * - Linked (`focusOwner` option, e.g. a combobox trigger): the parent owns focus and the keyboard;
 *   the listbox writes `aria-activedescendant` on the parent focus owner.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 */
export function setupListbox(options: ListboxOptions = {}): ListboxHandle {
    /** Current filter value (empty string = no filtering). */
    let filterValue = '';
    /** Current filter mode (`'manual'`: the consumer filters the options, none is hidden). */
    let filterMode: CompositeFilterMode = 'auto';
    const optionRegistrations = new Map<HTMLElement, OptionRegistration>();
    const sectionRegistrations = new Map<HTMLElement, SectionRegistration>();

    function getVisibleOptionCount(): number {
        let count = 0;
        for (const reg of optionRegistrations.values()) {
            if (!reg.lastFiltered) count += 1;
        }
        return count;
    }

    function isFilteredOut(option: HTMLElement): boolean {
        const filterLower = filterValue.toLowerCase();
        return (
            filterMode === 'auto' &&
            filterLower.length > 0 &&
            !getOptionValue(option).toLowerCase().includes(filterLower)
        );
    }

    function notifySections() {
        for (const [sectionElement] of sectionRegistrations) {
            notifySection(sectionElement, sectionRegistrations, optionRegistrations);
        }
    }

    const { handle: composite, notifyOptionsChange } = setupComposite<ListboxType>(options, {
        // Select the navigation module (listbox or grid pattern) from the element role.
        createNavigation: (element, navigationOptions) =>
            element.getAttribute('role') === 'grid'
                ? createGridNavigation(navigationOptions)
                : createListNavigation(navigationOptions),

        getVisibleCount: getVisibleOptionCount,

        setFilter(newFilter, mode) {
            filterValue = newFilter;
            filterMode = mode;
            for (const [optionElement, reg] of optionRegistrations) {
                const isFiltered = isFilteredOut(optionElement);
                // Only notify when state actually changes to avoid unnecessary re-renders.
                if (isFiltered !== reg.lastFiltered) {
                    reg.lastFiltered = isFiltered;
                    reg.callback(isFiltered);
                }
            }
            notifySections();
        },

        destroy() {
            filterValue = '';
            filterMode = 'auto';
            optionRegistrations.clear();
            sectionRegistrations.clear();
        },
    });

    /** Notify sections, then fire `optionsChange` when the visible count changed. */
    function notifyVisibilityChange() {
        notifySections();
        notifyOptionsChange();
    }

    // Add the option/section registry to the composite handle (keeps its getters).
    return Object.assign(composite, {
        registerOption(optionElement: HTMLElement, callback: (isFiltered: boolean) => void) {
            const isFiltered = isFilteredOut(optionElement);
            optionRegistrations.set(optionElement, { callback, lastFiltered: isFiltered });
            // Notify immediately with current state so the option renders correctly.
            callback(isFiltered);
            notifyVisibilityChange();
            return () => {
                optionRegistrations.delete(optionElement);
                notifyVisibilityChange();
            };
        },

        refilterOption(optionElement: HTMLElement) {
            const reg = optionRegistrations.get(optionElement);
            if (!reg) return;
            const isFiltered = isFilteredOut(optionElement);
            if (isFiltered !== reg.lastFiltered) {
                reg.lastFiltered = isFiltered;
                reg.callback(isFiltered);
                notifyVisibilityChange();
            }
        },

        registerSection(sectionElement: HTMLElement, callback: (state: SectionState) => void) {
            sectionRegistrations.set(sectionElement, { callback, last: { hidden: false, 'aria-hidden': false } });
            // Compute and notify initial state immediately (force to ensure callback fires).
            notifySection(sectionElement, sectionRegistrations, optionRegistrations, true);
            return () => {
                sectionRegistrations.delete(sectionElement);
            };
        },
    });
}
