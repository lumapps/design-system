import React from 'react';
import { startViewTransition } from '@lumx/react/utils/browser/DOM/startViewTransition';
import uniqueId from 'lodash/uniqueId';
import { Chip, Icon } from '@lumx/react';
import { mdiEarth } from '@lumx/icons/index';

export default { title: 'utils/startViewTransitions' };

/**
 * Demonstrate animating transition on appearing element
 */
export const Appearing = () => {
    const [show, setShow] = React.useState(false);
    React.useEffect(() => {
        setTimeout(() => {
            startViewTransition(() => setShow(true));
        }, 1000);
    }, []);

    return show ? <span>Appearing text</span> : null;
};

/**
 * Demonstrate animating transition on disappearing element
 */
export const Disappearing = () => {
    const [show, setShow] = React.useState(true);

    React.useEffect(() => {
        setTimeout(() => {
            startViewTransition(() => setShow(false));
        }, 1000);
    }, []);

    return show ? <span>Disappearing text</span> : null;
};

/**
 * Demonstrate animating transition on morphing from one element to another
 */
export const Morphing = () => {
    const [isBefore, setIsBefore] = React.useState(true);
    const beforeRef = React.useRef(null);
    const afterRef = React.useRef(null);
    const chipRef = React.useRef<HTMLAnchorElement>(null);
    const toggle = () => {
        // Transition between the before and after icons
        const iconBeforeAfterGroup = {
            name: uniqueId('icon-transition'),
            old: isBefore ? beforeRef : afterRef,
            new: isBefore ? afterRef : beforeRef,
        };
        // Transition the label with itself
        const chipLabel = chipRef.current?.querySelector('.lumx-chip__label');
        const labelGroup = {
            name: uniqueId('label'),
            old: chipLabel,
            new: chipLabel,
        };
        startViewTransition(() => setIsBefore(!isBefore), {
            groups: [iconBeforeAfterGroup, labelGroup],
        });
    };
    return (
        <Chip
            ref={chipRef}
            before={isBefore && <Icon ref={beforeRef} icon={mdiEarth} />}
            onClick={toggle}
            after={!isBefore && <Icon ref={afterRef} icon={mdiEarth} />}
        >
            Click to move the icon before/after
        </Chip>
    );
};
