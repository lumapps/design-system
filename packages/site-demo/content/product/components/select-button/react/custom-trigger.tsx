import { useState } from 'react';
import { Chip, Icon, IconButton, Link, SelectButton } from '@lumx/react';
import { mdiFoodApple, mdiMenuDown } from '@lumx/icons';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Grape', 'Orange'];

export default () => {
    const [defaultValue, setDefaultValue] = useState<string>();
    const [iconValue, setIconValue] = useState<string>();
    const [chipValue, setChipValue] = useState<string>();
    const [linkValue, setLinkValue] = useState<string>();

    return (
        <>
            <SelectButton
                label="Select a fruit"
                options={FRUITS}
                getOptionId={String}
                value={defaultValue}
                onChange={setDefaultValue}
                size="s"
                emphasis="low"
                color="red"
            />

            <SelectButton
                as={IconButton}
                label="Select a fruit"
                labelDisplayMode="show-tooltip"
                options={FRUITS}
                getOptionId={String}
                value={iconValue}
                onChange={setIconValue}
                emphasis="medium"
                icon={mdiFoodApple}
                isSelected={!!iconValue}
            />

            <SelectButton
                as={Chip}
                label="Select a fruit"
                options={FRUITS}
                getOptionId={String}
                value={chipValue}
                onChange={setChipValue}
                isClickable
                isSelected={!!chipValue}
                after={<Icon icon={mdiMenuDown} />}
                renderOption={(fruit) => (
                    <SelectButton.Option value={fruit}>
                        <strong>{fruit}</strong>
                    </SelectButton.Option>
                )}
            />

            <SelectButton
                as={Link}
                label="Select a fruit"
                options={FRUITS}
                getOptionId={String}
                value={linkValue}
                onChange={setLinkValue}
                rightIcon={mdiMenuDown}
            />
        </>
    );
};
