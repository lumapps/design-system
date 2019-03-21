import React, { Fragment, useState } from 'react';

import classNames from 'classnames';

import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';

import { LxDropdown, LxIcon, LxIconButton } from 'LumX';
import { IGenericProps, validateComponent, ValidateParameters } from 'LumX/core/react/utils';
import { mdiMenuDown } from 'LumX/icons';

import {
    CLASSNAME as LXBUTTON_CLASSNAME,
    Color,
    Colors,
    Emphasis,
    Emphasises,
    LxButton,
    LxButtonProps,
    Size,
    Sizes,
    Theme,
    Themes,
} from './LxButton';
import { LxButtonGroup, LxButtonGroupProps } from './LxButtonGroup';

/////////////////////////////

enum Variants {
    button = 'button',
}
type Variant = Variants;

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IProps extends IGenericProps {
    /**
     * Contains the dropdown element to display when the icon is clicked.
     */
    dropdown?: JSX.Element;

    /**
     * Indicates if the label <LxButton> and the icon <LxDropdownButton> buttons are separated in the <LxButtonGroup>
     */
    isSplitted?: boolean;

    /**
     * The <LxDropdownButton> should never have the `variant` prop as this prop is forced to 'button' in the <LxButton>.
     */
    variant?: never;
}
type LxDropdownButtonProps = IProps & LxButtonProps & LxButtonGroupProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface ILxDropdownButtonDefaultPropsType extends Partial<LxDropdownButtonProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = `${LXBUTTON_CLASSNAME}__dropdown`;

/**
 * The display name of the component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = 'LxDropdownButton';

/**
 * The default value of props.
 *
 * @type {ILxDropdownButtonDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: ILxDropdownButtonDefaultPropsType = {
    isSplitted: false,
};

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Globally validate the <LxDropdownButton> component before validating the children.
 *
 * @param {ValidateParameters} props The properties of the component.
 */
function _preValidate({ props }: ValidateParameters): void {
    if (isEmpty(props.dropdown)) {
        console.warn(
            `You haven't specified any dropdown for you <${COMPONENT_NAME}>. The dropdown toggle will not work until you provide one.`,
        );
    }

    if (isEmpty(props.variant)) {
        return;
    }

    console.warn(
        `You shouldn't pass the \`variant\` prop in a <${COMPONENT_NAME}> as it's forced to 'button' (got '${
            props.variant
        }')!`,
    );
}

/**
 * Validate the <LxDropdownButton> component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param  {LxDropdownButtonProps} props The children and props of the <LxButton> component.
 * @return {React.ReactNode}       The processed children of the component.
 */
function _validate(props: LxDropdownButtonProps): React.ReactNode {
    return validateComponent(COMPONENT_NAME, {
        maxChildren: 2,
        preValidate: _preValidate,
        props,
    });
}

/////////////////////////////

/**
 * Displays an icon button.
 * It's like a <LxButton> but displays an icon instead of a label in the body of the button.
 *
 * @see {@link LxButton} for more information on <LxButton>.
 *
 * @return {JSX.Element} The <LxDropdownButton> component.
 */
const LxDropdownButton: React.FC<LxDropdownButtonProps> = ({
    children,
    className = '',
    dropdown,
    isSplitted = DEFAULT_PROPS.isSplitted,
    ...props
}: LxDropdownButtonProps): JSX.Element => {
    const [isDropdownOpened, setIsDropdownOpened]: [boolean, (isDropdownOpened: boolean) => void] = useState(false);

    const newChildren = _validate({ children, dropdown, isSplitted, ...props });

    const openDropdown: (evt: React.MouseEvent<HTMLElement>) => boolean | void = (
        evt: React.MouseEvent<HTMLElement>,
    ): boolean | void => {
        setIsDropdownOpened(!isDropdownOpened);

        if (!isSplitted && isFunction(props.onClick)) {
            props.onClick(evt);
        }
    };

    let rootElement: JSX.Element;
    const extendedClassNames: string = classNames(className, CLASSNAME, { [`${CLASSNAME}--is-splitted`]: isSplitted });

    if (isSplitted) {
        rootElement = (
            <LxButtonGroup className={extendedClassNames}>
                <LxButton {...props} variant={Variants.button}>
                    {newChildren}
                </LxButton>

                <LxIconButton {...props} onClick={openDropdown}>
                    <LxIcon icon={mdiMenuDown} />
                </LxIconButton>
            </LxButtonGroup>
        );
    } else {
        rootElement = (
            <LxButton className={extendedClassNames} {...props} variant={Variants.button} onClick={openDropdown}>
                {newChildren}
                <LxIcon icon={mdiMenuDown} />
            </LxButton>
        );
    }

    return (
        <Fragment>
            {rootElement}

            {isDropdownOpened ? <LxDropdown>{dropdown}</LxDropdown> : null}
        </Fragment>
    );
};
LxDropdownButton.displayName = COMPONENT_NAME;

/////////////////////////////

export {
    CLASSNAME,
    DEFAULT_PROPS,
    Color,
    Colors,
    Emphasis,
    Emphasises,
    LxDropdownButton,
    LxDropdownButtonProps,
    Size,
    Sizes,
    Theme,
    Themes,
    Variant,
    Variants,
};
