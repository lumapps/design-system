import type { CompositeHandle } from '../Composite/types';
import type { ListboxHandle } from './types';

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
