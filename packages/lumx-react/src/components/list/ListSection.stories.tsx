import { mdiAlert, mdiFolderOutline } from '@lumx/icons';
import { FlexBox, List, ListDivider, ListItem, ListItemSize, ListProps, Size } from '@lumx/react';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { ListSection } from './ListSection';

export default {
    title: 'LumX components/list/ListSection',
    component: ListSection,
    argTypes: {
        'list.itemPadding': getSelectArgType<ListProps['itemPadding'] | undefined>([undefined, Size.big, Size.huge]),
        'listItem.size': getSelectArgType<ListItemSize | undefined>([undefined, Size.tiny, Size.regular, Size.big]),
    },
};

/**
 * Default list section with a label and items.
 */
export const Default = {
    args: {
        label: 'Section title',
    },
    argTypes: {
        icon: iconArgType,
    },
    render({ 'list.itemPadding': itemPadding, 'listItem.size': itemSize, ...args }: any) {
        return (
            <List itemPadding={itemPadding} style={{ border: '1px dashed red' }}>
                <ListSection {...args}>
                    <ListItem size={itemSize}>Item 1</ListItem>
                    <ListItem size={itemSize}>Item 2</ListItem>
                    <ListItem size={itemSize}>Item 3</ListItem>
                </ListSection>
            </List>
        );
    },
};

/**
 * Auto-divider edge cases:
 * - Single section → no divider rendered
 * - Two adjacent sections → one auto-divider between them
 * - Three adjacent sections → two auto-dividers
 * - Sections separated by a ListItem → no auto-divider (not adjacent)
 * - Sections separated by an explicit ListDivider → explicit divider only, no duplicate auto-divider
 */
export const AutoDividerEdgeCases = {
    render({ 'list.itemPadding': itemPadding, 'listItem.size': itemSize }: any) {
        return (
            <div style={{ display: 'flex', gap: 32 }}>
                <div>
                    <p style={{ marginBottom: 8, fontWeight: 'bold' }}>Single section</p>
                    <List itemPadding={itemPadding} style={{ border: '1px dashed red' }}>
                        <ListSection label="Only section">
                            <ListItem size={itemSize}>Item A</ListItem>
                        </ListSection>
                    </List>
                </div>

                <div>
                    <p style={{ marginBottom: 8, fontWeight: 'bold' }}>Two adjacent sections</p>
                    <List itemPadding={itemPadding} style={{ border: '1px dashed red' }}>
                        <ListSection label="Section 1">
                            <ListItem size={itemSize}>Item A</ListItem>
                            <ListItem size={itemSize}>Item B</ListItem>
                        </ListSection>
                        <ListSection label="Section 2">
                            <ListItem size={itemSize}>Item C</ListItem>
                        </ListSection>
                    </List>
                </div>

                <div>
                    <p style={{ marginBottom: 8, fontWeight: 'bold' }}>Three adjacent sections</p>
                    <List itemPadding={itemPadding} style={{ border: '1px dashed red' }}>
                        <ListSection label="Section 1">
                            <ListItem size={itemSize}>Item A</ListItem>
                        </ListSection>
                        <ListSection label="Section 2">
                            <ListItem size={itemSize}>Item B</ListItem>
                        </ListSection>
                        <ListSection label="Section 3">
                            <ListItem size={itemSize}>Item C</ListItem>
                        </ListSection>
                    </List>
                </div>

                <div>
                    <p style={{ marginBottom: 8, fontWeight: 'bold' }}>Sections separated by ListItem</p>
                    <List itemPadding={itemPadding} style={{ border: '1px dashed red' }}>
                        <ListSection label="Section 1">
                            <ListItem size={itemSize}>Item A</ListItem>
                        </ListSection>
                        <ListItem size={itemSize}>Standalone item</ListItem>
                        <ListSection label="Section 2">
                            <ListItem size={itemSize}>Item B</ListItem>
                        </ListSection>
                    </List>
                </div>

                <div>
                    <p style={{ marginBottom: 8, fontWeight: 'bold' }}>Sections separated by ListDivider</p>
                    <List itemPadding={itemPadding} style={{ border: '1px dashed red' }}>
                        <ListSection label="Section 1">
                            <ListItem size={itemSize}>Item A</ListItem>
                        </ListSection>
                        <ListDivider />
                        <ListSection label="Section 2">
                            <ListItem size={itemSize}>Item B</ListItem>
                        </ListSection>
                    </List>
                </div>
            </div>
        );
    },
};

/**
 * Section title variants: no label, label only, label with icon.
 */
export const LabelVariants = {
    render({ 'list.itemPadding': itemPadding, 'listItem.size': itemSize }: any) {
        return (
            <>
                <List itemPadding={itemPadding} style={{ border: '1px dashed red' }}>
                    <ListSection>
                        <ListItem size={itemSize}>Item without section label</ListItem>
                        <ListItem size={itemSize}>Another item</ListItem>
                    </ListSection>
                </List>

                <List itemPadding={itemPadding} style={{ border: '1px dashed red' }}>
                    <ListSection label="Label only">
                        <ListItem size={itemSize}>Item A</ListItem>
                        <ListItem size={itemSize}>Item B</ListItem>
                    </ListSection>
                </List>

                <List itemPadding={itemPadding} style={{ border: '1px dashed red' }}>
                    <ListSection icon={mdiFolderOutline} label="Label with icon">
                        <ListItem size={itemSize}>Item X</ListItem>
                        <ListItem size={itemSize}>Item Y</ListItem>
                    </ListSection>
                </List>
            </>
        );
    },
    decorators: [withWrapper({ vAlign: 'space-around', orientation: 'horizontal' }, FlexBox)],
};

/**
 * Sections with clickable items (menu-like usage).
 */
export const ClickableItems = {
    argTypes: {
        onClick: { action: true },
    },
    args: {
        'list.itemPadding': Size.big,
        'listItem.size': Size.tiny,
    },
    render({ onClick, 'list.itemPadding': itemPadding, 'listItem.size': itemSize }: any) {
        return (
            <List itemPadding={itemPadding} style={{ border: '1px dashed red' }}>
                <ListSection label="Actions">
                    <ListItem size={itemSize} onItemSelected={onClick}>
                        Edit
                    </ListItem>
                    <ListItem size={itemSize} onItemSelected={onClick}>
                        Duplicate
                    </ListItem>
                </ListSection>
                <ListSection icon={mdiAlert} label="Danger zone">
                    <ListItem size={itemSize} onItemSelected={onClick}>
                        Delete
                    </ListItem>
                </ListSection>
            </List>
        );
    },
};
