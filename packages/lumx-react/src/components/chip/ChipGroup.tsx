import { ReactNode } from 'react';

import { HorizontalAlignment } from '@lumx/core/js/constants';
import { GenericProps } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { classNames } from '@lumx/core/js/utils';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { useChipGroupNavigation } from '@lumx/react/hooks/useChipGroupNavigation';

/**
 * Defines the props of the component.
 */
export interface ChipGroupProps extends GenericProps {
    /**
     * Chip horizontal alignment.
     * @deprecated
     */
    align?: HorizontalAlignment;
    /** List of Chip. */
    children: ReactNode;
}

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ChipGroupProps> = {};

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ChipGroup';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-chip-group';

/**
 * ChipGroup component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
const InternalChipGroup = forwardRef<ChipGroupProps, HTMLDivElement>((props, ref) => {
    const { align, children, className, ...forwardedProps } = props;

    return (
        <div ref={ref} {...forwardedProps} className={classNames.join(className, CLASSNAME)}>
            {children}
        </div>
    );
});
InternalChipGroup.displayName = COMPONENT_NAME;
InternalChipGroup.className = CLASSNAME;
InternalChipGroup.defaultProps = DEFAULT_PROPS;

export const ChipGroup = Object.assign(InternalChipGroup, { useChipGroupNavigation });
