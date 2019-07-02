import React, {
    AnchorHTMLAttributes,
    KeyboardEvent,
    KeyboardEventHandler,
    MouseEvent,
    MouseEventHandler,
    ReactElement,
} from 'react';

import noop from 'lodash/noop';

import classNames from 'classnames';

import { CSS_PREFIX, ENTER_KEY_CODE } from 'LumX/core/constants';
import { COMPONENT_PREFIX } from 'LumX/react/constants';

import { handleBasicClasses } from 'LumX/core/utils';
import { IGenericProps } from 'LumX/react/utils';

import { Icon, IconProps, Sizes } from 'LumX/components/icon/react/Icon';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ITabProps extends IGenericProps {
    /* Tab index */
    index?: number;
    /* Tab icon*/
    icon?: IconProps['icon'];
    /* Is tab active */
    isActive?: boolean;
    /* Is tab disabled */
    isDisabled?: boolean;
    /* Tab label */
    label?: string;
    /* Function to trigger on tab click */
    onTabClick?: CallableFunction;
}
type TabProps = ITabProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<TabProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Tab`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = `${CSS_PREFIX}-tabs__link`;

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    icon: undefined,
    isActive: false,
    isDisabled: false,
    label: undefined,
    onTabClick: noop,
};
/////////////////////////////

/**
 * Define a single Tab for Tabs component.
 *
 * @return The component.
 */
const Tab: React.FC<TabProps> = ({
    className = '',
    icon = DEFAULT_PROPS.icon,
    index = DEFAULT_PROPS.index,
    isActive = DEFAULT_PROPS.isActive,
    isDisabled = DEFAULT_PROPS.isDisabled,
    label = DEFAULT_PROPS.label,
    onTabClick = DEFAULT_PROPS.onTabClick,
    ...props
}: TabProps): ReactElement => {
    const tabIndex: AnchorHTMLAttributes<HTMLAnchorElement>['tabIndex'] = isDisabled ? -1 : 0;

    const handleTabClick: MouseEventHandler = (event: MouseEvent<HTMLElement>): void => {
        onTabClick!({ event, index });
    };

    const handleKeyPress: KeyboardEventHandler = (event: KeyboardEvent<HTMLElement>): void => {
        const keyCode: KeyboardEvent['which'] = event.which || event.keyCode;

        if (keyCode !== ENTER_KEY_CODE) {
            return;
        }

        onTabClick!({ event, index });
    };

    return (
        <a
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, isActive, isDisabled }))}
            tabIndex={tabIndex}
            onClick={handleTabClick}
            onKeyPress={handleKeyPress}
            {...props}
        >
            {icon && <Icon icon={icon} size={Sizes.xs} />}
            {label && <span>{label}</span>}
        </a>
    );
};
Tab.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Tab, TabProps };
