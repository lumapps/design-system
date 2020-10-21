import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import Helmet, { HelmetProps } from 'react-helmet';

const query = graphql`
    query Query {
        site {
            siteMetadata {
                title
                description
            }
        }
    }
`;

interface Props {
    title: string;
    description?: string;
    keywords?: string[];
    lang?: string;
    meta?: HelmetProps['meta'];
}

const DEFAULT_KEYWORDS = ['lumapps', 'design system', 'lumx', 'react'];

/**
 * Provide SEO using `react-helmet` to inject data in the document <head>.
 */
export const PageHead: React.FC<Props> = (props) => {
    const { description, lang = 'en', meta = [], keywords = DEFAULT_KEYWORDS, title } = props;
    const { site } = useStaticQuery(query);
    const siteTitle = site.siteMetadata.title;
    const metaDescription = description || site.siteMetadata.description;

    return (
        <Helmet>
            <html lang={lang} />

            <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>

            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

            {/* SEO */}
            <meta name="description" content={metaDescription} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:type" content="website" />
            {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
            {meta.length > 0 && meta.map((m) => <meta {...m} />)}
        </Helmet>
    );
};
