import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import React from 'react';

import { PageHead } from '../components/base/PageHead';

export const pageQuery = graphql`
    query($slug: String!) {
        mdx(fields: { slug: { eq: $slug } }) {
            id
            excerpt(pruneLength: 160)
            frontmatter {
                title
            }
            body
        }
    }
`;

interface Props {
    data: {
        mdx: {
            /** Precompiled MDX content ready to be displayed. */
            body: string;
            /** Automatically generated markdown content excerpt. */
            excerpt: string;
            /** Markdown frontmatter data {@link https://www.gatsbyjs.com/docs/mdx/writing-pages}. */
            frontmatter: { title: string; date: string };
        };
    };
    pageContext: {
        firstH1: string;
    };
}

/** Template for the MDX page content */
const MDXPageTemplate: React.FC<Props> = (props) => {
    const { data, pageContext } = props;
    const { frontmatter, excerpt, body } = data.mdx;

    return (
        <>
            {/* Update page title (frontmatter title or first found H1) & description */}
            <PageHead title={frontmatter.title || pageContext.firstH1} description={excerpt} />
            {/* MDX content render */}
            <MDXRenderer>{body}</MDXRenderer>
        </>
    );
};

export default MDXPageTemplate;
