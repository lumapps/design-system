import { setup } from '@lumx/core/js/components/SelectButton/TestStories';
import { SelectButton } from '.';
import { Combobox } from '../combobox';

const { meta, ...testStories } = setup({
    components: { SelectButton },
});

export default { ...meta, title: 'LumX components/select-button/SelectButton/Tests' };

export const ClickOutsideCloses = { ...testStories.ClickOutsideCloses };

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
            <SelectButton
                label="Select a fruit"
                options={items}
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={setValue}
                onLoadMore={onLoadMore}
            />
        );
    },
};
