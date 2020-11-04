import { CodeBlock } from '@lumx/demo/components/CodeBlock';
import { DemoBlock } from '@lumx/demo/components/DemoBlock';
import { Link } from '@lumx/demo/components/Link';
import { PropTable } from '@lumx/demo/components/PropTable';
import { ReactStabilityFlag } from '@lumx/demo/components/ReactStabilityFlag';

import { MDXProvider } from '@mdx-js/react';
import 'focus-visible';
import 'intersection-observer';
import React from 'react';

/**
 * Customize MDX components.
 */
const mdxComponents = {
    pre(props: any) {
        const { children } = props;
        const codeProps = children?.props?.mdxType === 'code' && children?.props;
        if (codeProps) {
            return <CodeBlock {...codeProps} />;
        }
        return <pre {...props} />;
    },
    // eslint-disable-next-line react/display-name
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
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const wrapRootElement = ({ element }: any) => <MDXProvider components={mdxComponents}>{element}</MDXProvider>;
