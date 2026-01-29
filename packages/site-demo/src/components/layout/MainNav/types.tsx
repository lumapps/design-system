import { Framework } from '../FrameworkContext';

export interface MenuEntry {
    path: string;
    label: string;
    hasDynamicChildren: boolean;
    children: Array<{ id: string }>;
    frameworks?: Framework[];
}

export type MenuEntryByPath = Record<string, MenuEntry>;
