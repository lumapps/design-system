/* istanbul ignore file */

/**
 * Test util module. Do not import in production code !
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, within } from '@testing-library/react';
import { createTabTestUtils } from '@lumx/core/js/components/Tabs/TabProviderTestUtils';

export const { query, checkTabActive } = createTabTestUtils({ screen, within });
