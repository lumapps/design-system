import { computed, ref, type Ref, type CSSProperties } from 'vue';

import { useFloating, autoUpdate, type Placement as FloatingPlacement } from '@floating-ui/vue';

import { type Placement } from '@lumx/core/js/components/Popover/constants';
import {
    parseAutoPlacement,
    parseFitWidth,
    buildPopoverMiddleware,
    computeArrowStyles,
    getFloatingPlacement,
} from '@lumx/core/js/components/Popover/popoverStyle';
import type { Offset } from '@lumx/core/js/components/Popover/constants';

export interface UsePopoverStyleOptions {
    anchorRef: Ref<HTMLElement | undefined>;
    offset?: Ref<Offset | undefined>;
    hasArrow?: Ref<boolean | undefined>;
    fitToAnchorWidth?: Ref<string | boolean | undefined>;
    fitWithinViewportHeight?: Ref<boolean | undefined>;
    boundaryRef?: Ref<HTMLElement | undefined>;
    placement?: Ref<Placement | undefined>;
    style?: Ref<CSSProperties | undefined>;
    zIndex?: Ref<number | undefined>;
}

export interface UsePopoverStyleOutput {
    styles: {
        arrow: Ref<CSSProperties | undefined>;
        popover: Ref<CSSProperties>;
    };
    isPositioned: Ref<boolean>;
    position: Ref<Placement | undefined>;
    floatingRef: Ref<HTMLElement | undefined>;
    arrowRef: Ref<HTMLElement | undefined>;
}

export function usePopoverStyle(options: UsePopoverStyleOptions): UsePopoverStyleOutput {
    const floatingRef = ref<HTMLElement | undefined>();
    const arrowRef = ref<HTMLElement | undefined>();

    const parsedPlacement = computed(() => parseAutoPlacement(options.placement?.value));
    const fitWidth = computed(() => parseFitWidth(options.fitToAnchorWidth?.value));

    const middleware = computed(() =>
        buildPopoverMiddleware({
            offset: options.offset?.value,
            hasArrow: options.hasArrow?.value,
            fitWidth: fitWidth.value,
            fitWithinViewportHeight: options.fitWithinViewportHeight?.value,
            boundary: options.boundaryRef?.value,
            parsedPlacement: parsedPlacement.value,
            arrowElement: arrowRef.value,
        }),
    );

    const floatingPlacement = computed(() => getFloatingPlacement(parsedPlacement.value));

    const {
        floatingStyles,
        placement: resolvedPlacement,
        isPositioned,
        middlewareData,
    } = useFloating(options.anchorRef, floatingRef, {
        placement: floatingPlacement as Ref<FloatingPlacement | undefined>,
        whileElementsMounted: autoUpdate,
        middleware,
    });

    const position = computed<Placement | undefined>(
        () => (resolvedPlacement.value ?? options.placement?.value) as Placement | undefined,
    );

    // Compute arrow styles from middleware data
    const arrowStyles = computed<CSSProperties | undefined>(() => computeArrowStyles(middlewareData.value?.arrow));

    // Merge floating styles with user-provided styles and zIndex
    const popoverStyle = computed<CSSProperties>(() => {
        return {
            ...(options.style?.value || {}),
            ...floatingStyles.value,
            zIndex: options.zIndex?.value,
        };
    });

    return {
        styles: { arrow: arrowStyles, popover: popoverStyle },
        isPositioned,
        position,
        floatingRef,
        arrowRef,
    };
}
