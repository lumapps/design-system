import React, { useRef, useState } from 'react';

import { mdiFilterVariant, mdiMagnify, mdiMenuDown, mdiSort } from '@lumx/icons';
import { Button, Chip, Emphasis, FlexBox, Icon, Orientation, Placement, Popover, Size, TextField } from '@lumx/react';

const TYPES = ['Fruit', 'Vegetable', 'Meat', 'Cereal', 'Fish'];
const COLORS = ['Red', 'Green', 'Blue'];
const SHAPES = ['Oval', 'Rectangle', 'Triangle'];

const App = () => {
    const [query, setQuery] = useState('');
    const [isOpen, setOpen] = useState(false);
    const closePopover = () => setOpen(false);
    const togglePopover = () => setOpen(!isOpen);
    const anchorRef = useRef(null);

    return (
        <>
            <FlexBox orientation={Orientation.horizontal} gap={Size.big} wrap>
                <FlexBox orientation={Orientation.horizontal} gap={Size.big} wrap fillSpace>
                    <TextField value={query} onChange={setQuery} icon={mdiMagnify} placeholder="Search" />

                    <Chip
                        before={<Icon icon={mdiFilterVariant} size={Size.xs} />}
                        after={<Icon icon={mdiMenuDown} size={Size.xs} />}
                        chipRef={anchorRef}
                        onClick={togglePopover}
                    >
                        Filters
                    </Chip>
                </FlexBox>

                <Button emphasis={Emphasis.low} leftIcon={mdiSort} rightIcon={mdiMenuDown}>
                    Most relevant
                </Button>
            </FlexBox>

            <Popover
                anchorRef={anchorRef}
                placement={Placement.BOTTOM_START}
                isOpen={isOpen}
                onClose={closePopover}
                closeOnClickAway
                closeOnEscape
            >
                <div className="lumx-spacing-padding-huge lumx-has-divider">
                    <span className="lumx-display-block lumx-typography-subtitle1">Type</span>

                    <FlexBox
                        className="lumx-spacing-margin-top-big"
                        orientation={Orientation.horizontal}
                        gap={Size.regular}
                        wrap
                        style={{ maxWidth: 250 }}
                    >
                        {TYPES.map((type, index) => (
                            <Chip key={index} isClickable>
                                {type}
                            </Chip>
                        ))}
                    </FlexBox>
                </div>

                <div className="lumx-spacing-padding-huge lumx-has-divider">
                    <span className="lumx-display-block lumx-typography-subtitle1">Color</span>

                    <FlexBox
                        className="lumx-spacing-margin-top-big"
                        orientation={Orientation.horizontal}
                        gap={Size.regular}
                        wrap
                    >
                        {COLORS.map((color, index) => (
                            <Chip key={index} isClickable>
                                {color}
                            </Chip>
                        ))}
                    </FlexBox>
                </div>

                <div className="lumx-spacing-padding-huge lumx-has-divider">
                    <span className="lumx-display-block lumx-typography-subtitle1">Shape</span>

                    <FlexBox
                        className="lumx-spacing-margin-top-big"
                        orientation={Orientation.horizontal}
                        gap={Size.regular}
                        wrap
                    >
                        {SHAPES.map((shape, index) => (
                            <Chip key={index} isClickable>
                                {shape}
                            </Chip>
                        ))}
                    </FlexBox>
                </div>
            </Popover>
        </>
    );
};

export default App;
