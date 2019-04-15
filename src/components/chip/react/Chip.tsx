import React, { SyntheticEvent } from 'react';

import classNames from 'classnames';

import isFunction from 'lodash/isFunction';
import noop from 'lodash/noop';

import { Theme, Themes } from 'LumX/components';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/**
 * Authorized size values.
 */
enum Sizes {
    s = 's',
    m = 'm',
}
type Size = Sizes;

/**
 * Defines the props of the component.
 */
interface IChipProps extends IGenericProps {
    /** A component to be rendered after the main label area. */
    AfterComponent?: HTMLElement | React.ReactNode;
    /** A component to be rendered before the main label area. */
    BeforeComponent?: HTMLElement | React.ReactNode;
    /** A component to be rendered within the label area. Displays the placeholder or selected value(s). */
    LabelComponent: HTMLElement | React.ReactNode;
    /** Indicates if the chip is currently in an active state or not. */
    isActive?: boolean;
    /** Indicates if the chip is currently disabled or not. */
    isDisabled?: boolean;
    /** A function to be executed when the after element is clicked. */
    onAfterClick?: void | null;
    /** A function to be executed when the before element is clicked. */
    onBeforeClick?: void | null;
    /** The size of the chip. */
    size?: Size;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
}
type ChipProps = IChipProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<ChipProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}Chip`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 *
 * @type {IDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    AfterComponent: null,
    BeforeComponent: null,
    isActive: false,
    isDisabled: false,
    onAfterClick: null,
    onBeforeClick: null,
    size: Sizes.m,
    theme: Themes.light,
};
/////////////////////////////

/**
 * Displays information or allow an action on a compact element.
 * This is the base component for all variations of the chips see https://material.io/design/components/chips.html.
 *
 * @return {Component} The Chip component.
 */
const Chip: React.FC<IChipProps> = ({
    AfterComponent = DEFAULT_PROPS.AfterComponent,
    BeforeComponent = DEFAULT_PROPS.BeforeComponent,
    className = '',
    LabelComponent,
    isActive = DEFAULT_PROPS.isActive,
    isDisabled = DEFAULT_PROPS.isDisabled,
    onAfterClick = DEFAULT_PROPS.onAfterClick,
    onBeforeClick = DEFAULT_PROPS.onBeforeClick,
    onClick = null,
    size = DEFAULT_PROPS.size,
    theme = DEFAULT_PROPS.theme,
}: ChipProps): React.ReactElement => {
    const hasAfterClick: boolean = isFunction(onAfterClick);
    const hasBeforeClick: boolean = isFunction(onBeforeClick);
    const hasOnClick: boolean = isFunction(onClick);

    /**
     * Execute the onBeforeClick method passed as a prop but stop propagation to avoid triggering the onClick method.
     *
     * @param {SyntheticEvent} evt The click event on the before element that triggers this method.
     */
    const handleOnBeforeClick: (evt: SyntheticEvent) => void = (evt: SyntheticEvent): void => {
        if (!evt) {
            return;
        }

        if (isFunction(onBeforeClick)) {
            onBeforeClick(evt);
        }

        evt.stopPropagation();
    };

    /**
     * Execute the onAfterClick method passed as a prop but stop propagation to avoid triggering the onClick method.
     *
     * @param {SyntheticEvent} evt The click event on the after element that triggers this method.
     */
    const handleOnAfterClick: (evt: SyntheticEvent) => void = (evt: SyntheticEvent): void => {
        if (!evt) {
            return;
        }

        if (isFunction(onAfterClick)) {
            onAfterClick(evt);
        }

        evt.stopPropagation();
    };

    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({
                    active: Boolean(isActive),
                    clickable: Boolean(hasOnClick),
                    disabled: Boolean(isDisabled),
                    hasAfter: Boolean(hasAfterClick),
                    hasBefore: Boolean(hasBeforeClick),
                    prefix: CLASSNAME,
                    size,
                    theme,
                    unselected: Boolean(!isActive),
                }),
            )}
            role="button"
            tabIndex={isDisabled || !hasOnClick ? -1 : 0}
            onClick={onClick || noop}
            onKeyPress={onClick}
        >
            {BeforeComponent && (
                <button
                    className={classNames(`${CLASSNAME}__before`, {
                        [`${CLASSNAME}__before--is-clickable`]: hasBeforeClick,
                    })}
                    type="button"
                    onClick={handleOnBeforeClick}
                >
                    {BeforeComponent}
                </button>
            )}

            <div className={`${CLASSNAME}__label`}>{LabelComponent}</div>

            {AfterComponent && (
                <button
                    className={classNames(`${CLASSNAME}__after`, {
                        [`${CLASSNAME}__after--is-clickable`]: hasAfterClick,
                    })}
                    type="button"
                    onClick={handleOnAfterClick}
                >
                    {AfterComponent}
                </button>
            )}
        </div>
    );
};

Chip.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Chip, ChipProps, Size, Sizes, Theme, Themes };
