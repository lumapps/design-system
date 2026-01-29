import React from 'react';
import { CodeBlock } from '@lumx/demo/components/content/CodeBlock/CodeBlock';
import { DemoBlock } from '@lumx/demo/components/content/DemoBlock/DemoBlock';
import { PropTable } from '@lumx/demo/components/content/PropTable/PropTable';
import { FrameworkOnly } from '@lumx/demo/components/content/FrameworkOnly';
import { FrameworkProvider } from '@lumx/demo/components/layout/FrameworkContext';
import { Link } from '@lumx/demo/components/base/Link';
import { Message } from '@lumx/react';
import { MDXProvider } from '@mdx-js/react';

import 'focus-visible';

/**
 * Customize MDX components.
 */
const mdxComponents = {
    pre(props: any) {
        const child = props.children;
        // MDX v2 wraps code blocks in <pre><code>...</code></pre>
        if (React.isValidElement(child) && (child.props as any).className) {
            const childProps = child.props as any;
            return <CodeBlock {...childProps}>{childProps.children?.trim()}</CodeBlock>;
        }
        return <pre {...props} />;
    },
    // Use router link when possible.
    a: Link,
    DemoBlock,
    PropTable,
    Message,
    FrameworkOnly,
};

/**
 * Wrap root React element to inject context providers.
 *
 * @return wrapped element.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const wrapRootElement = ({ element }: any) => (
    <FrameworkProvider>
        <MDXProvider components={mdxComponents}>{element}</MDXProvider>
    </FrameworkProvider>
);
