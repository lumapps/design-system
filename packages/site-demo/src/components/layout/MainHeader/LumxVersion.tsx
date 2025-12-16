import { mdiTagOutline } from '@lumx/icons';
import { Button, Emphasis, Size } from '@lumx/react';
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
            className="lumx-version-link"
            emphasis={Emphasis.low}
            size={Size.s}
            leftIcon={mdiTagOutline}
            href={`https://github.com/lumapps/design-system/blob/v${version}/CHANGELOG.md`}
            target="_blank"
        >
            v{version}
        </Button>
    );
};
