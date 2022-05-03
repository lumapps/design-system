export interface MenuEntry {
    path: string;
    label: string;
    hasDynamicChildren: boolean;
    children: Array<{ id: string }>;
}

export type MenuEntryByPath = Record<string, MenuEntry>;
