import React, { Fragment } from 'react';
import { mdiSend } from '@lumx/icons';
import { Button, ColorPalette, IconButton, Text } from '@lumx/react';
import { squareImageKnob } from '@lumx/react/stories/knobs/image';
import { buttonSize } from '@lumx/react/stories/knobs/buttonKnob';
import { emphasis } from '@lumx/react/stories/knobs/emphasisKnob';
import { boolean, select, text } from '@storybook/addon-knobs';

export default { title: 'LumX components/button/Button' };

const DEFAULT_PROPS = Button.defaultProps as any;

export const SimpleButton = ({ theme }: any) => {
    return (
        <Button
            aria-pressed={boolean('isSelected', Boolean(DEFAULT_PROPS.isSelected))}
            emphasis={emphasis('Emphasis', DEFAULT_PROPS.emphasis)}
            theme={theme}
            rightIcon={select('Right icon', { none: undefined, mdiSend }, undefined)}
            leftIcon={select('Left icon', { none: undefined, mdiSend }, undefined)}
            size={buttonSize()}
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

export const SimpleButtonWithTruncatedText = ({ theme }: any) => {
    const buttonText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Potenti nullam ac tortor vitae. Lorem ipsum dolor sit amet. Diam sollicitudin tempor id eu nisl nunc mi ipsum. Elementum facilisis leo vel fringilla est ullamcorper eget nulla. Mollis aliquam ut porttitor leo a diam sollicitudin tempor. Ultrices tincidunt arcu non sodales neque sodales.';
    return (
        <Button
            aria-pressed={boolean('isSelected', Boolean(DEFAULT_PROPS.isSelected))}
            emphasis={emphasis('Emphasis', DEFAULT_PROPS.emphasis)}
            theme={theme}
            rightIcon={select('Right icon', { none: undefined, mdiSend }, undefined)}
            leftIcon={select('Left icon', { none: undefined, mdiSend }, undefined)}
            size={buttonSize()}
            isSelected={boolean('isSelected', Boolean(DEFAULT_PROPS.isSelected))}
            isDisabled={boolean('isDisabled', Boolean(DEFAULT_PROPS.isDisabled))}
            color={select('color', ColorPalette, DEFAULT_PROPS.color)}
            href={text('Button link', '')}
            hasBackground={boolean('hasBackground', Boolean(DEFAULT_PROPS.hasBackground))}
            fullWidth
            title={buttonText}
        >
            <Text as="span" truncate>
                {text('Button content', buttonText)}
            </Text>
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

export const IconButtonWithImage = ({ theme }: any) => (
    <div>
        <IconButton
            theme={theme}
            label="Image label"
            image={squareImageKnob()}
            size={buttonSize()}
            hasBackground={boolean('Has background', false)}
            emphasis={emphasis('Emphasis', DEFAULT_PROPS.emphasis)}
            color={select('color', ColorPalette, DEFAULT_PROPS.color)}
        />
    </div>
);

export const FullWidthButton = () => <Button fullWidth>Full width button</Button>;

/**
 * Template story to generate all variants for button and icon button.
 */
const AllVariantTemplate = (Component: any, props: any) => () => {
    // Major variants.
    const variants = {
        'Default (emphasis high)': {},
        'Full width': { fullWidth: true },
        'Emphasis medium': { emphasis: 'medium' },
        'Emphasis low': { emphasis: 'low' },
        'Has background (emphasis low)': { emphasis: 'low', hasBackground: true },
        'Has background + Full width': { emphasis: 'low', hasBackground: true, fullWidth: true },
    } as const;

    // Color modifiers.
    const colorModifiers = {
        Default: {},
        'Color: light': { color: 'light' },
        'Color: dark': { color: 'dark' },
        'Color: red': { color: 'red' },
        'Theme: dark': { theme: 'dark' },
    } as const;

    // State modifiers.
    const stateModifiers = {
        'Default state': {},
        Selected: { isSelected: true },
        Hovered: { isHovered: true },
        Focused: { isFocused: true },
        Active: { isActive: true },
        Disabled: { isDisabled: true },
    };

    return (
        <div style={{ background: 'lightgray' }}>
            {Object.entries(stateModifiers).map(([stateKey, state]) => (
                <Fragment key={stateKey}>
                    <h2>{stateKey}</h2>
                    <table style={{ width: '100%' }}>
                        <tr>
                            <td style={{ whiteSpace: 'nowrap', width: 200 }} />
                            {Object.keys(colorModifiers).map((colorKey) => (
                                <td key={colorKey}>{colorKey}</td>
                            ))}
                        </tr>

                        {Object.entries(variants).map(([variantKey, variant]: any) => (
                            <tr key={variantKey}>
                                <td>{variantKey}</td>
                                {Object.entries(colorModifiers).map(([colorKey, color]) => (
                                    <td key={colorKey}>
                                        <Component {...props} {...variant} {...color} {...state} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </table>
                </Fragment>
            ))}
        </div>
    );
};

/**
 * Check button style variations (color, states, emphasis, etc.)
 */
export const ButtonVariations = AllVariantTemplate(Button, { children: 'Button' });

/**
 * Check icon button style variations (color, states, emphasis, etc.)
 */
export const IconButtonVariations = AllVariantTemplate(IconButton, { label: 'Send', icon: mdiSend });
