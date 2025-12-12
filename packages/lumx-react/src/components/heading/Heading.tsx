import { HeadingElement } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { classNames } from '@lumx/core/js/utils';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { Text, TextProps } from '../text';
import { DEFAULT_TYPOGRAPHY_BY_LEVEL } from './constants';
import { useHeadingLevel } from './useHeadingLevel';

/**
 * Defines the props of the component.
 */
export interface HeadingProps extends Partial<TextProps> {
    /**
     * Display a specific heading level instead of the one provided by parent context provider.
     */
    as?: HeadingElement;
    /**
     * Children
     */
    children?: React.ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Heading';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-heading';

/**
 * Component default props.
 */
const DEFAULT_PROPS = {} as const;

/**
 * Renders a heading component.
 * Extends the `Text` Component with the heading level automatically computed based on
 * the current level provided by the context.
 */
export const Heading = forwardRef<HeadingProps>((props, ref) => {
    const { children, as, className, ...forwardedProps } = props;
    const { headingElement } = useHeadingLevel();

    const computedHeadingElement = as || headingElement;
    return (
        <Text
            ref={ref}
            className={classNames.join(className, CLASSNAME)}
            as={computedHeadingElement}
            typography={DEFAULT_TYPOGRAPHY_BY_LEVEL[computedHeadingElement]}
            {...forwardedProps}
        >
            {children}
        </Text>
    );
});

Heading.displayName = COMPONENT_NAME;
Heading.className = CLASSNAME;
Heading.defaultProps = DEFAULT_PROPS;
