/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useState } from 'react';

import { setup } from '@lumx/core/js/components/SelectButton/TestStories';
import { FRUITS, Fruit } from '@lumx/core/js/components/SelectButton/Stories';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';

import { SelectButton } from '.';

function renderWithState(template: (props: any) => React.JSX.Element) {
    const Wrapper = () => {
        const [value, setValue] = useState<any>(undefined);
        return template({ value, onChange: setValue });
    };
    return <Wrapper />;
}

const { meta, ...testStories } = setup({
    components: { SelectButton },
    decorators: { withValueOnChange },
    renderWithState,
});

export default { ...meta, title: 'LumX components/select-button/SelectButton/Tests' };

export const ClickOutsideCloses = { ...testStories.ClickOutsideCloses };
export const SelectionUpdates = { ...testStories.SelectionUpdates };

// Typeahead: options are unmounted while closed, so moving the active descendant onto
// the first match requires a real browser to reproduce the commit timing.
export const TypeaheadWhileOpen = { ...testStories.TypeaheadWhileOpen };
export const TypeaheadFromClosed = { ...testStories.TypeaheadFromClosed };

// React-specific test stories (use React hooks for stateful rendering)

/** Test infinite scroll loads more options when scrolling to the bottom */
export const WithInfiniteScroll = {
    ...testStories.WithInfiniteScroll,
    render: () => {
        // Start with 10 pages of items so the popover overflows and the
        // IntersectionObserver sentinel doesn't fire until the user scrolls.
        const initialItems = Array.from({ length: 10 }).flatMap((_, page) =>
            FRUITS.map((f, i) => ({ ...f, id: `${f.id}-${page * FRUITS.length + i}` })),
        );
        const [items, setItems] = useState(initialItems);
        const [value, setValue] = useState<Fruit | undefined>();
        const [loadMoreCount, setLoadMoreCount] = useState(0);

        const onLoadMore = useCallback(() => {
            setLoadMoreCount((c) => c + 1);
            setItems((prev) => {
                if (prev.length >= 200) return prev;
                const offset = prev.length;
                return prev.concat(FRUITS.map((f, i) => ({ ...f, id: `${f.id}-${offset + i}` })));
            });
        }, []);

        return (
            <>
                <SelectButton
                    label="Select a fruit"
                    options={items}
                    getOptionId="id"
                    getOptionName="name"
                    value={value}
                    onChange={setValue}
                    onLoadMore={onLoadMore}
                />
                <div data-testid="load-more-count">{loadMoreCount}</div>
            </>
        );
    },
};
