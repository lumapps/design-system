import React, { Children, isValidElement } from 'react';

import classNames from 'classnames';

import { ColorVariant, ColorWithVariants, Typography } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import { fontColorClass, getRootClassName, getTypographyClassName } from '@lumx/core/js/utils/className';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface InlineListProps extends GenericProps {
    /**
     * Text color.
     */
    color?: ColorWithVariants;
    /**
     * Lightened or darkened variant of the selected color.
     */
    colorVariant?: ColorVariant;
    /**
     * Typography variant.
     */
    typography?: Typography;
    /**
     * Activate line wrap on overflow.
     */
    wrap?: boolean;
    /**
     * Children
     */
    children?: React.ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'InlineList';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS = {} as const;

/**
 * InlineList component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const InlineList = forwardRef<InlineListProps>((props, ref) => {
    const { className, color, colorVariant, typography, children, wrap, ...forwardedProps } = props;
    const typographyClassName = typography && getTypographyClassName(typography);
    return (
        // eslint-disable-next-line jsx-a11y/no-redundant-roles
        <ul
            {...forwardedProps}
            ref={ref as any}
            className={classNames(
                className,
                CLASSNAME,
                wrap && `${CLASSNAME}--wrap`,
                fontColorClass(color, colorVariant),
                typographyClassName,
            )}
            // Lists with removed bullet style can lose their a11y list role on some browsers
            role="list"
        >
            {Children.toArray(children).map((child, index) => {
                const key = (isValidElement(child) && child.key) || index;
                return (
                    // We need to item is set as display: contents which removes the semantic.
                    // eslint-disable-next-line jsx-a11y/no-redundant-roles
                    <li key={key} role="listitem" className={`${CLASSNAME}__item`}>
                        {index !== 0 && (
                            <span className={`${CLASSNAME}__item-separator`} aria-hidden="true">
                                {'\u00A0•\u00A0'}
                            </span>
                        )}
                        {child}
                    </li>
                );
            })}
        </ul>
    );
});
InlineList.displayName = COMPONENT_NAME;
InlineList.className = CLASSNAME;
InlineList.defaultProps = DEFAULT_PROPS;
