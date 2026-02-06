import React from 'react';

import { useOverflowTooltipLabel } from '@lumx/react/hooks/useOverflowTooltipLabel';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { wrapChildrenIconWithSpaces } from '@lumx/react/utils/react/wrapChildrenIconWithSpaces';
import {
    getTextProps,
    TextProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Text';
import { GenericProps } from '@lumx/core/js/types';

export interface TextProps extends UIProps, GenericProps {}
/**
 * Text component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Text = forwardRef<TextProps>((props, ref) => {
    const {
        as: Component,
        children,
        color,
        colorVariant,
        noWrap,
        typography,
        truncate,
        whiteSpace,
        ...forwardedProps
    } = props;

    const { tooltipLabel, labelRef } = useOverflowTooltipLabel(children);
    const { className, style } = React.useMemo(() => getTextProps(props), [props]);

    return (
        <Component
            ref={useMergeRefs(ref as React.Ref<any>, labelRef)}
            title={tooltipLabel}
            {...forwardedProps}
            className={className}
            style={style}
        >
            {wrapChildrenIconWithSpaces(children)}
        </Component>
    );
});

Text.displayName = COMPONENT_NAME;
Text.className = CLASSNAME;
Text.defaultProps = DEFAULT_PROPS;
