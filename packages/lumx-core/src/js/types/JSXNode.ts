import type React from 'react';

import type { JSX } from './jsx/jsx-runtime';

export type JSXNode = JSX.Literal | React.JSX.Element | Iterable<JSXNode>;
