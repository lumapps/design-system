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
    Thumbnail,
    Uploader,
} from '@lumx/react';
import { DisabledStateProvider } from '@lumx/react/utils';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { disableArgTypes } from '@lumx/core/stories/utils/disableArgTypes';
import { mdiFoodApple } from '@lumx/icons';
import { LANDSCAPE_IMAGES } from '@lumx/core/stories/controls/image';

export default {
    title: 'utils/disabled/DisabledStateProvider',
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
                label="Date picker field"
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
            <TextField label="texfield" onChange={() => {}} value="" />
            <Thumbnail alt="Thumbnail" image={LANDSCAPE_IMAGES.landscape1s200} onClick={() => {}} />
            <Uploader label="Upload a file" fileInputProps={{ onChange: () => {} }} />
        </DisabledStateProvider>
    ),
};
