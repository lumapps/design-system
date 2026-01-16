import type React from 'react';
import type * as Vue from '@vue/runtime-dom';

import type { JSX } from './jsx/jsx-runtime';

export type JSXNode = JSX.Literal | React.JSX.Element | Vue.VNode | Iterable<JSXNode>;
