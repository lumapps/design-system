import { Emphasis, IconButton, SideNavigation, SideNavigationItem, SideNavigationItemProps } from '@lumx/react';
import { Link as RouterLink } from 'gatsby';
import includes from 'lodash/includes';
import partial from 'lodash/partial';
import without from 'lodash/without';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { mdiClose } from '@lumx/icons';
import { MenuEntry } from '@lumx/demo/components/layout/MainNav/types';
import { useMenuItems } from '@lumx/demo/components/layout/MainNav/useMenuItems';
import { HomeLogoLink } from '@lumx/demo/components/layout/MainNav/HomeLogoLink/HomeLogoLink';
import { onEscapePressed } from '@lumx/core/js/utils';
import { ResponsiveTopBar } from '@lumx/demo/components/layout/MainNav/ResponsiveTopBar/ResponsiveTopBar';

import './MainNav.scss';

const EMPHASIS_BY_LEVEL: Record<string, Emphasis> = {
    '1': Emphasis.high,
    '2': Emphasis.medium,
    '3': Emphasis.low,
};

const renderNavItem = (
    openPaths: string[],
    toggleOpenPath: (path: string) => void,
    getChildren: (entry: MenuEntry) => MenuEntry[] | null,
    locationPath: string,
    menuEntry: MenuEntry,
) => {
    const { label, path } = menuEntry;
    const children = getChildren(menuEntry);
    const level = path.split('/').length - 2;
    const props: SideNavigationItemProps = {
        label,
        emphasis: EMPHASIS_BY_LEVEL[level],
        isOpen: includes(openPaths, path),
        isSelected: locationPath === path,
        toggleButtonProps: { label: 'Toggle' },
    };

    if (!children?.length) {
        // Menu using router Link.
        props.linkAs = RouterLink;
        props.linkProps = { to: path } as any;
    } else {
        props.onClick = partial(toggleOpenPath, path);
        props.children = children.map(partial(renderNavItem, openPaths, toggleOpenPath, getChildren, locationPath));
    }

    return <SideNavigationItem key={path} {...props} />;
};

const getParentPaths = (path: string) => {
    let parentPath = path;
    const parentPaths: string[] = [];
    do {
        parentPaths.push((parentPath = parentPath.replace(/[^/]*\/?$/, '')));
    } while (parentPath.length > 1);
    return parentPaths;
};

/**
 * The main navigation component.
 *
 * @param  props nav props
 * @return The main navigation component.
 */
export const MainNav: React.FC<{ location?: Location }> = ({ location }) => {
    const locationPath = location?.pathname || '';
    const { rootMenuEntries, getChildren } = useMenuItems();

    // List of path opened in the menu.
    const [openPaths, setOpenPaths] = useState<string[]>(() => getParentPaths(locationPath));
    const toggleOpenPath = (path: string) =>
        setOpenPaths((previousOpenPaths) => {
            return includes(previousOpenPaths, path) ? without(previousOpenPaths, path) : [...previousOpenPaths, path];
        });

    // Handle responsive menu open/close.
    const openNavButtonRef = useRef<HTMLElement>(null);
    const closeNavButtonRef = useRef<HTMLElement>(null);
    const [isOpen, setOpen] = useState(false);
    const open = useCallback((evt?: any) => {
        setOpen(true);
        (document.activeElement as any)?.blur();
        // No pointer (keyboard nav) => focus the close nav button
        if (evt?.nativeEvent?.pointerType === '') {
            setTimeout(() => closeNavButtonRef.current?.focus(), 300);
        }
    }, []);
    const close = useCallback((evt?: any) => {
        setOpen(false);
        (document.activeElement as any)?.blur();
        // No pointer (keyboard nav) => focus the open nav button
        if (evt?.nativeEvent?.pointerType === '') {
            setTimeout(() => openNavButtonRef.current?.focus(), 300);
        }
    }, []);

    // Close on location change.
    useEffect(() => {
        if (locationPath) {
            close();
        }
    }, [close, locationPath]);

    return (
        <>
            <ResponsiveTopBar openNavButtonRef={openNavButtonRef} onOpen={open} />
            <button
                className={classNames('main-nav__overlay', isOpen && `main-nav__overlay--is-open`)}
                type="button"
                aria-label="Close the navigation menu"
                onKeyDown={onEscapePressed(close)}
                onClick={close}
            />
            <nav className={classNames('main-nav', isOpen && `main-nav--is-open`)}>
                <div className="main-nav__wrapper">
                    <IconButton
                        ref={closeNavButtonRef as any}
                        className="main-nav__close-button"
                        onClick={close}
                        label="Close the navigation menu"
                        icon={mdiClose}
                        emphasis="low"
                    />

                    <HomeLogoLink />

                    <SideNavigation>
                        {rootMenuEntries?.map(
                            partial(renderNavItem, openPaths, toggleOpenPath, getChildren, locationPath),
                        )}
                    </SideNavigation>
                </div>
            </nav>
        </>
    );
};
