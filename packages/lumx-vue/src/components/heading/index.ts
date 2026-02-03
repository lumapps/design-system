import { CLASSNAME, HeadingProps } from '@lumx/core/js/components/Heading';

import Heading from './Heading.vue';
import HeadingLevelProvider from './HeadingLevelProvider.vue';
import { useHeadingLevel } from './useHeadingLevel';

Heading.className = CLASSNAME;

export { Heading, HeadingLevelProvider, useHeadingLevel };
export type { HeadingProps };
