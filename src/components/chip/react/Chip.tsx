import React, { SyntheticEvent } from 'react';

import classNames from 'classnames';

import isFunction from 'lodash/isFunction';
import noop from 'lodash/noop';

import { Theme, Themes } from 'LumX/components';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses, onEnterPressed } from 'LumX/core/utils';

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
    after?: HTMLElement | React.ReactNode;
    /** A component to be rendered before the main label area. */
    before?: HTMLElement | React.ReactNode;
    /** Indicates if the chip is currently in an active state or not. */
    isSelected?: boolean;
    /** Indicates if the chip is currently disabled or not. */
    isDisabled?: boolean;
    /** The size of the chip. */
    size?: Size;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** A function to be executed when the after element is clicked. */
    onAfterClick?(evt: SyntheticEvent): void;
    /** A function to be executed when the before element is clicked. */
    onBeforeClick?(evt: SyntheticEvent): void;
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
    after: null,
    before: null,
    isDisabled: false,
    isSelected: false,
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
    after = DEFAULT_PROPS.after,
    before = DEFAULT_PROPS.before,
    className = '',
    children,
    isSelected = DEFAULT_PROPS.isSelected,
    isDisabled = DEFAULT_PROPS.isDisabled,
    onAfterClick,
    onBeforeClick,
    onClick = null,
    size = DEFAULT_PROPS.size,
    theme = DEFAULT_PROPS.theme,
    ...props
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
        <a
            className={classNames(
                className,
                handleBasicClasses({
                    clickable: Boolean(hasOnClick),
                    disabled: Boolean(isDisabled),
                    hasAfter: Boolean(hasAfterClick),
                    hasBefore: Boolean(hasBeforeClick),
                    prefix: CLASSNAME,
                    selected: Boolean(isSelected),
                    size,
                    theme,
                    unselected: Boolean(!isSelected),
                }),
            )}
            role="button"
            tabIndex={isDisabled || !hasOnClick ? -1 : 0}
            onClick={onClick || noop}
            onKeyDown={onEnterPressed(onClick || noop)}
            {...props}
        >
            {before && (
                <div
                    className={classNames(`${CLASSNAME}__before`, {
                        [`${CLASSNAME}__before--is-clickable`]: hasBeforeClick,
                    })}
                    onClick={handleOnBeforeClick}
                >
                    {before}
                </div>
            )}

            <div className={`${CLASSNAME}__label`}>{children}</div>

            {after && (
                <div
                    className={classNames(`${CLASSNAME}__after`, {
                        [`${CLASSNAME}__after--is-clickable`]: hasAfterClick,
                    })}
                    onClick={handleOnAfterClick}
                >
                    {after}
                </div>
            )}
        </a>
    );
};

Chip.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Chip, ChipProps, Size, Sizes, Theme, Themes };
