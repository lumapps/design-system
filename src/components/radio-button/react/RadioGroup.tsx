import React, { ReactElement } from 'react';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import classNames from 'classnames';

import { RadioButton } from 'LumX';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IRadioGroupProps extends IGenericProps {
    /**
     * List of radio buttons in the group.
     */
    children: RadioButton[];
}
type RadioGroupProps = IRadioGroupProps;

/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}RadioGroup`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/////////////////////////////

/**
 * Radio group component.
 *
 * @return The component.
 */
const RadioGroup: React.FC<RadioGroupProps> = (props: RadioGroupProps): ReactElement => {
    const { className, children, ...forwardedProps } = props;

    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                }),
            )}
            {...forwardedProps}
        >
            {children}
        </div>
    );
};
RadioGroup.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, RadioGroup, RadioGroupProps };
