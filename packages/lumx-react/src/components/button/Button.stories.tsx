import { mdiSend, mdiClose } from '@lumx/icons';

import { Button, ColorPalette, Emphasis, IconButton, Size } from '@lumx/react';
import { boolean, select, text } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'LumX components/button/Button' };

const DEFAULT_PROPS = Button.defaultProps as any;

export const SimpleButton = ({ theme }: any) => {
    return (
        <Button
            emphasis={select('Emphasis', Emphasis, DEFAULT_PROPS.emphasis)}
            theme={theme}
            rightIcon={select('Right icon', { none: undefined, mdiSend }, undefined)}
            leftIcon={select('Left icon', { none: undefined, mdiSend }, undefined)}
            size={select('Size', [Size.m, Size.s], DEFAULT_PROPS.size)}
            isSelected={boolean('isSelected', Boolean(DEFAULT_PROPS.isSelected))}
            isDisabled={boolean('isDisabled', Boolean(DEFAULT_PROPS.isDisabled))}
            color={select('color', ColorPalette, DEFAULT_PROPS.color)}
            href={text('Button link', '')}
            hasBackground={boolean('hasBackground', Boolean(DEFAULT_PROPS.hasBackground))}
        >
            {text('Button content', 'Simple button')}
        </Button>
    );
};

export const WithHref = () => <Button href="https://google.com">Button with redirection</Button>;

export const Disabled = () => <Button isDisabled>Disabled button</Button>;

export const DisabledWithHref = () => (
    <Button href="https://google.com" isDisabled>
        Disabled button with redirection
    </Button>
);

export const IconButtonLowEmphasis = () => <IconButton emphasis={Emphasis.low} icon={mdiClose} label="Close" />;

export const IconButtonLowEmphasisHasBackground = () => (
    <IconButton emphasis={Emphasis.low} hasBackground icon={mdiClose} label="Close" />
);
