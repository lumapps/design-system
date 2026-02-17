import { ReactNode } from 'react';

import { classNames } from '@lumx/core/js/utils';
import { Size, SkeletonTypography, Text } from '@lumx/react';
import { REAL_SIZE_FOR_LUMX_SIZE } from '@lumx/core/js/constants';

import { COMBOBOX_OPTION_CLASSNAME } from '.';
import { ComboboxOptionProps } from '../../types';

export interface ComboboxOptionSkeletonProps {
    className?: string;
    index?: number;
    children?: ReactNode | ((options: { index?: number }) => ReactNode);
    before?: ComboboxOptionProps['before'];
    after?: ComboboxOptionProps['after'];
    size?: ComboboxOptionProps['size'];
}

// Default widths the skeletons must have
const defaultWidths = [REAL_SIZE_FOR_LUMX_SIZE.xxl, REAL_SIZE_FOR_LUMX_SIZE.xl, REAL_SIZE_FOR_LUMX_SIZE.l];
const { block, element } = classNames.bem(COMBOBOX_OPTION_CLASSNAME);

/**
 * Skeleton for a combobox option.
 * A typography skeleton is rendered by default but can be overridden by passing children.
 */
export const ComboboxOptionSkeleton = ({
    className,
    index,
    before,
    after,
    size = Size.tiny,
    children,
}: ComboboxOptionSkeletonProps) => {
    const renderedChildren = typeof children === 'function' ? children({ index }) : children;
    const content = renderedChildren || (
        <SkeletonTypography
            typography="body1"
            width={index !== undefined && defaultWidths[index] ? defaultWidths[index] : REAL_SIZE_FOR_LUMX_SIZE.xl}
        />
    );

    return (
        <li
            role="presentation"
            className={block({ skeleton: true }, ['lumx-list-item', `lumx-list-item--size-${size}`, className])}
        >
            <div role="presentation" className={element('content', ['lumx-list-item__wrapper'])}>
                {before && (
                    <Text as="span" role="presentation" className={element('before', ['lumx-list-item__before'])}>
                        {before}
                    </Text>
                )}
                {content}
            </div>
            {after && (
                <div role="presentation" className={element('after', ['lumx-list-item__after'])}>
                    {after}
                </div>
            )}
        </li>
    );
};
