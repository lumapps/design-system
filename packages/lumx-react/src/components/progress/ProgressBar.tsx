import React, { forwardRef } from 'react';

import {
    Alignment,
    ColorPalette,
    ColorVariant,
    FlexBox,
    GenericProps,
    Orientation,
    Size,
    Text,
    Theme,
    Typography,
} from '@lumx/react';

import classNames from 'classnames';

import './index.scss';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { Comp, HasTheme } from '@lumx/react/utils/type';
import { reduce } from 'lodash';

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
    colorDone: { colorPalette: 'blue', colorVariant: 'D2' } as {
        colorPalette: ColorPalette;
        colorVariant: ColorVariant;
    },
    backgroundColor: { colorPalette: 'blue', colorVariant: 'L5' } as {
        colorPalette: ColorPalette;
        colorVariant: ColorVariant;
    },
    percents: 50,
    maxWidth: '200px',
    label: false,
    theme: Theme.light,
    size: Size.m,
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
        theme,
        size,
        maxWidth,
        percents,
        colorDone,
        backgroundColor,
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
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme, size }))}
            style={{ maxWidth }}
        >
            {label ? completionLabel() : null}
            <FlexBox as="p" orientation={Orientation.horizontal} hAlign={Alignment.center} vAlign={Alignment.center}>
                <FlexBox
                    as="span"
                    className={coverImage ? 'progress-bar-cover' : 'progress-bar'}
                    style={{
                        width: maxWidth,
                        backgroundColor: 'red',
                    }}
                >
                    <FlexBox
                        key="done"
                        /* As this will be inside the final paragraph, set as span */
                        as="span"
                        className={coverImage ? 'progress-bar-cover__percentage-done' : 'progess-bar__percentage-done'}
                        style={{
                            width: `${percents}%`,
                            backgroundColor: 'red',
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
