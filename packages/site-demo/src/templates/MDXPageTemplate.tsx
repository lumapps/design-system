import { graphql } from 'gatsby';
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
    children?: React.ReactNode;
}

/** Template for the MDX page content */
const MDXPageTemplate: React.FC<Props> = (props) => {
    const { children } = props;

    return (
        <>
            {/* MDX content render */}
            {children}
        </>
    );
};

export const Head: React.FC<Props> = ({ pageContext }) => (
    <PageHead title={pageContext.title} description={pageContext.excerpt} />
);

export default MDXPageTemplate;
