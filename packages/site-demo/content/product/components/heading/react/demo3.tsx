import { ReactNode } from 'react';
import { Heading, HeadingLevelProvider, Text } from '@lumx/react';

const Article = ({ title, children }: { title: string; children?: ReactNode }) => (
    <article className="lumx-spacing-padding-left-big">
        <HeadingLevelProvider>
            <Heading>{title}</Heading>
            <Text as="p">Article content</Text>
            {children}
        </HeadingLevelProvider>
    </article>
);

export default () => (
    <Article title="Article 1 title">
        <Article title="Article 1.1 title">
            <Article title="Article 1.1.1 title" />
        </Article>
        <Article title="Article 1.2 title" />
    </Article>
);
