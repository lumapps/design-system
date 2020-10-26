import Layout from '@lumx/demo/components/layout';
import React from 'react';

/**
 * Wrap the page element into a layout.
 * This is useful for setting wrapper components around pages that won’t get unmounted on page changes.
 *
 * @return wrapped element.
 */
export const wrapPageElement = ({ element, props }: any) => <Layout {...props}>{element}</Layout>;
