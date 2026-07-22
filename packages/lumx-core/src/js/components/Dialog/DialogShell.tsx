import type { CommonRef, HasClassName } from '../../types';
import { classNames } from '../../utils';
import { Size } from '../../constants';
import { block, element } from './constants';
import type { DialogSizes } from './types';

/**
 * Props of the outer shell: the overlay + the context providers (theme, heading level, and the
 * internal ids registry). It renders `children` - typically a framework component that reads the
 * registered label id and renders a `DialogContent`.
 */
export interface DialogShellProps extends HasClassName {
    /** Reference to the root element. */
    ref?: CommonRef;
    /** Whether the component is open or not. */
    isOpen?: boolean;
    /** Whether the indefinite progress indicator is displayed (drives the loading class). */
    isLoading?: boolean;
    /** Whether the component is still visible (e.g. during close animation). */
    isVisible?: boolean;
    /** Size variant. */
    size?: DialogSizes;
    /** Z-axis position. */
    zIndex?: number;
    /** Content rendered inside the overlay + providers (typically a framework `DialogContent` reader). */
    children?: any;
    /** Portal component for rendering outside the DOM hierarchy. */
    Portal: any;
    /** HeadingLevelProvider component. */
    HeadingLevelProvider: any;
    /** ThemeProvider component. */
    ThemeProvider: any;
    /** Provides the ids registry so a `DialogHeading` in the subtree can be linked via `aria-labelledby`. */
    IdsRegistryProvider: any;
}

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<Pick<DialogShellProps, 'size'>> = {
    size: Size.big,
};

/**
 * Dialog shell: overlay + context providers (theme, heading level, ids registry).
 *
 * @param  props Component props.
 * @return React element.
 */
export const DialogShell = (props: DialogShellProps) => {
    const {
        className,
        ref,
        isOpen,
        isLoading,
        isVisible,
        size = DEFAULT_PROPS.size,
        zIndex,
        children,
        Portal,
        HeadingLevelProvider,
        ThemeProvider,
        IdsRegistryProvider,
        ...forwardedProps
    } = props;

    return (
        <Portal>
            <div
                ref={ref}
                {...forwardedProps}
                className={classNames.join(
                    className,
                    block({
                        'is-hidden': !isOpen,
                        'is-loading': isLoading,
                        'is-shown': isOpen || isVisible,
                        [`size-${size}`]: Boolean(size),
                    }),
                )}
                style={{ zIndex }}
            >
                <div className={element('overlay')} />

                <HeadingLevelProvider level={2}>
                    <ThemeProvider value={undefined}>
                        <IdsRegistryProvider>{children}</IdsRegistryProvider>
                    </ThemeProvider>
                </HeadingLevelProvider>
            </div>
        </Portal>
    );
};
