import isEmpty from 'lodash/isEmpty';

import { setCustomColors } from '@lumx/core/custom-colors';

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Insert an element after another.
 *
 * @param {DOMElement} newNode       The node to insert.
 * @param {DOMElement} referenceNode The node to insert after.
 */
function _insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/**
 * Inject a script in the DOM.
 *
 * @param  {string}  scriptPath  The path to the script to inject.
 * @param  {string}  [id]        The HTML id of the script element.
 * @param  {string}  [afterId]   The HTML id of the element to inject the script after.
 * @param  {boolan}  [wait=true] Indicates if we want to wait for the script to be loaded before resolving the promise.
 * @return {Promise} A promise that resolves when the script has been loaded.
 */
function _injectScript(scriptPath, id, afterId, wait = true) {
    return new Promise((resolve) => {
        const newScript = document.createElement('script');

        let afterElement;
        let targetElement = document.body;
        if (!isEmpty(afterId)) {
            afterElement = document.getElementById(afterId);

            if (!isEmpty(afterElement)) {
                targetElement = afterElement.parentNode;
            }
        }

        if (!isEmpty(id)) {
            newScript.id = id;
        }

        if (isEmpty(afterElement)) {
            targetElement.append(newScript);
        } else {
            _insertAfter(newScript, afterElement);
        }

        if (wait) {
            newScript.addEventListener('load', resolve);
            newScript.addEventListener('error', resolve);
        }

        newScript.charset = 'UTF-8';
        newScript.src = scriptPath;

        if (!wait) {
            resolve();
        }
    });
}

/////////////////////////////
//                         //
//     Public functions    //
//                         //
/////////////////////////////

/**
 * Change the theme.
 * This will change the theme of the demo site and the theme of LumX.
 * This will also cleanup the DOM and remove old themes styles and scripts.
 *
 * @see {@link /demo/constants.d.ts} for the possible value for the theme.
 *
 * @param  {Theme}          theme The theme to enable.
 * @return {Promise<Theme>} The promise of the change.
 */
function changeTheme(theme) {
    // eslint-disable-next-line no-unused-expressions
    document.getElementById('demo-theme')?.remove();
    // eslint-disable-next-line no-unused-expressions
    document.getElementById('lumx-theme')?.remove();

    const promises = [
        _injectScript(`demo-theme-${theme}.js`, 'demo-theme', undefined, true),
        _injectScript(`lumx-theme-${theme}.js`, 'lumx-theme', undefined, true),
    ];

    return Promise.all(promises).then(() => {
        const styleTags = Array.prototype.slice.call(document.head.getElementsByTagName('style')).reverse();

        const stylesFound = {
            demo: false,
            lumx: false,
        };

        styleTags.forEach((styleTag) => {
            const content = styleTag.textContent || '';

            if (content.indexOf('/** DEMO THEME */') > -1) {
                if (stylesFound.demo) {
                    styleTag.remove();
                } else {
                    stylesFound.demo = true;
                }
            } else if (content.indexOf('/** LUMX THEME */') > -1) {
                if (stylesFound.lumx) {
                    styleTag.remove();
                } else {
                    stylesFound.lumx = true;
                }
            }
        });

        return theme;
    });
}

/**
 * Set primary and secondary custom colors.
 *
 * @param {string} theme The theme to apply the custom color palete on.
 */
function setDemoCustomColors(theme) {
    const styleTag = document.createElement('style');
    document.head.appendChild(styleTag);

    const { sheet } = styleTag;

    setCustomColors(sheet, theme, {
        primary: {
            D2: '#fea41c',
            D1: '#ffb71f',
            // eslint-disable-next-line id-length
            N: '#ffc525',
            L1: 'rgba(255, 197, 37, 0.8)',
            L2: 'rgba(255, 197, 37, 0.6)',
            L3: 'rgba(255, 197, 37, 0.4)',
            L4: 'rgba(255, 197, 37, 0.2)',
            L5: 'rgba(255, 197, 37, 0.1)',
            L6: 'rgba(255, 197, 37, 0.05)',
        },
        secondary: {
            D2: '#c2395a',
            D1: '#d83e5e',
            // eslint-disable-next-line id-length
            N: '#e94361',
            L1: 'rgba(233, 67, 97, 0.8)',
            L2: 'rgba(233, 67, 97, 0.6)',
            L3: 'rgba(233, 67, 97, 0.4)',
            L4: 'rgba(233, 67, 97, 0.2)',
            L5: 'rgba(233, 67, 97, 0.1)',
            L6: 'rgba(233, 67, 97, 0.05)',
        },
    });
}

/////////////////////////////

export { changeTheme, setDemoCustomColors };
