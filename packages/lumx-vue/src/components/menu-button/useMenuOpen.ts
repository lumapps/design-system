import { useMenuEvent } from './useMenuEvent';
import { useMenuContext } from './context';

export function useMenuOpen(): [import('vue').Ref<boolean | undefined>, (open: boolean) => void] {
    const { handle } = useMenuContext();
    const isOpen = useMenuEvent('open', false);

    const setIsOpen = (open: boolean) => handle.setOpen(open);

    return [isOpen, setIsOpen];
}
