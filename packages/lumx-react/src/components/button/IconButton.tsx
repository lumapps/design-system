import { Theme, Tooltip, TooltipProps } from '@lumx/react';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled';
import {
    IconButton as UI,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    IconButtonProps as UIProps,
} from '@lumx/core/js/components/Button/IconButton';
import { GenericProps } from '@lumx/core/js/types';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

export interface IconButtonProps extends GenericProps, ReactToJSX<UIProps, 'title' | 'children'> {
    /**
     * Props to pass to the tooltip.
     * If undefined or if tooltipProps.label is undefined, the label prop will be used as tooltip label.
     * */
    tooltipProps?: Partial<TooltipProps>;
    /** Whether the tooltip should be hidden or not. */
    hideTooltip?: boolean;
    /** callback for clicking on the button */
    onClick?: (event?: React.MouseEvent) => void;
    /** callback for pressing a key on the button */
    onKeyPress?: (event?: React.KeyboardEvent) => void;
}

/**
 * IconButton component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const IconButton = forwardRef<IconButtonProps, HTMLButtonElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { tooltipProps, hideTooltip, label, ...forwardedProps } = props;

    const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(forwardedProps);
    const { onClick, onKeyPress, ...restOfOtherProps } = otherProps;

    return (
        <Tooltip label={hideTooltip ? '' : label} {...tooltipProps}>
            {UI({
                ref,
                theme: defaultTheme,
                ...disabledStateProps,
                ...restOfOtherProps,
                handleClick: onClick,
                handleKeyPress: onKeyPress,
                'aria-disabled': isAnyDisabled,
                label,
            })}
        </Tooltip>
    );
});

IconButton.displayName = COMPONENT_NAME;
IconButton.className = CLASSNAME;
IconButton.defaultProps = DEFAULT_PROPS;
