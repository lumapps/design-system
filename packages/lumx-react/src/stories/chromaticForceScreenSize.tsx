/* eslint-disable */
import React from 'react';
import isChromatic from 'chromatic/isChromatic';

/** Story decorator used to force a minimum screen size when running in chromatic */
export const chromaticForceScreenSize = (story: any) =>
    isChromatic() ? <div style={{ minWidth: 1200, minHeight: 800 }}>{story()}</div> : story();
