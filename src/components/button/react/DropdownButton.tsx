import React, { ReactElement, ReactNode, useState } from 'react';

import classNames from 'classnames';

import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';

import { Dropdown, IconButton } from 'LumX';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, ValidateParameters, getRootClassName, validateComponent } from 'LumX/core/react/utils';
import { mdiMenuDown } from 'LumX/icons';

import { Button, ButtonProps, ButtonVariant } from './Button';
import { ButtonGroup, ButtonGroupProps } from './ButtonGroup';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IProps extends IGenericProps {
    /**
     * Contains the dropdown element to display when the icon is clicked.
     */
    dropdown?: ReactNode;

    /**
     * The left icon.
     */
    icon?: string;

    /**
     * Don't allow usage of `leftIcon` or `rightIcon` and use `icon` instead.
     */
    leftIcon?: never;
    rightIcon?: never;

    /**
     * Indicates if the label <Button> and the icon <IconButton> buttons are separated in the <ButtonGroup>
     */
    splitted?: boolean;

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
interface IDefaultPropsType extends Partial<DropdownButtonProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}DropdownButton`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    splitted: false,
};

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Globally validate the component after transforming and/or validating the children.
 *
 * @param params The children, their number and the props of the component.
 * @return     If a string, the error message.
 *                              If a boolean, `true` means a successful validation, `false` a bad validation (which will
 *                              lead to throw a basic error message).
 *                              You can also return nothing if there is no special problem (i.e. a successful
 *                              validation).
 */
function _postValidate({ props }: ValidateParameters): string | boolean | void {
    if (isEmpty(props.dropdown)) {
        console.warn(
            `You haven't specified any dropdown for you <${COMPONENT_NAME}>. The dropdown toggle will not work until you provide one.`,
        );
    }

    if (!isEmpty(props.variant)) {
        console.warn(
            `You shouldn't pass the \`variant\` prop in a <${COMPONENT_NAME}> as it's forced to 'button' (got '${
                props.variant
            }')!`,
        );
    }

    if (!isEmpty(props.rightIcon)) {
        console.warn(`You shouldn't pass the \`rightIcon\` prop in a <${COMPONENT_NAME}> (got '${props.variant}')!`);
    }

    return true;
}

/**
 * Globally validate the component before transforming and/or validating the children.
 *
 * @param params The children, their number and the props of the component.
 * @return     If a string, the error message.
 *                              If a boolean, `true` means a successful validation, `false` a bad validation (which will
 *                              lead to throw a basic error message).
 *                              You can also return nothing if there is no special problem (i.e. a successful
 *                              validation).
 */
function _preValidate({ props }: ValidateParameters): string | boolean | void {
    if (!isEmpty(props.leftIcon)) {
        return `You must use the \`icon\` prop of <${COMPONENT_NAME}> instead of \`leftIcon\`!`;
    }
}

/**
 * Validate the component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param props The children and props of the component.
 * @return     The processed children of the component.
 */
function _validate(props: DropdownButtonProps): ReactNode {
    return validateComponent(COMPONENT_NAME, {
        maxChildren: 2,
        postValidate: _postValidate,
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
 * @return The component.
 */
const DropdownButton: React.FC<DropdownButtonProps> = ({
    children,
    className = '',
    dropdown,
    icon,
    // @ts-ignore
    leftIcon = '',
    // @ts-ignore
    rightIcon = '',
    splitted = DEFAULT_PROPS.splitted,
    ...props
}: DropdownButtonProps): ReactElement => {
    const [isDropdownOpened, setIsDropdownOpened] = useState(false);

    const newChildren: ReactNode = _validate({
        children,
        dropdown,
        icon,
        leftIcon,
        rightIcon,
        splitted,
        ...props,
    });

    /**
     * Open the dropdown contained in the dropdown button.
     *
     * @param   evt The click event.
     * @return If we should propagate the event or not.
     */
    const openDropdown: (evt: React.MouseEvent<HTMLElement>) => boolean | void = (
        evt: React.MouseEvent<HTMLElement>,
    ): boolean | void => {
        setIsDropdownOpened(!isDropdownOpened);

        if (!splitted && isFunction(props.onClick)) {
            return props.onClick(evt);
        }
    };

    let rootElement: ReactElement;
    const extendedClassNames: string = classNames(className, CLASSNAME, { [`${CLASSNAME}--is-splitted`]: splitted });

    if (splitted) {
        rootElement = (
            <ButtonGroup className={extendedClassNames}>
                <Button {...props} leftIcon={icon} variant={ButtonVariant.button}>
                    {newChildren}
                </Button>

                <IconButton {...props} icon={mdiMenuDown} onClick={openDropdown} />
            </ButtonGroup>
        );
    } else {
        rootElement = (
            <Button
                className={extendedClassNames}
                {...props}
                leftIcon={icon}
                rightIcon={mdiMenuDown}
                variant={ButtonVariant.button}
                onClick={openDropdown}
            >
                {newChildren}
            </Button>
        );
    }

    return (
        <>
            {rootElement}

            {isDropdownOpened ? <Dropdown>{dropdown}</Dropdown> : undefined}
        </>
    );
};
DropdownButton.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, DropdownButton, DropdownButtonProps };
