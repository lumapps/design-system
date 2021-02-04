/* eslint-disable no-console */
import isFunction from 'lodash/isFunction';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';

/** Equivalent to CSS `selector1 > selector2 > selector3` selector */
interface PathSelector {
    /** Path to traverse (with find and dive) to find the component to snapshot. */
    path: Selector[];
}
const isPathSelector = (s: any): s is PathSelector => isPlainObject(s) && !!s.path;

/** Equivalent to CSS `selector1, selector2, selector3` selector */
interface OrSelector {
    or: Selector[];
}
const isOrSelector = (s: any): s is OrSelector => isPlainObject(s) && !!s.or;

type Selector = string | React.FC<any> | PathSelector | OrSelector;
type Wrappers = ShallowWrapper | ShallowWrapper[];

/** Use selector to find and dive into the given ShallowWrapper */
function findAndDive(wrappers: Wrappers, selector: Selector): Wrappers {
    if (isOrSelector(selector)) {
        return selector.or.flatMap((s) => findAndDive(wrappers, s)).filter(Boolean);
    }

    if (isPathSelector(selector)) {
        return selector.path.reduce(findAndDive, wrappers);
    }

    if (isArray(wrappers)) {
        return wrappers.flatMap((w) => findAndDive(w, selector)).filter(Boolean);
    }

    // Find.
    const foundWrapper = wrappers.find(selector as any);
    if (foundWrapper.length >= 1) {
        // Dive.
        return foundWrapper.map((w) => {
            if (typeof w.getElement().type === 'string') {
                // Don't dive into host element (ex: div, span, etc.)
                return w as any;
            }
            return w.dive();
        });
    }
    return foundWrapper as any;
}

interface Options {
    /** Inject props in stories. */
    props?: any;
}

/** Render stories and find wrapper to snapshot using selector. */
export function generateRenderedStories(
    stories: Record<string, any>,
    selector?: Selector,
    options?: Options,
): Record<string, Wrappers> {
    const storyProps: any = {};
    if (options?.props) {
        Object.assign(storyProps, options.props);
    }
    const rendered: Record<string, Wrappers> = {};

    for (const [name, Story] of Object.entries(stories)) {
        // eslint-disable-next-line no-continue
        if (!isFunction(Story)) continue;

        const wrapper = shallow(<Story {...storyProps} />);
        let toSnapshot: Wrappers = wrapper;
        if (selector) {
            toSnapshot = findAndDive(wrapper, selector);
            if (isArray(toSnapshot) && toSnapshot.length === 1) {
                // eslint-disable-next-line prefer-destructuring
                toSnapshot = toSnapshot[0];
            }
        }
        rendered[name] = toSnapshot;
    }
    return rendered;
}

/**
 * Generate jest snapshot testing from stories.
 *
 * **Warning: Always read and validate your snapshots before committing!**
 *
 * @param stories  Object of stories indexed by name.
 * @param selector Selector(s) used to find the correct element to snapshot.
 * @param options  Other options (see {@link Options})
 */
export function itShouldRenderStories(stories: Record<string, any>, selector?: Selector, options?: Options): void {
    for (const [story, toSnapshot] of Object.entries(generateRenderedStories(stories, selector, options))) {
        it(`should render story '${story}'`, () => {
            expect(toSnapshot).toMatchSnapshot();
        });
    }
}
