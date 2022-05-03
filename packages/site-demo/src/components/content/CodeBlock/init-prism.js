/* eslint-disable  */
import Prism from 'prism-react-renderer/prism';

// Import additional languages.
(typeof window !== 'undefined' ? window : global).Prism = Prism;
require('prismjs/components/prism-typescript');
require('prismjs/components/prism-jsx');
require('prismjs/components/prism-tsx');

// Import theme.
import theme from 'prism-react-renderer/themes/github';

export { theme };
