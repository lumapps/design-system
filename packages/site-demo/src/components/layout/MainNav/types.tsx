import { Framework } from '../FrameworkContext';

export interface MenuEntry {
    path: string;
    label: string;
    hasDynamicChildren: boolean;
    children: Array<{ id: string }>;
    frameworks?: Framework[];
    deprecated?: boolean;
}

export type MenuEntryByPath = Record<string, MenuEntry>;
