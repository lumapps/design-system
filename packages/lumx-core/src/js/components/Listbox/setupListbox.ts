import { setupComposite } from '../Composite/setupComposite';
import type { CompositeFilter, CompositeOptions } from '../Composite/types';
import { getOptionValue } from '../Composite/utils';
import { createGridNavigation, createListNavigation } from './navigation';
import type { ListboxHandle, OptionRegistration, SectionRegistration, SectionState } from './types';

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
export function setupListbox(options: CompositeOptions = {}): ListboxHandle {
    const optionRegistrations = new Map<HTMLElement, OptionRegistration>();
    const sectionRegistrations = new Map<HTMLElement, SectionRegistration>();

    function getVisibleOptionCount(): number {
        let count = 0;
        for (const reg of optionRegistrations.values()) {
            if (!reg.lastFiltered) count += 1;
        }
        return count;
    }

    function isFilteredOut(option: HTMLElement, { value, mode }: CompositeFilter): boolean {
        // `'manual'`: the consumer filters the options, none is hidden.
        const filterLower = value.toLowerCase();
        return mode === 'auto' && filterLower.length > 0 && !getOptionValue(option).toLowerCase().includes(filterLower);
    }

    /** Update the filter state of a registered option. Returns whether it changed (then notifies the option). */
    function updateFilterState(optionElement: HTMLElement, filter: CompositeFilter): boolean {
        const reg = optionRegistrations.get(optionElement);
        if (!reg) return false;
        const isFiltered = isFilteredOut(optionElement, filter);
        // Only notify when state actually changes to avoid unnecessary re-renders.
        if (isFiltered === reg.lastFiltered) return false;
        reg.lastFiltered = isFiltered;
        reg.callback(isFiltered);
        return true;
    }

    /**
     * Compute the current state of a section and notify when it changed (or always, with `force`).
     *
     * Section state:
     * - `hidden`: true when the section has registered options but all are filtered out.
     * - `aria-hidden`: true when the section has no registered options at all (skeleton-only).
     *
     * At most one of `hidden` / `aria-hidden` is true at a time.
     */
    function notifySection(sectionElement: HTMLElement, force?: boolean) {
        const reg = sectionRegistrations.get(sectionElement);
        if (!reg) return;
        let hasOptions = false;
        let hasVisibleOption = false;
        for (const [optionElement, optionReg] of optionRegistrations) {
            if (sectionElement.contains(optionElement)) {
                hasOptions = true;
                if (!optionReg.lastFiltered) {
                    hasVisibleOption = true;
                    break;
                }
            }
        }
        const state: SectionState = {
            hidden: hasOptions && !hasVisibleOption,
            'aria-hidden': !hasOptions,
        };
        if (force || state.hidden !== reg.last.hidden || state['aria-hidden'] !== reg.last['aria-hidden']) {
            reg.last = state;
            reg.callback(state);
        }
    }

    function notifySections() {
        for (const [sectionElement] of sectionRegistrations) notifySection(sectionElement);
    }

    const {
        handle: composite,
        notifyOptionsChange,
        getFilter,
    } = setupComposite(options, {
        // Select the navigation module (listbox or grid pattern) from the element role.
        createNavigation: (navigationOptions) =>
            navigationOptions.container.getAttribute('role') === 'grid'
                ? createGridNavigation(navigationOptions)
                : createListNavigation(navigationOptions),

        getVisibleCount: getVisibleOptionCount,

        applyFilter(filter) {
            for (const optionElement of optionRegistrations.keys()) updateFilterState(optionElement, filter);
            notifySections();
        },

        destroy() {
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
            const isFiltered = isFilteredOut(optionElement, getFilter());
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
            if (updateFilterState(optionElement, getFilter())) notifyVisibilityChange();
        },

        registerSection(sectionElement: HTMLElement, callback: (state: SectionState) => void) {
            sectionRegistrations.set(sectionElement, { callback, last: { hidden: false, 'aria-hidden': false } });
            // Compute and notify initial state immediately (force to ensure callback fires).
            notifySection(sectionElement, true);
            return () => {
                sectionRegistrations.delete(sectionElement);
            };
        },
    });
}
