import { Emphasis, IconButton, SideNavigation, SideNavigationItem, SideNavigationItemProps } from '@lumx/react';
import { Link as RouterLink } from 'gatsby';
import includes from 'lodash/includes';
import partial from 'lodash/partial';
import without from 'lodash/without';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { mdiClose } from '@lumx/icons';
import { MenuEntry } from '@lumx/demo/components/layout/MainNav/types';
import { useMenuItems } from '@lumx/demo/components/layout/MainNav/useMenuItems';
import { HomeLogoLink } from '@lumx/demo/components/layout/MainNav/HomeLogoLink/HomeLogoLink';
import { onEscapePressed } from '@lumx/core/js/utils';
import { useResponsiveNavState } from '@lumx/demo/components/layout/MainNav/useResponsiveNavState';

import './MainNav.scss';

type StateProps = Pick<ReturnType<typeof useResponsiveNavState>, 'closeNavButtonRef' | 'isMenuOpen' | 'closeMenu'>;
type MainNavProps = StateProps & { location?: Location };

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
        closeMode: 'hide',
        emphasis: EMPHASIS_BY_LEVEL[level],
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
        props.isOpen = openPaths.some((openPath) => openPath.startsWith(path));
    }

    return <SideNavigationItem key={path} {...props} />;
};

/**
 * The main navigation component.
 *
 * @param  props nav props
 * @return The main navigation component.
 */
export const MainNav: React.FC<MainNavProps> = (props) => {
    const { location, closeNavButtonRef, isMenuOpen, closeMenu } = props;
    const locationPath = location?.pathname || '';
    const { rootMenuEntries, getChildren } = useMenuItems();

    // List of path opened in the menu.
    const [openPaths, setOpenPaths] = useState<string[]>([locationPath]);
    const toggleOpenPath = (path: string) =>
        setOpenPaths((previousOpenPaths) => {
            return includes(previousOpenPaths, path) ? without(previousOpenPaths, path) : [...previousOpenPaths, path];
        });

    useEffect(() => {
        if (locationPath) {
            // Close responsive menu on location change.
            closeMenu();
            // Open menus for current location path.
            setOpenPaths([locationPath]);
            // Scroll to current page link.
            setTimeout(() => {
                document.querySelector('[aria-current]')?.scrollIntoView();
            }, 100);
        }
    }, [closeMenu, locationPath]);

    return (
        <>
            <button
                className={classNames('main-nav__overlay', isMenuOpen && 'main-nav__overlay--is-open')}
                type="button"
                aria-label="Close the navigation menu"
                onKeyDown={onEscapePressed(closeMenu)}
                onClick={closeMenu}
            />
            <nav className={classNames('main-nav', isMenuOpen && 'main-nav--is-open')}>
                <div className="main-nav__wrapper">
                    <IconButton
                        ref={closeNavButtonRef as any}
                        className="main-nav__close-button"
                        onClick={closeMenu}
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
