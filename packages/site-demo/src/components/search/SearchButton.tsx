import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useLocation } from '@gatsbyjs/reach-router';
import partial from 'lodash/partial';

import { Chip, Icon } from '@lumx/react';
import { mdiMagnify } from '@lumx/icons';
import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import { useIsServerSide } from '@lumx/demo/utils/hooks/useIsServerSide';

import { SearchDialog } from './dialog/SearchDialog';
import './SearchButton.scss';

const NAVIGATOR: any = typeof navigator !== 'undefined' ? navigator : undefined;
const IS_MAC = (NAVIGATOR?.userAgentData?.platform || NAVIGATOR?.platform)?.toLowerCase().startsWith('mac');

interface SearchButtonProps {
    className?: string;
}

export const SearchButton: React.FC<SearchButtonProps> = ({ className }) => {
    const { pathname } = useLocation();
    const buttonRef = useRef<HTMLElement>(null);
    const [isOpen, close, open] = useBooleanState(false);
    const [shouldMountDialog, setMountDialog] = useState(false);
    const isServerSide = useIsServerSide();

    // Close search on page change:
    useEffect(() => {
        if (pathname) {
            close();
        }
    }, [close, pathname]);

    // Open on `/` or `Ctrl+k` or '⌘+k' pressed:
    useEffect(() => {
        window.addEventListener('keydown', (evt) => {
            if (evt.key === '/' || (evt.ctrlKey && evt.key === 'k') || (IS_MAC && evt.metaKey && evt.key === 'k')) {
                evt.preventDefault();
                open();
            }
        });
    }, [open]);

    return (
        <>
            <Chip
                className={classNames(className, 'search-button')}
                ref={buttonRef as any}
                before={<Icon icon={mdiMagnify} />}
                onClick={open}
                isDisabled={isServerSide}
                // Mount dialog (preload lazy bundle) on `focus` and `mouseenter`
                onFocus={partial(setMountDialog, true)}
                onMouseEnter={partial(setMountDialog, true)}
            >
                Search
                <kbd className={classNames('search-shortcut', isServerSide && 'search-shortcut--hidden')}>
                    <kbd>{IS_MAC ? '⌘' : 'Ctrl'}</kbd>
                    <kbd>K</kbd>
                </kbd>
            </Chip>

            {NAVIGATOR && (shouldMountDialog || isOpen) && (
                <SearchDialog
                    isOpen={isOpen}
                    onClose={close}
                    parentElement={buttonRef}
                    onVisibilityChange={setMountDialog}
                />
            )}
        </>
    );
};
