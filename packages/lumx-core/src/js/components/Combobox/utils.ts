import type { FocusNavigationController } from '../../utils/focusNavigation';
import type { OptionRegistration, SectionRegistration, SectionState } from './types';

/**
 * Get the value for a combobox option element.
 * Uses `data-value` when set; falls back to the element's trimmed `textContent`.
 */
export function getOptionValue(option: HTMLElement): string {
    if (option.dataset.value !== undefined) return option.dataset.value;
    return option.textContent?.trim() ?? '';
}

/** Returns true when an option carries aria-disabled="true". */
export function isOptionDisabled(option: HTMLElement): boolean {
    return option.getAttribute('aria-disabled') === 'true';
}

/** Returns true when the cell is NOT the first gridcell in its row (i.e., it's an action cell). */
export function isActionCell(cell: HTMLElement): boolean {
    const row = cell.closest('[role="row"]');
    if (!row) return false;
    return row.querySelector('[role="gridcell"]') !== cell;
}

/** Predicate matching an option element that carries `aria-selected="true"`. */
export const isSelected = (el: Element) => el.getAttribute('aria-selected') === 'true';

/** Navigate to the selected option, or to the first option if none is selected. */
export function goToSelectedOrFirst(nav: FocusNavigationController) {
    if (!nav.goToItemMatching(isSelected)) nav.goToFirst();
}

/** Navigate to the selected option, or to the last option if none is selected. */
export function goToSelectedOrLast(nav: FocusNavigationController) {
    if (!nav.goToItemMatching(isSelected)) nav.goToLast();
}

/**
 * Compute the current state of a section and notify when it changed.
 *
 * Section state:
 * - `hidden`: true when the section has registered options but all are filtered out.
 * - `aria-hidden`: true when the section has no registered options at all (skeleton-only).
 *
 * At most one of `hidden` / `aria-hidden` is true at a time.
 */
export function notifySection(
    sectionElement: HTMLElement,
    sectionRegistrations: Map<HTMLElement, SectionRegistration>,
    optionRegistrations: Map<HTMLElement, OptionRegistration>,
    force?: boolean,
): void {
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
