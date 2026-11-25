import { mdiTranslate } from '@lumx/icons';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import { AVATAR_IMAGES } from '@lumx/core/stories/controls/image';

export function setup({
    component: TextField,
    components: { Avatar, Chip, IconButton, Typography },
    decorators: { withValueOnChange, withCombinations },
}: SetupStoriesOptions<{
    decorators: 'withValueOnChange' | 'withCombinations';
    components: { Avatar: any; Chip: any; IconButton: any; Typography: any };
}>) {
    const meta = {
        component: TextField,
        argTypes: {
            clearButtonProps: { control: false },
            chips: { control: false },
            afterElement: { control: false },
            beforeElement: { control: false },
            onClear: { action: true },
        },
        decorators: [withValueOnChange({})],
    };

    /** Default text field */
    const Default = {
        args: {
            value: '',
        },
    };

    /** With placeholder */
    const Placeholder = {
        args: {
            value: '',
            placeholder: 'Texfield placeholder',
        },
    };

    /** With label and helper */
    const LabelAndHelper = {
        args: {
            ...Default.args,
            label: 'Textfield label',
            helper: loremIpsum('tiny'),
        },
    };

    /** With custom label and helper */
    const CustomLabelAndHelper = {
        render: (args: any) => (
            <TextField
                {...args}
                label="Textfield label"
                labelProps={{ typography: Typography.subtitle1 }}
                helper={loremIpsum('tiny')}
            />
        ),
    };

    /** As number field */
    const NumberField = {
        args: {
            value: '0',
            type: 'number',
        },
    };

    /** Multiline textarea */
    const TextareaField = {
        args: {
            value: loremIpsum('tiny'),
            multiline: true,
            minimumRows: 2,
        },
    };

    /** Error state */
    const Error = {
        args: {
            ...LabelAndHelper.args,
            hasError: true,
            error: 'Error message',
        },
    };

    /** Valid state */
    const Valid = {
        args: {
            ...LabelAndHelper.args,
            isValid: true,
        },
    };

    /** Max length with character counter */
    const MaxLength = {
        args: {
            ...LabelAndHelper.args,
            value: 'Textfield value',
            maxLength: 195,
            charCounterMessage: (n: number) => `${n} characters`,
        },
    };

    /** Custom element at the end */
    const WithAfterElement = {
        render: (args: any) => (
            <TextField
                {...args}
                afterElement={<IconButton label="translate" emphasis="medium" size="s" icon={mdiTranslate} />}
            />
        ),
    };

    /** Chips at the start */
    const WithChips = {
        render: (args: any) => (
            <TextField
                {...args}
                chips={
                    <>
                        <Chip size="s">Chip 1</Chip>
                        <Chip size="s">Chip 2</Chip>
                    </>
                }
            />
        ),
    };

    /** Custom element at the start */
    const WithBeforeElement = {
        render: (args: any) => (
            <TextField
                {...args}
                beforeElement={
                    <span
                        aria-hidden="true"
                        style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'red' }}
                    />
                }
            />
        ),
    };

    /** Custom element at the start, together with the icon */
    const WithBeforeElementAndIcon = {
        render: (args: any) => (
            <TextField
                {...args}
                icon={mdiTranslate}
                beforeElement={<Avatar size="xs" image={AVATAR_IMAGES.avatar1} alt="User avatar" />}
            />
        ),
    };

    /** Custom element at the start of a multiline field */
    const WithBeforeElementMultiline = {
        render: (args: any) => (
            <TextField
                {...args}
                multiline
                value={loremIpsum('short')}
                beforeElement={<Avatar size="xs" image={AVATAR_IMAGES.avatar1} alt="User avatar" />}
            />
        ),
    };

    /** Custom element at the start of a disabled field */
    const WithBeforeElementDisabled = {
        render: (args: any) => (
            <TextField
                {...args}
                isDisabled
                beforeElement={<Avatar size="xs" image={AVATAR_IMAGES.avatar1} alt="User avatar" />}
            />
        ),
    };

    /** Disabled state */
    const Disabled = {
        args: {
            value: 'Some value',
            label: 'Label',
            helper: 'Helper',
        },
        decorators: [
            withCombinations({
                combinations: {
                    rows: {
                        disabled: { disabled: true },
                        'aria-disabled': { 'aria-disabled': true },
                    },
                },
            }),
        ],
    };

    return {
        meta,
        Default,
        Placeholder,
        LabelAndHelper,
        CustomLabelAndHelper,
        NumberField,
        TextareaField,
        Error,
        Valid,
        MaxLength,
        WithAfterElement,
        WithChips,
        WithBeforeElement,
        WithBeforeElementAndIcon,
        WithBeforeElementMultiline,
        WithBeforeElementDisabled,
        Disabled,
    };
}
