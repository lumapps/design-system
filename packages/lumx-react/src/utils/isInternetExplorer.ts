import { WINDOW } from '@lumx/react/constants';

/**
 * Check if browser is IE
 * @return Browser is IE or not
 */
export const isInternetExplorer = () => {
    const userAgent = WINDOW?.navigator?.userAgent;
    if (!userAgent) {
        return false;
    }
    const msie = userAgent.indexOf('MSIE ');
    const isIEVersion = !!userAgent.match(/Trident.*rv:11\./);
    return msie > 0 || isIEVersion;
};
