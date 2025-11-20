import { mdiFilterVariant, mdiMagnify, mdiMenuDown, mdiSort } from '@lumx/icons';
import {
    Button,
    Chip,
    ChipGroup,
    Divider,
    Emphasis,
    FlexBox,
    Icon,
    Orientation,
    Placement,
    Popover,
    Size,
    TextField,
} from '@lumx/react';
import { useRef, useState } from 'react';

const TYPES = ['Fruit', 'Vegetable', 'Meat', 'Cereal', 'Fish'];
const COLORS = ['Red', 'Green', 'Blue'];
const SHAPES = ['Oval', 'Rectangle', 'Triangle'];

export const App = () => {
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
                        ref={anchorRef}
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
                <div className="lumx-spacing-padding-huge">
                    <span className="lumx-display-block lumx-typography-subtitle1">Type</span>

                    <ChipGroup className="lumx-spacing-margin-top-big" style={{ maxWidth: 250 }}>
                        {TYPES.map((type, index) => (
                            <Chip key={index} isClickable>
                                {type}
                            </Chip>
                        ))}
                    </ChipGroup>
                </div>

                <Divider />

                <div className="lumx-spacing-padding-huge">
                    <span className="lumx-display-block lumx-typography-subtitle1">Color</span>

                    <ChipGroup className="lumx-spacing-margin-top-big" style={{ maxWidth: 250 }}>
                        {COLORS.map((color, index) => (
                            <Chip key={index} isClickable>
                                {color}
                            </Chip>
                        ))}
                    </ChipGroup>
                </div>

                <Divider />

                <div className="lumx-spacing-padding-huge">
                    <span className="lumx-display-block lumx-typography-subtitle1">Shape</span>

                    <ChipGroup className="lumx-spacing-margin-top-big" style={{ maxWidth: 250 }}>
                        {SHAPES.map((shape, index) => (
                            <Chip key={index} isClickable>
                                {shape}
                            </Chip>
                        ))}
                    </ChipGroup>
                </div>
            </Popover>
        </>
    );
};
