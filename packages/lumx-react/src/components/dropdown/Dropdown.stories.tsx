import range from 'lodash/range';
import { useRef, useState } from 'react';

import { Button, Dropdown, List, ListItem } from '@lumx/react';

export default { title: 'LumX components/dropdown/Dropdown' };

export const InfiniteScroll = () => {
    const buttonRef = useRef(null);
    const [items, setItems] = useState(range(10));
    const onInfiniteScroll = () => {
        setItems([...items, ...range(items.length, items.length + 10)]);
    };

    return (
        <>
            <Button ref={buttonRef}>Anchor</Button>
            <Dropdown anchorRef={buttonRef} isOpen onInfiniteScroll={onInfiniteScroll}>
                <List>
                    {items.map((item) => (
                        <ListItem key={item}>{item}</ListItem>
                    ))}
                </List>
            </Dropdown>
        </>
    );
};
InfiniteScroll.parameters = {
    // Disables Chromatic snapshot (not relevant for this story).
    chromatic: { disable: true },
};
InfiniteScroll.tags = ['!snapshot'];
