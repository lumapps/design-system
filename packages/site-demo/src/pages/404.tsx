import React from 'react';
import { PageHead } from '../components/base/PageHead';

const Page404: React.FC = () => (
    <>
        <h1>Not Found</h1>
        <p>You just hit a route that doesn&apos;t exist... the sadness.</p>
    </>
);

export const Head: React.FC = () => <PageHead title="404: Not Found" />;

export default Page404;
