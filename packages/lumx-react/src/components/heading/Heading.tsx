import { Comp, getRootClassName, handleBasicClasses, HeadingElement } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { forwardRef } from 'react';
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
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Heading';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS = {} as const;

/**
 * Renders a heading component.
 * Extends the `Text` Component with the heading level automatically computed based on
 * the current level provided by the context.
 */
export const Heading: Comp<HeadingProps> = forwardRef((props, ref) => {
    const { children, as, className, ...forwardedProps } = props;
    const { headingElement } = useHeadingLevel();

    return (
        <Text
            ref={ref}
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                }),
            )}
            as={as || headingElement}
            typography={DEFAULT_TYPOGRAPHY_BY_LEVEL[headingElement]}
            {...forwardedProps}
        >
            {children}
        </Text>
    );
});

Heading.displayName = COMPONENT_NAME;
Heading.className = CLASSNAME;
Heading.defaultProps = DEFAULT_PROPS;
