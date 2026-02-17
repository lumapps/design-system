import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import { RadioButton, RadioGroup } from '@lumx/react';
import { useState } from 'react';

export default { title: 'LumX components/radio-button/Radio Group' };

export const Simple = () => {
    const [value, onChange] = useState('lorem');

    return (
        <RadioGroup>
            <RadioButton
                isChecked={value === 'lorem'}
                helper={loremIpsum('tiny')}
                label="Radio button with help 1"
                name="test2"
                value="lorem"
                onChange={onChange as any}
            />

            <RadioButton
                isDisabled
                helper={loremIpsum('tiny')}
                label="Radio button with help 2"
                name="test2"
                value="ipsum"
                onChange={onChange as any}
            />

            <RadioButton
                isChecked={value === 'dolor'}
                helper={loremIpsum('tiny')}
                label="Radio button with help 3"
                name="test2"
                value="dolor"
                onChange={onChange as any}
            />
        </RadioGroup>
    );
};
