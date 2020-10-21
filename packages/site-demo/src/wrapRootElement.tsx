import React from 'react';

import { MDXProvider } from '@mdx-js/react';
import 'focus-visible';
import 'intersection-observer';
import { preToCodeBlock } from 'mdx-utils';

import { DemoBlock } from '@lumx/demo/components/DemoBlock';
import { HighlightedCode } from '@lumx/demo/components/HighlightedCode';
import { Link } from '@lumx/demo/components/Link';
import { PropTable } from '@lumx/demo/components/PropTable';
import { ReactStabilityFlag } from '@lumx/demo/components/ReactStabilityFlag';
import { GlobalThemeProvider } from '@lumx/demo/global-theme';

/**
 * Customize MDX components.
 */
const mdxComponents = {
    pre: (preProps: any) => {
        const codeProps = preToCodeBlock(preProps);
        return codeProps ? <HighlightedCode {...codeProps} /> : <pre {...preProps} />;
    },
    inlineCode: (props: any) => <code {...props} />,
    ReactStabilityFlag,
    DemoBlock,
    PropTable,
    // Use router link when possible.
    a: Link,
};

/**
 * Wrap root React element to inject context providers.
 *
 * @return wrapped element.
 */
export const wrapRootElement = ({ element }: any) => (
    <GlobalThemeProvider>
        <MDXProvider components={mdxComponents}>{element}</MDXProvider>
    </GlobalThemeProvider>
);
