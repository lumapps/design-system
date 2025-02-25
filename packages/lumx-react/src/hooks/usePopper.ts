import { usePopper as usePopperHook } from 'react-popper';
import { IS_BROWSER } from '@lumx/react/constants';

/** Stub usePopper for use outside of browsers */
const useStubPopper: typeof usePopperHook = (_a, _p, { placement }: any) =>
    ({
        attributes: { popper: { 'data-popper-placement': placement } },
        styles: { popper: { transform: 'translate(1, 1)' } },
    }) as any;

/** Switch hook implementation between environment */
export const usePopper: typeof usePopperHook = IS_BROWSER ? usePopperHook : useStubPopper;
