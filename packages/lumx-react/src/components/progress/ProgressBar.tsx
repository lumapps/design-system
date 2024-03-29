import React, { forwardRef } from 'react';

import {
    Alignment,
    ColorPalette,
    ColorVariant,
    FlexBox,
    GenericProps,
    Orientation,
    Text,
    Typography,
} from '@lumx/react';

import classNames from 'classnames';

import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { Comp, HasTheme } from '@lumx/react/utils/type';

export interface ProgressBarProps extends GenericProps, HasTheme {
    /* Width of progress bar. Default: 200px */
    maxWidth?: string;
    /* Number of percent of Done of progress bar */
    percents: number;
    /* Color of Done from DS */
    colorDone?: { colorPalette: ColorPalette; colorVariant: ColorVariant };
    /* Color of Background from DS */
    backgroundColor?: { colorPalette: ColorPalette; colorVariant: ColorVariant };
    /* Props for have or no label */
    label?: boolean;
    /* If we have label we give value of label */
    labelValue?: string;
    /* If the progressBar is covering an image (different border-radius) */
    coverImage?: boolean;
}
/**
 * Component display name.
 */
const COMPONENT_NAME = 'ProgressBar';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS = {
    percents: 50,
    maxWidth: '200px',
    label: false,
    coverImage: true,
};

/**
 * ProgressBar component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ProgressBar: Comp<ProgressBarProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        className,
        maxWidth,
        percents,
        // colorDone,
        // backgroundColor,
        label,
        labelValue,
        coverImage,
        ...forwardedProps
    } = props;
    const completionLabel = () => {
        return (
            <FlexBox className="label">
                <Text as="p" typography={Typography.overline}>
                    {labelValue}
                </Text>
                <Text as="p" typography={Typography.overline}>
                    {percents}%
                </Text>
            </FlexBox>
        );
    };

    // we use visually-hidden classes for accessibility
    return (
        <FlexBox
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))}
            style={{ maxWidth }}
        >
            {label ? completionLabel() : null}
            <FlexBox as="p" orientation={Orientation.horizontal} hAlign={Alignment.center} vAlign={Alignment.center}>
                <FlexBox
                    as="span"
                    className={coverImage ? 'lumx-progress-bar-cover' : 'lumx-progress-bar'}
                    style={{
                        width: maxWidth,
                    }}
                >
                    <FlexBox
                        key="done"
                        /* As this will be inside the final paragraph, set as span */
                        as="span"
                        className={
                            coverImage
                                ? 'lumx-progress-bar-cover__percentage-done'
                                : 'lumx-progress-bar__percentage-done'
                        }
                        style={{
                            width: `${percents}%`,
                        }}
                    />
                </FlexBox>
            </FlexBox>
        </FlexBox>
    );
});
ProgressBar.displayName = COMPONENT_NAME;
ProgressBar.className = CLASSNAME;
ProgressBar.defaultProps = DEFAULT_PROPS;
