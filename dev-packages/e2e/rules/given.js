const { Given } = require('cucumber');

Given('the user opens the story {string}', async function openUrl(url) {
    await this.openPage(url);
});
