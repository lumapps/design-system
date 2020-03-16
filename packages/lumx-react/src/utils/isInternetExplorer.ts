/**
 * Check if browser is IE
 * @return Browser is IE or not
 */
const isInternetExplorer = () => {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ');
    const isIEVersion = !!navigator.userAgent.match(/Trident.*rv\:11\./);
    return msie > 0 || isIEVersion;
};

export { isInternetExplorer };
