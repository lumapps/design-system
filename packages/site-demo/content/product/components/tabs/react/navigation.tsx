import { Tab, TabList, type Theme } from '@lumx/react';
import { HashNavLink } from '@lumx/demo/components/content/HashNavLink';

/** TabList used as a <nav> with tab links (using URL #hash) */
export default ({ theme }: { theme?: Theme }) => (
    <TabList theme={theme} aria-label="Tab list">
        <Tab as={HashNavLink} hash="#" label="Tab 1" />
        <Tab as={HashNavLink} hash="#tab-2" label="Tab 2" />
        <Tab as={HashNavLink} hash="#tab-3" label="Tab 3" />
    </TabList>
);
