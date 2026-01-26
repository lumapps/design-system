import { graphql, useStaticQuery } from 'gatsby';

const query = graphql`
    query LumxVersion {
        site {
            siteMetadata {
                version
            }
        }
    }
`;

/** Hook to get the current @lumx version from site metadata */
export function useLumxVersion(): string {
    const data = useStaticQuery(query);
    return data.site.siteMetadata.version;
}
