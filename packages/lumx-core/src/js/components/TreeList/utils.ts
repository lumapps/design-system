import type { CompositeHandle } from '../Composite/types';
import type { TreeListHandle } from './types';

/** Whether a composite handle is a tree list handle (it has the tree item registry). */
export function isTreeListHandle(handle: CompositeHandle | null | undefined): handle is TreeListHandle {
    return !!handle && 'registerTreeItem' in handle;
}
