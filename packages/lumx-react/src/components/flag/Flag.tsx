import { Theme, Text } from '@lumx/react';
import {
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    Flag as UI,
    FlagProps as UIProps,
} from '@lumx/core/js/components/Flag';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { GenericProps } from '@lumx/core/js/types';

export interface FlagProps extends GenericProps, Omit<UIProps, 'children' | 'Text'> {
    /** Text label of the flag. */
    label: React.ReactNode;
}

/**
 * Flag component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Flag = forwardRef<FlagProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;

    return UI({
        ...props,
        theme: props.theme || defaultTheme,
        ref,
        children: props.label,
        Text,
    });
});

Flag.displayName = COMPONENT_NAME;
Flag.className = CLASSNAME;
Flag.defaultProps = DEFAULT_PROPS;
