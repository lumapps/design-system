import type { CompositeHandle } from '../Composite/types';
import type { ListboxHandle, OptionRegistration, SectionRegistration, SectionState } from './types';

/** Whether a composite handle is a listbox handle (it has the option registry). */
export function isListboxHandle(handle: CompositeHandle | null | undefined): handle is ListboxHandle {
    return !!handle && 'registerOption' in handle;
}

/** Returns true when the cell is NOT the first gridcell in its row (i.e., it's an action cell). */
export function isActionCell(cell: HTMLElement): boolean {
    const row = cell.closest('[role="row"]');
    if (!row) return false;
    return row.querySelector('[role="gridcell"]') !== cell;
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
