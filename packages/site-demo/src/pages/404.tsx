import React from 'react';

import { PageHead } from '@lumx/demo/components/PageHead';

const Page404: React.FC = () => (
    <>
        <PageHead title="404: Not Found" />
        <h1>Not Found</h1>
        <p>You just hit a route that doesn&apos;t exist... the sadness.</p>
    </>
);
export default Page404;
