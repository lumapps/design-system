import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import {
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    HeadingProps as UIProps,
    getHeadingProps,
} from '@lumx/core/js/components/Heading';

import { GenericProps } from '@lumx/core/js/types';
import { Text } from '../text';
import { useHeadingLevel } from './useHeadingLevel';

export interface HeadingProps extends UIProps, GenericProps {}

/**
 * Renders a heading component.
 * Extends the `Text` Component with the heading level automatically computed based on
 * the current level provided by the context.
 */
export const Heading = forwardRef<HeadingProps>((props, ref) => {
    const { children, ...otherProps } = props;
    const { headingElement } = useHeadingLevel();
    const headingProps = getHeadingProps(otherProps, headingElement);

    return (
        <Text ref={ref} {...headingProps}>
            {children}
        </Text>
    );
});

Heading.displayName = COMPONENT_NAME;
Heading.className = CLASSNAME;
Heading.defaultProps = DEFAULT_PROPS;
