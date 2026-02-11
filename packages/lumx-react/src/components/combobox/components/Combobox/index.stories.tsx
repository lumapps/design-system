import React, { useMemo, useState } from 'react';

import { Meta, StoryFn } from '@storybook/react';

import {
    Alignment,
    Chip,
    Emphasis,
    FlexBox,
    IconButton,
    Orientation,
    Size,
    SkeletonCircle,
    SkeletonRectangle,
    SkeletonRectangleVariant,
    UserBlock,
} from '@lumx/react';
import { mdiClose, mdiMenuDown } from '@lumx/icons';
import { ComboboxProps } from '../../types';
import { ComboboxListBoxProps } from '../ComboboxListBox';
import { Combobox } from './index';
import { ComboboxOptionSkeleton } from '../ComboboxOption/ComboboxOptionSkeleton';
import { ComboboxOptionAction } from '../ComboboxOptionAction';

type StoryOption = {
    id: string;
    textValue: string;
    isDisabled?: boolean;
    data: {
        picture: string;
    };
};

const COMBOBOX_LABEL = 'Pick a user';

const names = [
    'Sue Pittman',
    'Louise Copeland',
    'Joe Patrick',
    'Flora Burke',
    'Bertie Brewer',
    'Harry Mills',
    'Leon Douglas',
];

function slugify(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

const defaultOptions: Array<StoryOption> = names.map((name, index) => ({
    id: slugify(name),
    textValue: name,
    data: {
        picture: `https://i.pravatar.cc/64?img=${index}`,
    },
}));

type StoriesArgs = React.FC<
    ComboboxProps & {
        onEditOptionAction: () => void;
        onDeleteOptionAction: () => void;
        options: Array<StoryOption>;
        defaultSelectedIndex?: number;
        customSkeleton?: ComboboxListBoxProps['renderItemSkeleton'];
    }
>;

export default {
    component: Combobox,
    title: 'LumX components/combobox/Combobox',
    args: {
        options: defaultOptions,
        translations: {
            clearLabel: 'Clear',
            showSuggestionsLabel: 'Show suggestions',
            loadingLabel: 'Loading...',
            noResultsForInputLabel: (input?: string) => (input ? `No results for "${input}"` : 'No results'),
            serviceUnavailableLabel: 'Service unavailable',
            tryReloadLabel: 'Try to reload',
            nbOptionsLabel: (options: number) => `${options} option${options > 1 ? 's' : ''} available`,
        },
    },
    argTypes: {
        onSelect: { action: 'Select ' },
        onEditOptionAction: { action: 'Edit ' },
        onDeleteOptionAction: { action: 'Delete ' },
    },
} as Meta<StoriesArgs>;

/**
 * Default combobox with input
 */
export const Default: StoryFn<StoriesArgs> = ({ options, ...args }) => (
    <Combobox {...args}>
        <Combobox.Input label={COMBOBOX_LABEL} />
        <Combobox.List>
            {options.map((option) => (
                <Combobox.Option key={option.id} id={option.id}>
                    {option.textValue}
                </Combobox.Option>
            ))}
        </Combobox.List>
    </Combobox>
);

/**
 * Open the combobox on focus.
 */
export const OpenOnFocus: StoryFn<StoriesArgs> = ({ options, ...args }) => (
    <Combobox {...args} openOnFocus>
        <Combobox.Input label={COMBOBOX_LABEL} />
        <Combobox.List>
            {options.map((option) => (
                <Combobox.Option key={option.id} id={option.id}>
                    {option.textValue}
                </Combobox.Option>
            ))}
        </Combobox.List>
    </Combobox>
);

/**
 * Focus specific option
 */
export const FocusSpecificOption: StoryFn<StoriesArgs> = ({ options, ...args }) => (
    <Combobox {...args}>
        <Combobox.Input label={COMBOBOX_LABEL} />
        <Combobox.List>
            {options.map((option, index) => (
                <Combobox.Option key={option.id} id={option.id} autofocus={index === 2}>
                    {option.textValue}
                </Combobox.Option>
            ))}
        </Combobox.List>
    </Combobox>
);

/**
 * Has clear button
 */
export const HasClearButton: StoryFn<StoriesArgs> = ({ options, ...args }) => (
    <Combobox {...args}>
        <Combobox.Input label={COMBOBOX_LABEL} hasClearButton />
        <Combobox.List>
            {options.map((option) => (
                <Combobox.Option key={option.id} id={option.id}>
                    {option.textValue}
                </Combobox.Option>
            ))}
        </Combobox.List>
    </Combobox>
);

/**
 * Control selection and input value
 */
export const FullControlled: StoryFn<StoriesArgs> = ({ options, selectedIds, ...args }) => {
    const [input, setInput] = useState<string>('');
    const [selected, setSelected] = useState(selectedIds);

    return (
        <>
            {/* Current input value: {input} */}
            <ul>
                <li>Current input value: {input}</li>
                <li>Current selected values: {selected}</li>
            </ul>
            <Combobox<string>
                selectedIds={selected}
                inputValue={input}
                onInputChange={setInput}
                onSelect={(option) => setSelected([String(option?.id)])}
                {...args}
            >
                <Combobox.Input label={COMBOBOX_LABEL} />
                <Combobox.List>
                    {options.map((option) => (
                        <Combobox.Option key={option.id} id={option.id}>
                            {option.textValue}
                        </Combobox.Option>
                    ))}
                </Combobox.List>
            </Combobox>
        </>
    );
};
FullControlled.args = {
    selectedIds: [defaultOptions[2].id],
};

export const Loading: StoryFn<StoriesArgs> = ({ options, ...args }) => {
    return (
        <Combobox {...args} status="loading">
            <Combobox.Input label={COMBOBOX_LABEL} />
            <Combobox.List>
                {options.map((option) => (
                    <Combobox.Option key={option.id} id={option.id}>
                        {option.textValue}
                    </Combobox.Option>
                ))}
            </Combobox.List>
        </Combobox>
    );
};

/**
 * Loading more state
 */
export const LoadingMore: StoryFn<StoriesArgs> = ({ options, ...args }) => {
    return (
        <Combobox {...args} status="loadingMore">
            <Combobox.Input label={COMBOBOX_LABEL} />
            <Combobox.List>
                {options.map((option) => (
                    <Combobox.Option key={option.id} id={option.id}>
                        {option.textValue}
                    </Combobox.Option>
                ))}
            </Combobox.List>
        </Combobox>
    );
};

/**
 * Error state
 */
export const ErrorState: StoryFn<StoriesArgs> = (args) => {
    return (
        <Combobox {...args} autoFilter showErrorState status="error">
            <Combobox.Input label={COMBOBOX_LABEL} />
            <Combobox.List />
        </Combobox>
    );
};

/**
 * Empty state
 */
export const EmptyState: StoryFn<StoriesArgs> = (args) => {
    return (
        <Combobox {...args} autoFilter showEmptyState>
            <Combobox.Input label={COMBOBOX_LABEL} />
            <Combobox.List />
        </Combobox>
    );
};

/**
 * Empty state with search text
 */
export const EmptyStateWithSearch: StoryFn<StoriesArgs> = (args) => {
    return (
        <Combobox {...args} autoFilter showEmptyState inputValue="Something">
            <Combobox.Input label={COMBOBOX_LABEL} />
            <Combobox.List />
        </Combobox>
    );
};

/**
 * Display custom components inside option content
 */
export const WithCustomOptions: StoryFn<StoriesArgs> = ({ options, ...args }) => {
    return (
        <Combobox {...args}>
            <Combobox.Input label={COMBOBOX_LABEL} />
            <Combobox.List>
                {options.map((option) => (
                    // As we are using a react node as child, we need to specify the text value.
                    <Combobox.Option key={option.id} id={option.id} textValue={option.textValue}>
                        <UserBlock name={option.textValue} />
                    </Combobox.Option>
                ))}
            </Combobox.List>
        </Combobox>
    );
};

/**
 * Disable options
 */
export const WithDisabledOptions: StoryFn<StoriesArgs> = ({ options, ...args }) => {
    return (
        <Combobox {...args}>
            <Combobox.Input label={COMBOBOX_LABEL} />
            <Combobox.List>
                {options.map((option) => (
                    <Combobox.Option key={option.id} id={option.id} isDisabled={option.isDisabled}>
                        {option.textValue}
                    </Combobox.Option>
                ))}
            </Combobox.List>
        </Combobox>
    );
};

export const CustomSkeleton = ({ index }: { index?: number }) => {
    const skeletonSizes = [
        { titleSize: Size.l, descriptionSize: Size.xl },
        { titleSize: Size.xl, descriptionSize: Size.l },
        { titleSize: Size.l, descriptionSize: Size.xl },
    ];
    const skeletonToUse = index ? index % skeletonSizes.length : 0;
    const { titleSize, descriptionSize } = skeletonSizes[skeletonToUse];

    return (
        <ComboboxOptionSkeleton
            size={Size.regular}
            before={<SkeletonCircle size={Size.m} className="lumx-color-background-dark-L5" />}
        >
            <FlexBox orientation={Orientation.vertical} hAlign={Alignment.center}>
                <SkeletonRectangle
                    className="lumx-color-background-dark-L5"
                    width={titleSize || Size.xl}
                    height={Size.xxs}
                    variant={SkeletonRectangleVariant.pill}
                />
                <SkeletonRectangle
                    className="lumx-color-background-dark-L5 lumx-spacing-margin-top"
                    width={descriptionSize || Size.xxl}
                    height={Size.xxs}
                    variant={SkeletonRectangleVariant.pill}
                />
            </FlexBox>
        </ComboboxOptionSkeleton>
    );
};

/**
 * Customize options skeleton
 */
export const WithCustomSkeletons: StoryFn<StoriesArgs> = ({ options, customSkeleton = CustomSkeleton, ...args }) => {
    return (
        <Combobox {...args} status="loading">
            <Combobox.Input label={COMBOBOX_LABEL} />
            <Combobox.List renderItemSkeleton={customSkeleton}>
                {options.map((option) => (
                    <Combobox.Option key={option.id} id={option.id}>
                        {option.textValue}
                    </Combobox.Option>
                ))}
            </Combobox.List>
        </Combobox>
    );
};

const lotsOfOptions = [
    {
        id: '8bd335a2-4bde-4bd6-bfbd-1fe3de7f9da5',
        label: 'Logan Richards',
        hasAction: true,
    },
    {
        id: 'ae5dc2b1-c2c2-4f1f-8043-413317f7cf0f',
        label: 'Sean Brock',
        hasAction: true,
    },
    {
        id: '59506513-b168-4028-ae84-c26b2acc66a9',
        label: 'Gene Hampton',
        hasAction: true,
    },
    {
        id: '84211ca9-1cdd-4950-a2f6-b1792d43bde7',
        label: 'Dominic Benson',
        hasAction: true,
    },
    {
        id: '0fa08867-1275-46e9-9f83-8c5dd71c4f66',
        label: 'Calvin Thomas',
        hasAction: true,
    },
    {
        id: 'caeca64a-3a74-4426-9c44-96c6a1d55088',
        label: 'Myrtie Burns',
        hasAction: true,
    },
    {
        id: '4ffde43a-4857-4811-85ed-bcbf54c49929',
        label: 'Lula Wagner',
        hasAction: true,
    },
    {
        id: 'c8e6c3f8-1a48-489f-9f5d-a3145b73f532',
        label: 'Charles Riley',
        hasAction: true,
    },
    {
        id: 'd5adf298-2b33-42c5-9e36-bf06b03a3397',
        label: 'Gilbert Payne',
        hasAction: true,
    },
    {
        id: '5f0a4808-e972-42aa-baaa-5b3c71de2402',
        label: 'Marcus Rose',
        hasAction: true,
    },
    {
        id: 'feb2e6e5-9663-40e6-aca9-59dec147d1eb',
        label: 'Sophia Francis',
        hasAction: true,
    },
    {
        id: '36cc0520-2926-42a5-800e-69d106f0c325',
        label: 'Connor Hayes',
        hasAction: true,
    },
    {
        id: '7fa5b664-b90e-46a2-9f3e-0de31deae8e3',
        label: 'Beulah Lambert',
        hasAction: true,
    },
    {
        id: '23762e2f-e73e-4a5a-ab25-7d07979469da',
        label: 'Vera Shaw',
        hasAction: true,
    },
    {
        id: '5e718b6b-c437-48a2-8fa5-115b35d07e5d',
        label: 'Trevor Shelton',
        hasAction: true,
    },
    {
        id: '1ea4a357-f2c4-4384-b779-0d62a9751b18',
        label: 'Philip Black',
        hasAction: true,
    },
    {
        id: 'c76513ec-1e6e-4f59-a3a3-5f991e90978e',
        label: 'Celia Dean',
        hasAction: true,
    },
    {
        id: 'a7141641-bb4e-4bda-b524-396dd5f77486',
        label: 'Maude Swanson',
        hasAction: true,
    },
];

/**
 * Combobox option with secondary actions
 */
export const WithCustomActions: StoryFn<StoriesArgs> = ({ ...args }) => {
    const [options, setOptions] = useState(lotsOfOptions);

    const handleDelete = (optionId: string | number) => {
        setOptions((opts) => opts.filter(({ id }) => id !== optionId));
    };

    return (
        <Combobox {...args}>
            <Combobox.Input label={COMBOBOX_LABEL} />
            <Combobox.List label={COMBOBOX_LABEL}>
                {options.map((option) => (
                    <Combobox.Option
                        key={option.id}
                        id={option.id}
                        after={
                            option.hasAction && (
                                <ComboboxOptionAction
                                    as={IconButton}
                                    emphasis={Emphasis.low}
                                    icon={mdiClose}
                                    label={`Remove ${option.label}`}
                                    onClick={() => {
                                        handleDelete(option.id);
                                    }}
                                    size={Size.s}
                                />
                            )
                        }
                    >
                        {option.label}
                    </Combobox.Option>
                ))}
            </Combobox.List>
        </Combobox>
    );
};

/**
 * Combobox with sections
 */
export const WithSections: StoryFn<StoriesArgs> = ({ options, defaultSelectedIndex, ...args }) => {
    const renderOption = ({ id, textValue }: any) => (
        <Combobox.Option key={id} id={id}>
            {textValue}
        </Combobox.Option>
    );

    return (
        <Combobox selectedIds={defaultSelectedIndex ? [options[defaultSelectedIndex].id] : undefined} {...args}>
            <Combobox.Input label={COMBOBOX_LABEL} />
            <Combobox.List>
                <Combobox.Section title="Section 1">{options.slice(0, 3).map(renderOption)}</Combobox.Section>

                {/* Solo option outside a section */}
                {options.slice(3, 4).map(renderOption)}

                {/* Name-less section */}
                <Combobox.Section>{options.slice(4, 6).map(renderOption)}</Combobox.Section>

                <Combobox.Section isLoading> </Combobox.Section>

                {/* Empty section (should be ignored) */}
                <Combobox.Section> </Combobox.Section>

                <Combobox.Section title="Section 2">{options.slice(6, 8).map(renderOption)}</Combobox.Section>
            </Combobox.List>
        </Combobox>
    );
};

/**
 * Section loading state
 */
export const WithLoadingSections: StoryFn<StoriesArgs> = ({ options, customSkeleton, ...args }) => {
    const sections = useMemo(
        () => [
            {
                title: 'Section 1',
                children: options.slice(0, 3),
            },
            {
                title: 'Section 2',
                children: options.slice(3),
            },
        ],
        [options],
    );
    return (
        <Combobox {...args}>
            <Combobox.Input label={COMBOBOX_LABEL} />
            <Combobox.List>
                {sections.map((section) => (
                    <Combobox.Section
                        key={section.title}
                        title={section.title}
                        isLoading
                        renderItemSkeleton={customSkeleton}
                    >
                        {section.children.map((option) => (
                            <Combobox.Option key={option.id} id={option.id}>
                                {option.textValue}
                            </Combobox.Option>
                        ))}
                    </Combobox.Section>
                ))}
            </Combobox.List>
        </Combobox>
    );
};

/**
 * Use a button as the trigger for the combobox
 */
export const ButtonCombobox: StoryFn<StoriesArgs> = (args) => {
    return (
        <Combobox {...args} autoFilter={false}>
            <Combobox.Button label="Select a fruit" rightIcon={mdiMenuDown} />
            <Combobox.List>
                <Combobox.Option id="1">Apple</Combobox.Option>
                <Combobox.Option id="2">Banana</Combobox.Option>
                <Combobox.Option id="3">Boysenberry</Combobox.Option>
                <Combobox.Option id="4">Blueberry</Combobox.Option>
                <Combobox.Option id="6">Cranberry</Combobox.Option>
            </Combobox.List>
        </Combobox>
    );
};

/**
 * Custom translations
 */
export const WithCustomTranslations: StoryFn<StoriesArgs> = ({ options, ...args }) => (
    <Combobox
        {...args}
        translations={{
            clearLabel: 'Custom Clear',
            showSuggestionsLabel: 'Custom Show Suggestions',
            noResultsForInputLabel: (input) => (input ? `Custom No results for ${input}` : 'Custom No results'),
            loadingLabel: 'Custom Loading',
            serviceUnavailableLabel: 'Custom Error',
            tryReloadLabel: 'Custom Reload',
            nbOptionsLabel: (count) => `${count} custom options`,
        }}
    >
        <Combobox.Input label={COMBOBOX_LABEL} />
        <Combobox.List>
            {options.map((option) => (
                <Combobox.Option key={option.id} id={option.id}>
                    {option.textValue}
                </Combobox.Option>
            ))}
        </Combobox.List>
    </Combobox>
);

/**
 * Use a chip button as the trigger for the combobox
 * Keybindings do not work properly due to the bug https://lumapps.atlassian.net/browse/DSW-191
 */
export const ChipCombobox: StoryFn<StoriesArgs> = (args) => {
    return (
        <Combobox {...args} autoFilter={false}>
            <Combobox.Button as={Chip} label="Select an option" />
            <Combobox.List>
                <Combobox.Option id="option1">Option 1</Combobox.Option>
                <Combobox.Option id="option2">Option 2</Combobox.Option>
                <Combobox.Option id="option3">Option 3</Combobox.Option>
            </Combobox.List>
        </Combobox>
    );
};
