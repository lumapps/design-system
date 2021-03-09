import React, { Dispatch, SetStateAction } from 'react';
import noop from 'lodash/noop';
import { Intersections } from '../../hooks/useIntersectionObserver';

export const IntersectionContext = React.createContext<{
    intersections: Intersections<Element>;
    sentinelTop: Element | null;
    sentinelBottom: Element | null;
    setSentinelTop: Dispatch<SetStateAction<Element | null>>;
    setSentinelBottom: Dispatch<SetStateAction<Element | null>>;
}>({
    intersections: new Map(),
    sentinelTop: null,
    sentinelBottom: null,
    setSentinelTop: noop,
    setSentinelBottom: noop,
});
