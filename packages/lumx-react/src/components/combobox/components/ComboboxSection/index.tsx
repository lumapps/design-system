import React, { ReactNode } from 'react';

import { classNames } from '@lumx/core/js/utils';
import { ListSubheader, Text } from '@lumx/react';
import { useId } from '../../../../hooks/useId';

import { SectionContext } from '../../context/ComboboxContext';
import { useCombobox } from '../../hooks/useCombobox';
import { useComboboxSectionId } from '../../hooks/useComboboxSectionId';
import { isComboboxValue } from '../../utils';
import { ComboboxListSkeleton, ComboboxListSkeletonProps } from '../ComboboxListBox/ComboboxListSkeleton';

export interface ComboboxSectionProps {
    /** Forwarded class name */
    className?: string;
    /** The title of the section */
    title?: string;
    /** Whether the section should be displayed as loading */
    isLoading?: boolean;
    /** Custom skeletons to use for loading state */
    renderItemSkeleton?: ComboboxListSkeletonProps['children'];
    /** Options to display */
    children: ReactNode;
}

const CLASSNAME = 'lumx-combobox-section';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Content of the ComboboxSection.
 */
const ComboboxSectionContent = ({
    className,
    title,
    children,
    isLoading,
    renderItemSkeleton,
}: ComboboxSectionProps) => {
    const { options } = useCombobox();
    const { sectionId } = useComboboxSectionId();

    const hasRegisteredChildren = Boolean(
        Object.values(options).find((option) => isComboboxValue(option) && option.sectionId === sectionId),
    );
    const titleId = title && `${sectionId}-title`;

    if (!children && !isLoading) {
        return null;
    }

    const isHidden = !hasRegisteredChildren && !isLoading;
    return (
        <li
            className={block([className])}
            role={!isHidden ? 'none' : undefined}
            aria-hidden={isHidden}
            style={{ display: isHidden ? 'none' : undefined }}
        >
            {title && (
                <Text
                    as="span"
                    className={element('header', [ListSubheader.className])}
                    aria-hidden="true"
                    id={titleId}
                >
                    {title}
                </Text>
            )}
            <ul className={element('content')} role="group" aria-labelledby={titleId}>
                {children}
                {isLoading && <ComboboxListSkeleton>{renderItemSkeleton}</ComboboxListSkeleton>}
            </ul>
        </li>
    );
};

/**
 * Section for options of a Combobox.
 *
 * @family Combobox
 * @param ComboboxSectionProps
 * @returns ComboboxSection
 */
export const ComboboxSection = ({ children, ...props }: ComboboxSectionProps) => {
    const sectionId = useId();
    const value = React.useMemo(() => ({ sectionId, isLoading: props.isLoading }), [sectionId, props.isLoading]);

    return (
        <SectionContext.Provider value={value}>
            <ComboboxSectionContent {...props}>{children}</ComboboxSectionContent>
        </SectionContext.Provider>
    );
};
