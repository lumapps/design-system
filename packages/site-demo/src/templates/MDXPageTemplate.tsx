import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { PageHead } from '../components/base/PageHead';

export const pageQuery = graphql`
    query ($slug: String!) {
        mdx(fields: { slug: { eq: $slug } }) {
            body
        }
    }
`;

interface Props {
    pageContext: {
        /** Page title. */
        title: string;
        /** Content excerpt. */
        excerpt: string;
    };
    data: {
        mdx: {
            /** Precompiled MDX content ready to be displayed. */
            body: string;
        };
    };
}

/** Template for the MDX page content */
const MDXPageTemplate: React.FC<Props> = (props) => {
    const { data, pageContext } = props;

    return (
        <>
            {/* Update page title & description */}
            <PageHead title={pageContext.title} description={pageContext.excerpt} />
            {/* MDX content render */}
            <MDXRenderer>{data.mdx.body}</MDXRenderer>
        </>
    );
};

export default MDXPageTemplate;
