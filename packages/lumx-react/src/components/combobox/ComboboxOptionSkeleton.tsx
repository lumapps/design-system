import { ReactNode, useEffect } from 'react';

import { GenericProps } from '@lumx/core/js/types';
import {
    ComboboxOptionSkeleton as UI,
    ComboboxOptionSkeletonProps as UIProps,
    ComboboxOptionSkeletonPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Combobox/ComboboxOptionSkeleton';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { useComboboxContext } from './context/ComboboxContext';

/**
 * Props for Combobox.OptionSkeleton component.
 */
export interface ComboboxOptionSkeletonProps
    extends GenericProps,
        ReactToJSX<UIProps, ComboboxOptionSkeletonPropsToOverride> {
    /** Content rendered before the skeleton text (e.g. SkeletonCircle for avatar placeholders). */
    before?: ReactNode;
    /** Content rendered after the skeleton text. */
    after?: ReactNode;
    /** Override the default SkeletonTypography content entirely. */
    children?: ReactNode;
    /**
     * Number of skeleton `<li>` elements to render.
     * Each is an independent element with `:nth-child` width cycling applied by SCSS.
     * @default 1
     */
    count?: number;
}

/**
 * Combobox.OptionSkeleton component — renders skeleton placeholder(s) inside a combobox list.
 *
 * Registers once with the combobox handle on mount (regardless of `count`). The handle
 * fires `loadingChange` / `loadingAnnouncement` events, so consumers don't need an
 * explicit `isLoading` prop on `Combobox.List`.
 *
 * Width variation across skeletons is handled by SCSS `:nth-child` rules automatically.
 *
 * @example
 * ```tsx
 * // Basic — 3 plain skeletons
 * <Combobox.List aria-label="Users">
 *     {users.map(u => <Combobox.Option key={u.id} value={u.id}>{u.name}</Combobox.Option>)}
 *     {isLoading && <Combobox.OptionSkeleton count={3} />}
 * </Combobox.List>
 *
 * // With avatar placeholder
 * {isLoading && <Combobox.OptionSkeleton count={3} before={<SkeletonCircle size="s" />} />}
 * ```
 *
 * @param props Component props.
 * @return React element(s).
 */
export const ComboboxOptionSkeleton = (props: ComboboxOptionSkeletonProps) => {
    const { count = 1, ...itemProps } = props;
    const { handle } = useComboboxContext();
    useEffect(() => handle?.registerSkeleton(), [handle]);

    return Array.from({ length: count }, (_, i) => <UI key={i} {...itemProps} />);
};

ComboboxOptionSkeleton.displayName = COMPONENT_NAME;
ComboboxOptionSkeleton.className = CLASSNAME;
