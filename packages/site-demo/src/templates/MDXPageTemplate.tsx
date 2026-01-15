import { PageHead } from '../components/base/PageHead';

interface Props {
    pageContext: {
        /** Page title. */
        title: string;
        /** Content excerpt. */
        excerpt: string;
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
