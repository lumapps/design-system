const execSync = require('child_process').execSync;
const { ROOT_PATH } = require('../../../../../configs/path');

module.exports = function exec(cmd) {
    console.log(cmd);
    try {
        execSync(cmd, { cwd: ROOT_PATH });
    } catch ({ stderr, stdout }) {
        console.error(stdout.toString(), stderr.toString());
    }
}
