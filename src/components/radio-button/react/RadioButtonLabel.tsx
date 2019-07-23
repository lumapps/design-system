import React, { ReactChild, ReactElement } from 'react';

import classNames from 'classnames';

import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX } from 'LumX/react/constants';

import { handleBasicClasses } from 'LumX/core/utils';
import { IGenericProps } from 'LumX/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IRadioButtonLabelProps extends IGenericProps {
    radioButtonId?: string;
    children?: ReactChild;
}
type RadioButtonLabelProps = IRadioButtonLabelProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<RadioButtonLabelProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}RadioButtonLabel`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = `${CSS_PREFIX}-radio-button__label`;

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    children: '',
};

/////////////////////////////

/**
 * Define a radio button label component.
 *
 * @return The component.
 */
const RadioButtonLabel: React.FC<RadioButtonLabelProps> = ({
    radioButtonId,
    children = DEFAULT_PROPS.children,
    className = '',
    ...props
}: RadioButtonLabelProps): ReactElement => {
    return (
        <label
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))}
            htmlFor={radioButtonId}
            {...props}
        >
            {children}
        </label>
    );
};
RadioButtonLabel.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, RadioButtonLabel, RadioButtonLabelProps };
