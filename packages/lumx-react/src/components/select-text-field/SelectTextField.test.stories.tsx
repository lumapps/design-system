/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useCallback } from 'react';
import { setup } from '@lumx/core/js/components/SelectTextField/TestStories';
import { FRUITS, type Fruit } from '@lumx/core/js/components/SelectTextField/Stories';
import { TRANSLATIONS } from '@lumx/core/js/components/SelectTextField/Tests';
import { SelectTextField } from '.';
import { Combobox } from '../combobox';

const { meta, ...testStories } = setup({
    components: { SelectTextField, Combobox },
});

export default { ...meta, title: 'LumX components/select-text-field/SelectTextField/Tests' };

export const ClickOutsideCloses = { ...testStories.ClickOutsideCloses };
export const BlurResetsToSelectedValue = { ...testStories.BlurResetsToSelectedValue };
export const BlurResetsToEmpty = { ...testStories.BlurResetsToEmpty };
export const MultiBlurResetsSearch = { ...testStories.MultiBlurResetsSearch };

// React-specific test stories (use React hooks for stateful rendering)

/** Test infinite scroll loads more options when scrolling to the bottom */
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
                value={value}
                onChange={setValue}
                onLoadMore={onLoadMore}
                translations={TRANSLATIONS}
            />
        );
    },
};
