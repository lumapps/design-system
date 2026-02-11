import React from 'react';

import { ComboboxOptionSkeleton, ComboboxOptionSkeletonProps } from '../ComboboxOption/ComboboxOptionSkeleton';

export interface ComboboxListSkeletonProps {
    isLoadingMore?: boolean;
    children?: ComboboxOptionSkeletonProps['children'];
}

/** Default skeleton for the options list of the combobox */
export const ComboboxListSkeleton = ({ isLoadingMore, children }: ComboboxListSkeletonProps) => (
    <>
        {Array.from({ length: isLoadingMore ? 1 : 3 }).map((_, index) => {
            const renderedChildren =
                typeof children === 'function'
                    ? children({ index })
                    : children || <ComboboxOptionSkeleton index={index} />;

            return (
                // eslint-disable-next-line react/no-array-index-key
                <React.Fragment key={index}>{renderedChildren}</React.Fragment>
            );
        })}
    </>
);
