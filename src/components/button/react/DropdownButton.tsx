import React, { Fragment, useState } from 'react';

import classNames from 'classnames';

import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';

import { Dropdown, Icon, IconButton } from 'LumX';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, ValidateParameters, validateComponent } from 'LumX/core/react/utils';
import { mdiMenuDown } from 'LumX/icons';

import {
    Button,
    ButtonProps,
    CLASSNAME as BUTTON_CLASSNAME,
    Color,
    Colors,
    Emphasis,
    Emphasises,
    Size,
    Sizes,
    Theme,
    Themes,
} from './Button';
import { ButtonGroup, ButtonGroupProps } from './ButtonGroup';

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
     * Indicates if the label <Button> and the icon <IconButton> buttons are separated in the <ButtonGroup>
     */
    isSplitted?: boolean;

    /**
     * The <DropdownButton> should never have the `variant` prop as this prop is forced to 'button' in the <Button>.
     */
    variant?: never;
}
type DropdownButtonProps = IProps & ButtonProps & ButtonGroupProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDropdownButtonDefaultPropsType extends Partial<DropdownButtonProps> {}

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
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}DropdownButton`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = `${BUTTON_CLASSNAME}__dropdown`;

/**
 * The default value of props.
 *
 * @type {IDropdownButtonDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: IDropdownButtonDefaultPropsType = {
    isSplitted: false,
};

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Globally validate the component before validating the children.
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
 * Validate the component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param  {DropdownButtonProps} props The children and props of the component.
 * @return {React.ReactNode}     The processed children of the component.
 */
function _validate(props: DropdownButtonProps): React.ReactNode {
    return validateComponent(COMPONENT_NAME, {
        maxChildren: 2,
        preValidate: _preValidate,
        props,
    });
}

/////////////////////////////

/**
 * Displays an dropdown button.
 * It's either a <Button> with an automatic right icon representing a "down caret". A click the button displays the
 * dropdown (non-splitted mode), or a <ButtonGroup> with a first <Button> for the label and a second <IconButton>
 * representing a "down caret". A click on the <IconButton> displays the dropdown (splitted mode).
 *
 * @see {@link Button} for more information on <Button>.
 * @see {@link IconButton} for more information on <IconButton>.
 * @see {@link ButtonGroup} for more information on <ButtonGroup>.
 *
 * @return {JSX.Element} The component.
 */
const DropdownButton: React.FC<DropdownButtonProps> = ({
    children,
    className = '',
    dropdown,
    isSplitted = DEFAULT_PROPS.isSplitted,
    ...props
}: DropdownButtonProps): JSX.Element => {
    const [isDropdownOpened, setIsDropdownOpened]: [boolean, (isDropdownOpened: boolean) => void] = useState(false);

    const newChildren: React.ReactNode = _validate({ children, dropdown, isSplitted, ...props });

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
            <ButtonGroup className={extendedClassNames}>
                <Button {...props} variant={Variants.button}>
                    {newChildren}
                </Button>

                <IconButton {...props} onClick={openDropdown}>
                    <Icon icon={mdiMenuDown} />
                </IconButton>
            </ButtonGroup>
        );
    } else {
        rootElement = (
            <Button className={extendedClassNames} {...props} variant={Variants.button} onClick={openDropdown}>
                {newChildren}
                <Icon icon={mdiMenuDown} />
            </Button>
        );
    }

    return (
        <Fragment>
            {rootElement}

            {isDropdownOpened ? <Dropdown>{dropdown}</Dropdown> : undefined}
        </Fragment>
    );
};
DropdownButton.displayName = COMPONENT_NAME;

/////////////////////////////

export {
    CLASSNAME,
    DEFAULT_PROPS,
    Color,
    Colors,
    Emphasis,
    Emphasises,
    DropdownButton,
    DropdownButtonProps,
    Size,
    Sizes,
    Theme,
    Themes,
    Variant,
    Variants,
};
