import { ReactNode } from 'react';

import isFunction from 'lodash/isFunction';

import { Theme } from '@lumx/react';
import { useStopPropagation } from '@lumx/react/hooks/useStopPropagation';

import { GenericProps } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';
import {
    Chip as UI,
    ChipProps as UIProps,
    ChipPropsToOverride,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Chip';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

/**
 * Defines the props of the component.
 */
export interface ChipProps extends GenericProps, ReactToJSX<UIProps, ChipPropsToOverride> {
    /** A component to be rendered after the content. */
    after?: ReactNode;
    /** A component to be rendered before the content. */
    before?: ReactNode;
    /** On "after" element clicked callback. */
    onAfterClick?: (event: React.MouseEvent) => void;
    /** On "before" element clicked callback. */
    onBeforeClick?: (event: React.MouseEvent) => void;
    /** On element clicked callback. */
    onClick?: (event: React.MouseEvent) => void;
    /** On element key down callback. */
    onKeyDown?: (event: React.KeyboardEvent) => void;
}

/**
 * Chip component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Chip = forwardRef<ChipProps, HTMLAnchorElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(props);
    const { onAfterClick, onBeforeClick, onClick, theme = defaultTheme, onKeyDown, ...forwardedProps } = otherProps;
    const hasAfterClick = isFunction(onAfterClick);
    const hasBeforeClick = isFunction(onBeforeClick);
    const hasOnClick = isFunction(props.onClick);

    const handleOnBeforeClick = useStopPropagation(onBeforeClick);
    const handleOnAfterClick = useStopPropagation(onAfterClick);

    return UI({
        hasAfterClick,
        hasBeforeClick,
        hasOnClick,
        handleAfterClick: handleOnAfterClick,
        handleBeforeClick: handleOnBeforeClick,
        handleClick: onClick,
        handleKeyDown: onKeyDown,
        theme,
        disabledStateProps,
        isAnyDisabled,
        ref,
        ...forwardedProps,
    });
});

Chip.displayName = COMPONENT_NAME;
Chip.className = CLASSNAME;
Chip.defaultProps = DEFAULT_PROPS;
