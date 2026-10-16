/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useCallback, useMemo, useRef } from 'react';
import { setup, createManyOptions } from '@lumx/core/js/components/SelectTextField/TestStories';
import { FRUITS, type Fruit } from '@lumx/core/js/components/SelectTextField/Stories';
import { TRANSLATIONS } from '@lumx/core/js/components/SelectTextField/Tests';
import { classNames } from '@lumx/core/js/utils';
import { SelectTextField } from '.';
import { Combobox } from '../combobox';
import { Button } from '../button';
import { FlexBox } from '../flex-box';
import { PopoverDialog } from '../popover-dialog';

const { meta, ...testStories } = setup({
    components: { SelectTextField, Combobox },
});

export default { ...meta, title: 'LumX components/select-text-field/SelectTextField/Tests' };

export const ClickOutsideCloses = { ...testStories.ClickOutsideCloses };
export const BlurResetsToSelectedValue = { ...testStories.BlurResetsToSelectedValue };
export const BlurResetsToEmpty = { ...testStories.BlurResetsToEmpty };
export const MultiBlurResetsSearch = { ...testStories.MultiBlurResetsSearch };

// React-specific test stories (use React hooks for stateful rendering)

/** Test infinite scroll loads more options (grouped in sections) when scrolling to the bottom */
export const WithInfiniteScroll = {
    ...testStories.WithInfiniteScroll,
    render: () => {
        // Start with 3 pages of items so the popover overflows and the
        // IntersectionObserver sentinel doesn't fire until the user scrolls.
        const initialItems = Array.from({ length: 3 }).flatMap((_, page) =>
            FRUITS.map((f, i) => ({ ...f, id: `${f.id}-${page * FRUITS.length + i}` })),
        );
        const [items, setItems] = useState(initialItems);
        const [value, setValue] = useState<Fruit | undefined>();

        const onLoadMore = useCallback(() => {
            setItems((prev) => {
                if (prev.length >= 200) return prev;
                const offset = prev.length;
                return prev.concat(FRUITS.map((f, i) => ({ ...f, id: `${f.id}-${offset + i}` })));
            });
        }, []);

        return (
            <SelectTextField
                selectionType="single"
                label="Select a fruit"
                placeholder="Search fruits..."
                options={items}
                filter="auto"
                getOptionId="id"
                getOptionName="name"
                getSectionId="category"
                value={value}
                onChange={setValue}
                onLoadMore={onLoadMore}
                translations={TRANSLATIONS}
            />
        );
    },
};

/** Test that a large option list (count set via the `optionsCount` arg) renders and can be scrolled through */
export const WithManyOptions = {
    ...testStories.WithManyOptions,
    render: (args: { optionsCount: number }) => {
        const items = useMemo(() => createManyOptions(args.optionsCount), [args.optionsCount]);
        const [value, setValue] = useState<(typeof items)[number] | undefined>();

        return (
            <SelectTextField
                selectionType="single"
                label="Select a fruit"
                placeholder="Search fruits..."
                options={items}
                filter="auto"
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={setValue}
                translations={TRANSLATIONS}
            />
        );
    },
};

/** Test the inline list (`popoverProps={false}`) in a popover dialog that closes on selection, with infinite scroll */
export const InlineInPopoverDialog = {
    ...testStories.InlineInPopoverDialog,
    render: () => {
        const anchorRef = useRef<HTMLButtonElement>(null);
        // Focus the input when the dialog opens.
        const inputRef = useRef<HTMLInputElement>(null);
        const [isOpen, setIsOpen] = useState(false);
        // Start with 3 pages of items so the list overflows the dialog.
        const initialItems = Array.from({ length: 3 }).flatMap((_, page) =>
            FRUITS.map((f, i) => ({ ...f, id: `${f.id}-${page * FRUITS.length + i}` })),
        );
        const [items, setItems] = useState(initialItems);
        const [value, setValue] = useState<Fruit | undefined>();

        const onLoadMore = useCallback(() => {
            setItems((prev) => {
                if (prev.length >= 200) return prev;
                const offset = prev.length;
                return prev.concat(FRUITS.map((f, i) => ({ ...f, id: `${f.id}-${offset + i}` })));
            });
        }, []);

        // Close the dialog on selection (focus goes back to the button).
        const onChange = (newValue?: Fruit) => {
            setValue(newValue);
            if (newValue) setIsOpen(false);
        };

        return (
            <>
                <Button
                    ref={anchorRef}
                    aria-haspopup="dialog"
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span id="pick-fruit-label">Pick a fruit</span>
                    {value && `: ${value.name}`}
                </Button>
                <PopoverDialog
                    anchorRef={anchorRef}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    label="Pick a fruit"
                    placement="bottom-start"
                    maxHeight="300px"
                    focusElement={inputRef}
                >
                    <FlexBox orientation="vertical">
                        <SelectTextField
                            selectionType="single"
                            // No visible label: the input and the listbox are labelled by the button label.
                            label=""
                            inputProps={{ 'aria-labelledby': 'pick-fruit-label' }}
                            inputRef={inputRef}
                            hasClearButton={false}
                            className={classNames.margins([
                                { direction: 'vertical', size: 'regular' },
                                { direction: 'horizontal', size: 'big' },
                            ])}
                            placeholder="Search fruits..."
                            options={items}
                            filter="auto"
                            getOptionId="id"
                            getOptionName="name"
                            value={value}
                            onChange={onChange}
                            onLoadMore={onLoadMore}
                            translations={TRANSLATIONS}
                            popoverProps={false}
                        />
                    </FlexBox>
                </PopoverDialog>
            </>
        );
    },
};
