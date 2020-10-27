import React from 'react';

import { MDXProvider } from '@mdx-js/react';
import 'focus-visible';
import 'intersection-observer';

import { CodeBlock } from '@lumx/demo/components/CodeBlock';
import { DemoBlock } from '@lumx/demo/components/DemoBlock';
import { Link } from '@lumx/demo/components/Link';
import { PropTable } from '@lumx/demo/components/PropTable';
import { ReactStabilityFlag } from '@lumx/demo/components/ReactStabilityFlag';
import { GlobalThemeProvider } from '@lumx/demo/global-theme';

/**
 * Customize MDX components.
 */
const mdxComponents = {
    pre(props: any) {
        const codeProps = props.children?.props?.mdxType === 'code' && props.children?.props;
        if (codeProps) {
            return <CodeBlock {...codeProps} />;
        }
        return <pre {...props} />;
    },
    inlineCode: (props: any) => <code {...props} />,
    // Use router link when possible.
    a: Link,
    ReactStabilityFlag,
    DemoBlock,
    PropTable,
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
