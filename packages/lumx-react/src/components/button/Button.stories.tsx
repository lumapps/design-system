import { mdiSend } from '@lumx/icons';

import { Button, ColorPalette, Emphasis, Size } from '@lumx/react';
import { DEFAULT_PROPS } from '@lumx/react/components/button/Button';
import { boolean, select, text } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'LumX components/Button' };

export const simpleButton = ({ theme }: any) => {
    return (
        <Button
            emphasis={select('Emphasis', Emphasis, DEFAULT_PROPS.emphasis)}
            theme={theme}
            rightIcon={select('Right icon', { none: undefined, mdiSend }, undefined)}
            leftIcon={select('Left icon', { none: undefined, mdiSend }, undefined)}
            size={select('Size', [Size.m, Size.s], DEFAULT_PROPS.size)}
            isSelected={boolean('isSelected', Boolean(DEFAULT_PROPS.isSelected))}
            color={select('color', ColorPalette, DEFAULT_PROPS.color)}
            hasBackground={boolean('hasBackground', Boolean(DEFAULT_PROPS.hasBackground))}
            isLoading={boolean('isLoading', false)}
        >
            {text('Button content', 'Simple button')}
        </Button>
    );
};

export const isLoading = ({ theme }: any) => {
    const commonProps = {
        ...DEFAULT_PROPS,
        theme,
        isLoading: true,
    };

    return (
        <>
            <Button {...commonProps} emphasis={Emphasis.high}>
                {text('High Button content', 'High emphasis')}
            </Button>
            <br />
            <Button {...commonProps} emphasis={Emphasis.low}>
                {text('Low Button content', 'Low emphasis')}
            </Button>
            <br />
            <Button {...commonProps} emphasis={Emphasis.medium}>
                {text('Medium Button content', 'Medium emphasis')}
            </Button>
        </>
    );
};
