/**
 * Browser-only test stories for ListItem (React).
 *
 * These tests require Playwright because they rely on CSS hit-testing of the action area overlay.
 */
import { Button } from '@lumx/react';
import { setup } from '@lumx/core/js/components/List/ListItemTestStories';

import { List } from './List';
import { ListItem } from './ListItem';
import { ListItemAction } from './ListItemAction';

const { meta, ...testStories } = setup({
    component: ListItem,
    components: { List, ListItemAction, Button },
});

export default {
    title: 'LumX components/list/ListItem/Tests',
    ...meta,
};

// Browser-only: clicks on `before`/`after` slots with an action area (requires real CSS hit-testing).
export const ClickOnBeforeSlotTriggersAction = { ...testStories.ClickOnBeforeSlotTriggersAction };
export const ClickOnAfterSlotTriggersAction = { ...testStories.ClickOnAfterSlotTriggersAction };
export const ClickOnSlotButtonTriggersButton = { ...testStories.ClickOnSlotButtonTriggersButton };
