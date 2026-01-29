import { mdiTagOutline } from '@lumx/icons';
import { Button } from '@lumx/react';
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

export const LumxVersion: React.FC = () => {
    const data = useStaticQuery(query);
    const { version } = data.site.siteMetadata;
    return (
        <Button
            emphasis="low"
            size="s"
            leftIcon={mdiTagOutline}
            href={`https://github.com/lumapps/design-system/releases/tag/v${version}`}
            target="_blank"
        >
            v{version}
        </Button>
    );
};
