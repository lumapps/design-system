import { EllipsisType, Text } from '@lumx/react';
import { number, select, text } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'LumX components/text' };

/**
 * TextField story
 * @return simple Text.
 */
export const simpleText = () => (
    <Text text={text('Text', 'red anyone listen drawn cutting transportation exercise exciting gate worse promised')} />
);

export const truncatedText = () => (
    <Text
        text={text('Text', 'red anyone listen drawn cutting transportation exercise exciting gate worse promised')}
        maxChars={number('MaxChars', 20)}
        ellipsisType={select('Ellispsis', EllipsisType, EllipsisType.END)}
    />
);
