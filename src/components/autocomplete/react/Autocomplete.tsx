import React, { ReactElement } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { handleBasicClasses } from 'LumX/core/utils';
import { IGenericProps, getRootClassName } from 'LumX/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IAutocompleteProps extends IGenericProps {}
type AutocompleteProps = IAutocompleteProps;

/////////////////////////////

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Autocomplete`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<AutocompleteProps> = {};

/////////////////////////////

/**
 * [Enter the description of the component here].
 *
 * @return The component.
 */
const Autocomplete: React.FC<AutocompleteProps> = (props: AutocompleteProps): ReactElement => {
    const { children, className, ...forwardedProps } = props;

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
Autocomplete.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Autocomplete, AutocompleteProps };
