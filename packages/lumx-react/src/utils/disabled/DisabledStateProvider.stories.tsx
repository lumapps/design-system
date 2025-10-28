import React from 'react';

import {
    Button,
    Checkbox,
    Chip,
    DatePickerField,
    IconButton,
    Link,
    List,
    ListItem,
    RadioButton,
    Switch,
    TextField,
} from '@lumx/react';
import { DisabledStateProvider } from '@lumx/react/utils';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { disableArgTypes } from '@lumx/react/stories/utils/disableArgTypes';
import { mdiFoodApple } from '@lumx/icons';

export default {
    title: 'LumX components/DisabledStateProvider',
    component: DisabledStateProvider,
    argTypes: {
        state: getSelectArgType(['disabled', undefined]),
        ...disableArgTypes(['children']),
    },
};

/**
 * Disabling nested children
 */
export const Disabled = {
    args: {
        state: 'disabled',
    },
    render: ({ state }: any) => (
        <DisabledStateProvider state={state}>
            <Button>Button</Button>
            <Button isDisabled>Disabled Button</Button>
        </DisabledStateProvider>
    ),
};

/**
 * Testing when the context is not active
 */
export const NotDisabled = {
    args: {
        state: undefined,
    },
    render: ({ state }: any) => (
        <DisabledStateProvider state={state}>
            <Button>Button</Button>
            <Button isDisabled>Disabled Button</Button>
        </DisabledStateProvider>
    ),
};

/**
 * Testing disabling children
 */
export const AllComponents = {
    args: {
        state: 'disabled',
    },
    render: ({ state }: any) => (
        <DisabledStateProvider state={state}>
            <Button>Button</Button>
            <IconButton label="Icon button" icon={mdiFoodApple} />
            <Checkbox label="Checkbox" />
            <Chip onClick={() => {}}>Chip</Chip>
            <DatePickerField
                nextButtonProps={{ label: 'Next' }}
                previousButtonProps={{ label: 'Previous' }}
                value={new Date()}
                onChange={() => {}}
            />
            <Link href="https://example.com">Link</Link>
            <List>
                <ListItem onItemSelected={() => {}}>Clickable list item</ListItem>
            </List>
            <RadioButton label="Radio button" />
            <Switch>Switch</Switch>
            <TextField onChange={() => {}} value="" />
        </DisabledStateProvider>
    ),
};
