import React, {
    AnchorHTMLAttributes,
    KeyboardEventHandler,
    MouseEventHandler,
    ReactElement,
    SyntheticEvent,
} from 'react';

import classNames from 'classnames';

import { Icon, IconProps, Size } from '@lumx/react';
import { COMPONENT_PREFIX, CSS_PREFIX, ENTER_KEY_CODE } from '@lumx/react/constants';
import { IGenericProps, handleBasicClasses } from '@lumx/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ITabProps extends IGenericProps {
    /** Tab index */
    index?: number;
    /** Tab icon */
    icon?: IconProps['icon'];
    /** Is tab active */
    isActive?: boolean;
    /** Is tab disabled */
    isDisabled?: boolean;
    /** Tab label */
    label?: string;
    /** Function to trigger on tab click */
    onTabClick?(e: { event: SyntheticEvent; index?: number }): void;
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
    onTabClick,
    ...props
}: TabProps): ReactElement => {
    const tabIndex: AnchorHTMLAttributes<HTMLAnchorElement>['tabIndex'] = isDisabled ? -1 : 0;

    const handleTabClick: MouseEventHandler = (event) => {
        onTabClick?.({ event, index });
    };

    const handleKeyPress: KeyboardEventHandler = (event) => {
        const keyCode = event.which ?? event.keyCode;

        if (keyCode !== ENTER_KEY_CODE) {
            return;
        }

        onTabClick?.({ event, index });
    };

    return (
        <a
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, isActive, isDisabled }))}
            tabIndex={tabIndex}
            onClick={handleTabClick}
            onKeyPress={handleKeyPress}
            {...props}
        >
            {icon && <Icon icon={icon} size={Size.xs} />}
            {label && <span>{label}</span>}
        </a>
    );
};
Tab.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Tab, TabProps };
